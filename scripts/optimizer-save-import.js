/* =========================================================
   DD1 Optimizer Save Import

   This file is intentionally separate from save-import.js.
   It reads heroes and equipped gear for optimizer.html only.
========================================================= */

(() => {
    "use strict";

    const optimizerSaveInput = document.querySelector("#optimizer-save-file-input");
    const optimizerSaveOutput = document.querySelector("#optimizer-save-file-output");

    const optimizerEquipmentStatIndex = {
        heroHealth: 1,
        heroSpeed: 2,
        heroDamage: 3,
        heroCasting: 4,
        ability1: 5,
        ability2: 6,
        towerHealth: 7,
        towerRate: 8,
        towerDamage: 9,
        towerRangeOrSpecial: 10
    };

    const optimizerEquipmentQualityNames = [
        "Godly",
        "Legendary",
        "Epic",
        "Amazing",
        "Powerful",
        "Shining",
        "Polished",
        "Sturdy",
        "Solid",
        "Stocky",
        "Worn",
        "Torn",
        "Cursed",
        "Mythical",
        "Transcendent",
        "Supreme",
        "Ultimate 90",
        "Ultimate 93",
        "Ultimate+",
        "Ultimate++"
    ];

    const optimizerHeroTemplateMap = {
        "DunDefPlayers.HeroTemplateApprentice": "Apprentice",
        "DunDefPlayers.HeroTemplateSquire": "Squire",
        "DunDefPlayers.HeroTemplateInitiate": "Huntress",
        "DunDefPlayers.HeroTemplateRecruit": "Monk",
        "DunDefNewHeroes.HeroTemplateSorceress": "Adept",
        "DunDefNewHeroes.HeroTemplateLadyKnight": "Countess",
        "DunDefNewHeroes.HeroTemplateHunter": "Ranger",
        "DunDefNewHeroes.HeroTemplateMonkette": "Initiate",
        "DunDefNewHeroes.HeroTemplateJester": "Jester",
        "DunDefNewHeroes.HeroTemplateSummoner": "Summoner",
        "DunDefNewHeroes.HeroTemplateRobotGirl": "Series EV",
        "DunDefNewHeroes.HeroTemplateBarbarian": "Barbarian",
        "Hermit.hero.HeroArchetypes.HeroTemplateHermit": "Hermit",
        "Gunwitch.hero.HeroArchetypes.HeroTemplateGunwitch": "Gunwitch",
        "Warden.hero.Archetype.HeroTemplateWarden": "Warden",
        "Guardian.hero.Archetypes.HeroTemplateGuardian": "Guardian"
    };

    const optimizerImportedClassRoles = {
        "Hermit": ["Builder", "DPS", "Ability DPS", "Hybrid"],
        "Gunwitch": ["DPS", "Ability DPS", "Hybrid"],
        "Warden": ["Builder", "DPS", "Ability DPS", "Hybrid"],
        "Guardian": ["Builder", "Waller", "DPS", "Ability DPS", "Hybrid"]
    };

    function extendOptimizerClassData() {
        if (typeof heroClasses !== "undefined") {
            Object.keys(optimizerImportedClassRoles).forEach((className) => {
                if (!heroClasses.includes(className)) {
                    heroClasses.push(className);
                }
            });
        }

        if (typeof rolesByClass !== "undefined") {
            Object.entries(optimizerImportedClassRoles).forEach(([className, roles]) => {
                rolesByClass[className] = roles;
            });
        }
    }

    /* =========================================================
       5. Debug Byte Helpers
    ========================================================= */

    function debugBytes(bytes, start, count) {
        if (!bytes) {
            return "";
        }

        const safeStart = Math.max(start, 0);
        const end = Math.min(safeStart + count, bytes.length);
        const output = [];

        for (let index = safeStart; index < end; index++) {
            output.push(bytes[index].toString(16).padStart(2, "0"));
        }

        return output.join(" ");
    }


    function bytesToAscii(bytes, start, count) {
        if (!bytes) {
            return "";
        }

        const safeStart = Math.max(start, 0);
        const end = Math.min(safeStart + count, bytes.length);
        let output = "";

        for (let index = safeStart; index < end; index++) {
            const byte = bytes[index];

            if (byte >= 32 && byte <= 126) {
                output += String.fromCharCode(byte);
            } else {
                output += ".";
            }
        }

        return output;
    }


    function describeError(error) {
        if (!error) {
            return "Unknown error";
        }

        if (error.message) {
            return error.message;
        }

        return String(error);
    }


    /* =========================================================
       6. Small Binary Helpers
    ========================================================= */

    function readI32At(bytes, position) {
        if (position < 0 || position + 4 > bytes.length) {
            return null;
        }

        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        return view.getInt32(position, true);
    }


    function readAsciiStringAt(bytes, position, length) {
        if (position < 0 || position + length > bytes.length) {
            return "";
        }

        const raw = bytes.slice(position, position + length);
        const decoder = new TextDecoder("windows-1252");

        return decoder.decode(raw).replace(/\0+$/, "").trim();
    }

    /* =========================================================
       7. Zlib Block Search and Decompression
    ========================================================= */

    function looksLikeZlibHeader(rawBytes, position) {
        if (position < 0 || position + 1 >= rawBytes.length) {
            return false;
        }

        const firstByte = rawBytes[position];
        const secondByte = rawBytes[position + 1];

        const knownMagicHeader = (
            (firstByte === 0x78 && secondByte === 0x9c) ||
            (firstByte === 0x78 && secondByte === 0x01) ||
            (firstByte === 0x78 && secondByte === 0xda) ||
            (firstByte === 0x78 && secondByte === 0x5e)
        );

        if (knownMagicHeader) {
            return true;
        }

        const compressionMethod = firstByte & 0x0f;
        const compressionInfo = firstByte >> 4;

        if (compressionMethod !== 8) {
            return false;
        }

        if (compressionInfo > 7) {
            return false;
        }

        const headerValue = (firstByte << 8) + secondByte;

        return headerValue % 31 === 0;
    }


    function findZlibHeaderOffsets(rawBytes) {
        const offsets = [];

        for (let position = 0; position < rawBytes.length - 1; position++) {
            if (looksLikeZlibHeader(rawBytes, position)) {
                offsets.push(position);
            }
        }

        return offsets;
    }


    function parseDunCompressedBlockTable(rawBytes) {
        const totalCompressedSize = readI32At(rawBytes, 28);
        const totalDecompressedSize = readI32At(rawBytes, 32);

        if (
            totalCompressedSize === null ||
            totalDecompressedSize === null ||
            totalCompressedSize <= 0 ||
            totalDecompressedSize <= 0 ||
            totalCompressedSize > rawBytes.length
        ) {
            return null;
        }

        const blockTableEntries = [];
        let tablePosition = 36;
        let compressedTotal = 0;
        let decompressedTotal = 0;

        while (
            tablePosition + 8 <= rawBytes.length &&
            compressedTotal < totalCompressedSize
        ) {
            const compressedSize = readI32At(rawBytes, tablePosition);
            const decompressedSize = readI32At(rawBytes, tablePosition + 4);

            if (
                compressedSize === null ||
                decompressedSize === null ||
                compressedSize <= 0 ||
                decompressedSize <= 0 ||
                compressedSize > rawBytes.length ||
                decompressedSize > 1024 * 1024 * 4
            ) {
                return null;
            }

            blockTableEntries.push({
                compressedSize: compressedSize,
                decompressedSize: decompressedSize
            });

            compressedTotal += compressedSize;
            decompressedTotal += decompressedSize;
            tablePosition += 8;

            if (blockTableEntries.length > 200) {
                return null;
            }
        }

        if (compressedTotal !== totalCompressedSize) {
            return null;
        }

        const dataStart = tablePosition;
        const dataEnd = dataStart + totalCompressedSize;

        if (dataEnd > rawBytes.length) {
            return null;
        }

        if (!looksLikeZlibHeader(rawBytes, dataStart)) {
            return null;
        }

        return {
            dataStart: dataStart,
            dataEnd: dataEnd,
            totalCompressedSize: totalCompressedSize,
            totalDecompressedSize: totalDecompressedSize,
            blockTableEntries: blockTableEntries
        };
    }


    function inflateExactZlibBlock(rawBytes, offset, compressedSize, expectedDecompressedSize) {
        try {
            const end = offset + compressedSize;
            const compressedBytes = rawBytes.slice(offset, end);
            const decompressedBytes = pako.inflate(compressedBytes);

            if (!decompressedBytes || decompressedBytes.length === 0) {
                return {
                    success: false,
                    error: "Block inflated to empty data."
                };
            }

            return {
                success: true,
                offset: offset,
                end: end,
                rawLength: compressedSize,
                expectedDecompressedSize: expectedDecompressedSize,
                decompressedBytes: decompressedBytes,
                decompressedSize: decompressedBytes.length,
                error: ""
            };
        } catch (error) {
            return {
                success: false,
                error: describeError(error)
            };
        }
    }


    function decompressUsingDunBlockTable(rawBytes, blockTable) {
        const blocks = [];
        let compressedOffset = blockTable.dataStart;

        blockTable.blockTableEntries.forEach((entry, index) => {
            const block = inflateExactZlibBlock(
                rawBytes,
                compressedOffset,
                entry.compressedSize,
                entry.decompressedSize
            );

            if (!block.success) {
                throw new Error(
                    `Failed to decompress save block ${index + 1}: ${block.error}`
                );
            }

            block.blockNumber = index + 1;
            blocks.push(block);

            compressedOffset += entry.compressedSize;
        });

        return buildCombinedDecompression(rawBytes, findZlibHeaderOffsets(rawBytes), blocks, false, "");
    }


    function tryInflateZlibTail(rawBytes, offset) {
        try {
            const compressedBytes = rawBytes.slice(offset);
            const decompressedBytes = pako.inflate(compressedBytes);

            if (!decompressedBytes || decompressedBytes.length === 0) {
                return null;
            }

            return {
                success: true,
                offset: offset,
                end: rawBytes.length,
                rawLength: rawBytes.length - offset,
                expectedDecompressedSize: null,
                decompressedBytes: decompressedBytes,
                decompressedSize: decompressedBytes.length,
                error: ""
            };
        } catch {
            return null;
        }
    }


    function tryInflateZlibBetweenHeaders(rawBytes, offset, nextOffset) {
        try {
            const compressedBytes = rawBytes.slice(offset, nextOffset);
            const decompressedBytes = pako.inflate(compressedBytes);

            if (!decompressedBytes || decompressedBytes.length === 0) {
                return null;
            }

            return {
                success: true,
                offset: offset,
                end: nextOffset,
                rawLength: nextOffset - offset,
                expectedDecompressedSize: null,
                decompressedBytes: decompressedBytes,
                decompressedSize: decompressedBytes.length,
                error: ""
            };
        } catch {
            return null;
        }
    }


    function decompressUsingZlibMagicScan(rawBytes) {
        const zlibHeaderOffsets = findZlibHeaderOffsets(rawBytes);
        const blocks = [];
        let totalDecompressed = 0;

        const maxBlocks = 200;
        const maxTotalSize = 1024 * 1024 * 50;

        for (let index = 0; index < zlibHeaderOffsets.length; index++) {
            if (blocks.length >= maxBlocks) {
                throw new Error(`Too many zlib blocks found. Max allowed: ${maxBlocks}`);
            }

            const offset = zlibHeaderOffsets[index];

            const alreadyInsideKnownBlock = blocks.some((block) => {
                return offset >= block.offset && offset < block.end;
            });

            if (alreadyInsideKnownBlock) {
                continue;
            }

            const nextOffset = index + 1 < zlibHeaderOffsets.length
                ? zlibHeaderOffsets[index + 1]
                : rawBytes.length;

            let block = tryInflateZlibBetweenHeaders(rawBytes, offset, nextOffset);

            if (!block) {
                block = tryInflateZlibTail(rawBytes, offset);
            }

            if (!block) {
                continue;
            }

            totalDecompressed += block.decompressedSize;

            if (totalDecompressed > maxTotalSize) {
                throw new Error(
                    `Total decompressed save size exceeded ${maxTotalSize.toLocaleString()} bytes.`
                );
            }

            block.blockNumber = blocks.length + 1;
            blocks.push(block);
        }

        if (blocks.length === 0) {
            return null;
        }

        blocks.sort((a, b) => {
            return a.offset - b.offset;
        });

        blocks.forEach((block, index) => {
            block.blockNumber = index + 1;
        });

        return buildCombinedDecompression(
            rawBytes,
            zlibHeaderOffsets,
            blocks,
            false,
            ""
        );
    }


    function buildCombinedDecompression(rawBytes, zlibHeaderOffsets, blocks, usedRawFallback, fallbackReason) {
        let combinedSize = 0;

        blocks.forEach((block) => {
            combinedSize += block.decompressedBytes.length;
        });

        const combinedBytes = new Uint8Array(combinedSize);
        let combinedOffset = 0;

        blocks.forEach((block) => {
            block.combinedStart = combinedOffset;

            combinedBytes.set(block.decompressedBytes, combinedOffset);
            combinedOffset += block.decompressedBytes.length;

            block.combinedEnd = combinedOffset;
        });

        return {
            rawBytes: rawBytes,
            zlibHeaderOffsets: zlibHeaderOffsets,
            compressedHeaderOffsets: zlibHeaderOffsets.map((offset) => {
                return {
                    offset: offset,
                    type: "zlib"
                };
            }),
            blocks: blocks,
            blockCount: blocks.length,
            combinedBytes: combinedBytes,
            combinedSize: combinedBytes.length,
            usedRawFallback: usedRawFallback,
            fallbackReason: fallbackReason
        };
    }


    function createRawFallbackDecompression(rawBytes, reason) {
        return {
            rawBytes: rawBytes,
            zlibHeaderOffsets: findZlibHeaderOffsets(rawBytes),
            compressedHeaderOffsets: [],
            blocks: [],
            blockCount: 0,
            combinedBytes: rawBytes,
            combinedSize: rawBytes.length,
            usedRawFallback: true,
            fallbackReason: reason
        };
    }


    function decompressDunFile(arrayBuffer) {
        const rawBytes = new Uint8Array(arrayBuffer);

        const blockTable = parseDunCompressedBlockTable(rawBytes);

        if (blockTable) {
            const tableResult = decompressUsingDunBlockTable(rawBytes, blockTable);
            tableResult.blockTable = blockTable;
            tableResult.decompressionMethod = "dd1-block-table";
            return tableResult;
        }

        const magicScanResult = decompressUsingZlibMagicScan(rawBytes);

        if (magicScanResult) {
            magicScanResult.decompressionMethod = "zlib-magic-scan";
            return magicScanResult;
        }

        return createRawFallbackDecompression(
            rawBytes,
            "Could not read the Dungeon Defenders block table or decompress zlib streams, so the importer scanned the raw file bytes instead."
        );
    }


    /* =========================================================
       10. Structured Save Deserializer
    ========================================================= */

    class SaveBinaryReader {
        constructor(bytes) {
            this.bytes = bytes;
            this.position = 0;
            this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        }

        remaining() {
            return this.bytes.length - this.position;
        }

        requireBytes(count, label) {
            if (this.position + count > this.bytes.length) {
                throw new Error(`Unexpected end of save while reading ${label}.`);
            }
        }

        readI8(label = "i8") {
            this.requireBytes(1, label);
            const value = this.view.getInt8(this.position);
            this.position += 1;
            return value;
        }


        readU8(label = "u8") {
            this.requireBytes(1, label);
            const value = this.view.getUint8(this.position);
            this.position += 1;
            return value;
        }

        readBool(label = "bool") {
            const value = this.readI8(label);

            if (value === 0) {
                return false;
            }

            if (value === 1) {
                return true;
            }

            throw new Error(`Invalid bool value ${value} while reading ${label}.`);
        }

        readI32(label = "i32") {
            this.requireBytes(4, label);
            const value = this.view.getInt32(this.position, true);
            this.position += 4;
            return value;
        }

        readF32(label = "f32") {
            this.requireBytes(4, label);
            const value = this.view.getFloat32(this.position, true);
            this.position += 4;
            return value;
        }

        readOptionString(label = "Option<String>") {
            const sizeRaw = this.readI32(`${label} length`);

            if (sizeRaw === 0) {
                return null;
            }

            const isUtf16 = sizeRaw < 0;
            const characterCount = Math.abs(sizeRaw);
            const byteCount = isUtf16 ? characterCount * 2 : characterCount;

            if (byteCount < 0 || byteCount > this.remaining()) {
                throw new Error(`Invalid string size ${sizeRaw} while reading ${label}.`);
            }

            this.requireBytes(byteCount, label);

            const raw = this.bytes.slice(this.position, this.position + byteCount);
            this.position += byteCount;

            let value = "";

            if (isUtf16) {
                const codeUnits = [];

                for (let index = 0; index < raw.length; index += 2) {
                    codeUnits.push(raw[index] | (raw[index + 1] << 8));
                }

                if (codeUnits.length > 0 && codeUnits[codeUnits.length - 1] === 0) {
                    codeUnits.pop();
                }

                value = String.fromCharCode(...codeUnits);
            } else {
                const trimmedRaw = raw.length > 0 && raw[raw.length - 1] === 0
                    ? raw.slice(0, raw.length - 1)
                    : raw;

                const decoder = new TextDecoder("windows-1252");
                value = decoder.decode(trimmedRaw);
            }

            if (value === "" || value === " ") {
                return null;
            }

            return value;
        }

        readArray(count, readItem, label) {
            const output = [];

            for (let index = 0; index < count; index++) {
                output.push(readItem(`${label}[${index}]`));
            }

            return output;
        }

        readVec(readItem, label) {
            const count = this.readI32(`${label} count`);

            if (count < 0) {
                throw new Error(`Invalid negative vector size ${count} while reading ${label}.`);
            }

            if (count > 100000) {
                throw new Error(`Invalid huge vector size ${count} while reading ${label}.`);
            }

            const output = [];

            for (let index = 0; index < count; index++) {
                output.push(readItem(`${label}[${index}]`));
            }

            return output;
        }
    }


    function readLinearColor(reader, label) {
        return {
            r: reader.readF32(`${label}.r`),
            g: reader.readF32(`${label}.g`),
            b: reader.readF32(`${label}.b`),
            a: reader.readF32(`${label}.a`)
        };
    }


    function readSearchFilterSettings(reader) {
        return {
            levelIndicesToFilter: reader.readVec(
                () => reader.readI32("level index"),
                "level_indices_to_filter"
            ),
            difficultiesToFilter: reader.readVec(
                () => reader.readI32("difficulty"),
                "difficulties_to_filter"
            ),
            filterChallengeMissions: reader.readI8("filter_challenge_missions"),
            filterCampaignMissions: reader.readI8("filter_campaign_missions"),
            filterPureStrategy: reader.readI8("filter_pure_strategy"),
            filterInfiniteBuild: reader.readI8("filter_infinite_build"),
            filterInfiniteWaves: reader.readI8("filter_infinite_waves"),
            filterHostClass: reader.readI8("filter_host_class"),
            filterHostLevel: reader.readI8("filter_host_level"),
            filterHostLevelStart: reader.readI8("filter_host_level_start"),
            filterHostLevelEnd: reader.readI8("filter_host_level_end")
        };
    }


    function readOptionsFixedStruct(reader) {
        return {
            autoShowLevelUp: reader.readBool("auto_show_level_up"),
            allowFriendlyFire: reader.readBool("allow_friendly_fire"),
            useGamepad: reader.readBool("use_gamepad"),
            autoAdjustCameraForPhase: reader.readBool("auto_adjust_camera_for_phase"),

            showTutorials: reader.readBool("show_tutorials"),
            shownTutorials: reader.readArray(
                10,
                () => reader.readI32("shown_tutorial"),
                "shown_tutorials"
            ),

            volumeSfx: reader.readF32("volume_sfx"),
            volumeMusic: reader.readF32("volume_music"),

            voicePlayVolume: reader.readF32("voice_play_volume"),
            voiceCaptureVolume: reader.readF32("voice_capture_volume"),
            pushToTalk: reader.readBool("push_to_talk"),
            incomingVoice: reader.readBool("incoming_voice"),
            outgoingVoice: reader.readBool("outgoing_voice"),

            gamma: reader.readF32("gamma"),
            saturationIntensity: reader.readF32("saturation_intensity"),
            uiScalePercent: reader.readF32("ui_scale_percent"),

            postProcessing: reader.readBool("post_processing"),

            showFloatingDamageNumbers: reader.readBool("show_floating_damage_numbers"),
            rightStickTurnsCameraScheme: reader.readBool("right_stick_turns_camera_scheme"),
            invertCameraPitch: reader.readBool("invert_camera_pitch"),
            swapTriggersAndButtons: reader.readBool("swap_triggers_and_buttons"),
            fullScreen: reader.readBool("full_screen"),
            splitScreenConfig: reader.readI8("split_screen_config"),
            currentDifficulty: reader.readI8("current_difficulty"),
            lobbyItemLock: reader.readBool("lobby_item_lock"),
            defaultChaseCamera: reader.readBool("default_chase_camera"),
            defaultCameraTargetDistance: reader.readF32("default_camera_target_distance"),
            defaultPlacingTowerCameraDistance: reader.readF32("default_placing_tower_camera_distance"),
            mouseCameraRotationSpeed: reader.readF32("mouse_camera_rotation_speed"),
            itemQualityFilter: reader.readI32("item_quality_filter"),
            hideAccessory: reader.readBool("hide_accessory"),
            enableOutlineEffect: reader.readBool("enable_outline_effect"),

            graphicsQuality: reader.readI8("graphics_quality"),

            frameRateLimit: reader.readF32("frame_rate_limit"),

            inventorySortingFilter: reader.readI8("inventory_sorting_filter"),

            minimumLevel: reader.readI32("minimum_level"),

            savedLoginInfo: reader.readBool("saved_login_info"),
            customGameMetaFlags: reader.readVec(
                () => reader.readI8("custom_game_meta_flag"),
                "custom_game_meta_flags"
            ),

            customUnlocks: reader.readVec(
                () => reader.readI32("custom_unlock"),
                "custome_unlocks"
            ),
            heroUnlocks: reader.readVec(
                () => reader.readI32("hero_unlock"),
                "hero_unlocks"
            )
        };
    }


    function readOptionsInfo(reader) {
        return {
            fixedSizeOptions: readOptionsFixedStruct(reader),
            resolution: reader.readOptionString("resolution"),
            lastLevelTag: reader.readOptionString("last_level_tag"),
            username: reader.readOptionString("username"),
            password: reader.readOptionString("password"),
            searchFilters: readSearchFilterSettings(reader),
            installedDlcEquipments: reader.readVec(
                () => reader.readI32("installed_dlc_equipment"),
                "installed_dlc_equipments"
            )
        };
    }


    function readHeroInfo(reader) {
        return {
            isInitialized: reader.readBool("hero.is_initialized"),

            heroHealthModifier: reader.readI32("hero_health_modifier"),
            heroSpeedModifier: reader.readI32("hero_speed_modifier"),
            heroDamageModifier: reader.readI32("hero_damage_modifier"),
            heroCastingModifier: reader.readI32("hero_casting_modifier"),

            heroAbilityOneModifier: reader.readI32("hero_ability_one_modifier"),
            heroAbilityTwoModifier: reader.readI32("hero_ability_two_modifier"),

            heroDefenseHealthModifier: reader.readI32("hero_defense_health_modifier"),
            heroDefenseAttackRateModifier: reader.readI32("hero_defense_attack_rate_modifier"),
            heroDefenseDamageModifier: reader.readI32("hero_defense_damage_modifier"),
            heroDefenseAreaOfEffectModifier: reader.readI32("hero_defense_area_of_effect_modifier"),

            heroLevel: reader.readI32("hero_level"),
            heroExperience: reader.readI32("hero_experience"),
            manaPower: reader.readI32("mana_power"),

            guid1: reader.readI32("guid1"),
            guid2: reader.readI32("guid2"),
            guid3: reader.readI32("guid3"),
            guid4: reader.readI32("guid4"),

            currentCostumeIndex: reader.readI32("current_costume_index"),
            c1: readLinearColor(reader, "c1"),
            c2: readLinearColor(reader, "c2"),
            c3: readLinearColor(reader, "c3"),

            didRespec: reader.readI8("did_respec"),
            gaveExpBonus: reader.readI8("gave_exp_bonus"),
            allowRename: reader.readI8("allow_rename"),
            heroName: reader.readOptionString("hero_name"),
            heroTemplate: reader.readOptionString("hero_template"),

            hotKeyActionOne: reader.readOptionString("hot_key_action_one"),
            hotKeyActionTwo: reader.readOptionString("hot_key_action_two"),
            hotKeyActionThree: reader.readOptionString("hot_key_action_three"),
            hotKeyActionFour: reader.readOptionString("hot_key_action_four"),
            hotKeyActionFive: reader.readOptionString("hot_key_action_five"),
            hotKeyActionSix: reader.readOptionString("hot_key_action_six"),
            hotKeyActionSeven: reader.readOptionString("hot_key_action_seven"),
            hotKeyActionEight: reader.readOptionString("hot_key_action_eight"),
            hotKeyActionNine: reader.readOptionString("hot_key_action_nine"),
            hotKeyActionTen: reader.readOptionString("hot_key_action_ten"),

            equipmentCount: reader.readI32("equipment_count")
        };
    }


    function readEquipmentInfo(reader) {
        return {
            isInitialized: reader.readBool("equipment.is_initialized"),

            damageReductionIndex: reader.readArray(
                4,
                () => reader.readU8("damage_reduction_index"),
                "damage_reduction_index"
            ),
            damageReductionPercentage: reader.readArray(
                4,
                () => reader.readU8("damage_reduction_percentage") - 127,
                "damage_reduction_percentage"
            ),
            statModifiers: reader.readArray(
                11,
                () => reader.readI32("stat_modifier") - 127,
                "stat_modifiers"
            ),
            spawnStatModifiers: reader.readArray(
                11,
                () => reader.readI32("spawn_stat_modifier") - 127,
                "spawn_stat_modifiers"
            ),

            weaponDamageBonus: reader.readI32("weapon_damage_bonus"),
            weaponNumberOfProjectilesBonus: reader.readI8("weapon_number_of_projectiles_bonus"),
            weaponSpeedOfProjectilesBonus: reader.readI32("weapon_speed_of_projectiles_bonus"),
            weaponAdditionalDamageTypeIndex: reader.readI8("weapon_additional_damage_type_index"),
            weaponAdditionalDamageAmount: reader.readI32("weapon_additional_damage_amount"),
            weaponDrawScaleMultiplier: reader.readF32("weapon_draw_scale_multiplier"),
            weaponSwingSpeedMultiplier: reader.readF32("weapon_swing_speed_multiplier"),
            level: reader.readI32("level"),
            storedMana: reader.readI32("stored_mana"),
            spawnQuality: reader.readF32("spawn_quality"),
            spawnRandomizerMultiplier: reader.readF32("spawn_randomizer_multiplier"),

            weaponBlockingBonus: reader.readI8("weapon_blocking_bonus"),
            weaponAltDamageBonus: reader.readI32("weapon_alt_damage_bonus"),
            weaponClipAmmoBonus: reader.readI32("weapon_clip_ammo_bonus"),
            weaponReloadSpeedBonus: reader.readI8("weapon_reload_speed_bonus"),
            weaponKnockbackBonus: reader.readI8("weapon_knockback_bonus"),
            weaponChargeSpeedBonus: reader.readI8("weapon_charge_speed_bonus"),
            weaponShotsPerSecondBonus: reader.readI8("weapon_shots_per_second_bonus"),

            nameIndexBase: reader.readU8("name_index_base"),
            nameIndexDamageReduction: reader.readU8("name_index_damage_reduction"),
            nameIndexQualityDescriptor: reader.readU8("name_index_quality_descriptor"),

            primaryColorSet: reader.readU8("primary_color_set"),
            secondaryColorSet: reader.readU8("secondary_color_set"),

            equipmentId1: reader.readI32("equipment_id_1"),
            equipmentId2: reader.readI32("equipment_id_2"),

            minimumSellWorth: reader.readI32("minimum_sell_worth"),
            maximumSellWorth: reader.readI32("maximum_sell_worth"),
            maxEquipmentLevel: reader.readI32("max_equipment_level"),

            droppedLocationX: reader.readI32("dropped_location_x"),
            droppedLocationY: reader.readI32("dropped_location_y"),
            droppedLocationZ: reader.readI32("dropped_location_z"),

            canBeUpgraded: reader.readI8("can_be_upgraded"),
            allowRenamingAtMaxUpgrade: reader.readI8("allow_renaming_at_max_upgrade"),

            cantBeDropped: reader.readI8("cant_be_dropped"),
            cantBeSold: reader.readI8("cant_be_sold"),
            autoLockInItemBox: reader.readI8("auto_lock_in_item_box"),
            didOnetimeEffect: reader.readI8("did_onetime_effect"),
            isLocked: reader.readI8("is_locked"),
            manualLr: reader.readI8("manual_lr"),

            primaryColorOverride: readLinearColor(reader, "primary_color_override"),
            secondaryColorOverride: readLinearColor(reader, "secondary_color_override"),

            userEquipmentName: reader.readOptionString("user_equipment_name"),
            userForgerName: reader.readOptionString("user_forger_name"),
            description: reader.readOptionString("description"),
            equipmentTemplate: reader.readOptionString("equipment_template"),
            equipmentTimestamp: reader.readOptionString("equipment_timestamp"),

            folderId: reader.readI32("folder_id"),
            isSecondary: reader.readBool("is_secondary"),

            statEquipmentIds: reader.readArray(
                10,
                () => reader.readI32("stat_equipment_id"),
                "stat_equipment_ids"
            ),
            statEquipmentTiers: reader.readArray(
                10,
                () => reader.readI32("stat_equipment_tier"),
                "stat_equipment_tiers"
            ),

            qualityBeamColorOverride: readLinearColor(reader, "quality_beam_color_override"),
            equipmentFeatureString: reader.readOptionString("equipment_feature_string"),

            hideQualityDescriptors: reader.readI8("hide_quality_descriptors"),
            equipmentFeatureByte1: reader.readI8("equipment_feature_byte1"),
            equipmentFeatureByte2: reader.readI8("equipment_feature_byte2"),

            featureArray: reader.readArray(
                10,
                () => reader.readI32("feature_array"),
                "feature_array"
            )
        };
    }


    function readHero(reader) {
        return {
            heroInfo: readHeroInfo(reader),
            equipments: reader.readVec(() => readEquipmentInfo(reader), "hero.equipments")
        };
    }


    function readOptimizerSaveInfo(bytes) {
        const reader = new SaveBinaryReader(bytes);

        const versionNumber = reader.readI32("version_number");
        const size = reader.readI32("size");
        const options = readOptionsInfo(reader);
        const heroes = reader.readVec(() => readHero(reader), "heroes");

        return {
            versionNumber: versionNumber,
            size: size,
            options: options,
            heroes: heroes,
            readerPosition: reader.position,
            remainingBytes: reader.remaining()
        };
    }

    /* =========================================================
       11. Hero Class, Equipment, and Stat Analysis
    ========================================================= */

    function getOptimizerHeroClass(template) {
        if (!template) {
            return "Unknown";
        }

        if (optimizerHeroTemplateMap[template]) {
            return optimizerHeroTemplateMap[template];
        }

        const normalizedTemplate = String(template).toLowerCase();

        const fallbackRules = [
            ["herotemplateapprentice", "Apprentice"],
            ["herotemplatesquire", "Squire"],
            ["herotemplateinitiate", "Huntress"],
            ["herotemplaterecruit", "Monk"],
            ["herotemplatesorceress", "Adept"],
            ["herotemplateladyknight", "Countess"],
            ["herotemplatehunter", "Ranger"],
            ["herotemplatemonkette", "Initiate"],
            ["herotemplatejester", "Jester"],
            ["herotemplatesummoner", "Summoner"],
            ["herotemplaterobotgirl", "Series EV"],
            ["herotemplatebarbarian", "Barbarian"],
            ["herotemplatehermit", "Hermit"],
            ["herotemplategunwitch", "Gunwitch"],
            ["herotemplatewarden", "Warden"],
            ["herotemplateguardian", "Guardian"]
        ];

        const matchedRule = fallbackRules.find(([templatePart]) => {
            return normalizedTemplate.includes(templatePart);
        });

        return matchedRule ? matchedRule[1] : "Unknown";
    }

    function createEmptyOptimizerStats() {
        return {
            heroHealth: 0,
            heroSpeed: 0,
            heroDamage: 0,
            heroCasting: 0,
            ability1: 0,
            ability2: 0,
            towerHealth: 0,
            towerRate: 0,
            towerDamage: 0,
            towerRange: 0,
            specialStat: 0
        };
    }

    function getBaseOptimizerStats(heroInfo, className) {
        const stats = {
            heroHealth: heroInfo.heroHealthModifier,
            heroSpeed: heroInfo.heroSpeedModifier,
            heroDamage: heroInfo.heroDamageModifier,
            heroCasting: heroInfo.heroCastingModifier,
            ability1: heroInfo.heroAbilityOneModifier,
            ability2: heroInfo.heroAbilityTwoModifier,
            towerHealth: heroInfo.heroDefenseHealthModifier,
            towerRate: heroInfo.heroDefenseAttackRateModifier,
            towerDamage: heroInfo.heroDefenseDamageModifier,
            towerRange: heroInfo.heroDefenseAreaOfEffectModifier,
            specialStat: 0
        };

        if (className === "Series EV") {
            stats.specialStat = stats.towerRange;
            stats.towerRange = 0;
        }

        return stats;
    }

    function getEquipmentQuality(equipment) {
        return optimizerEquipmentQualityNames[equipment.nameIndexQualityDescriptor] || "Unknown";
    }

    function getArmorSetFromTemplate(template) {
        const match = String(template || "").match(
            /(?:Helmet|Torso|Gauntlet|Boots)ArmorBase_([A-Za-z0-9]+)/i
        );

        return match ? match[1] : null;
    }

    function isArmorEquipment(equipment) {
        return getArmorSetFromTemplate(equipment.equipmentTemplate) !== null;
    }

    function getArmorSetBonusMultiplier(equipment) {
        const qualityIndex = equipment.nameIndexQualityDescriptor;

        if (qualityIndex >= 16 && qualityIndex <= 19) {
            return 1.4;
        }

        if (qualityIndex === 15) {
            return 1.36;
        }

        if (qualityIndex === 14) {
            return 1.33;
        }

        if (qualityIndex === 13) {
            return 1.3;
        }

        return 1.25;
    }

    function hasMatchingArmorSetBonus(equipments) {
        const armorPieces = equipments.filter(isArmorEquipment);

        if (armorPieces.length < 4) {
            return false;
        }

        const armorSets = armorPieces.map((equipment) => {
            return getArmorSetFromTemplate(equipment.equipmentTemplate);
        });

        const firstSpecificSet = armorSets.find((armorSet) => {
            return armorSet && armorSet.toLowerCase() !== "any";
        });

        if (!firstSpecificSet) {
            return true;
        }

        return armorSets.every((armorSet) => {
            return armorSet && (
                armorSet.toLowerCase() === "any" ||
                armorSet.toLowerCase() === firstSpecificSet.toLowerCase()
            );
        });
    }

    function getAdjustedEquipmentValue(equipment, value, hasArmorSetBonus) {
        if (
            !hasArmorSetBonus ||
            !isArmorEquipment(equipment) ||
            value < 0
        ) {
            return value;
        }

        return Math.ceil(value * getArmorSetBonusMultiplier(equipment));
    }

    function getEquipmentOptimizerStats(equipments, className) {
        const stats = createEmptyOptimizerStats();
        const hasArmorSetBonus = hasMatchingArmorSetBonus(equipments);

        equipments.forEach((equipment) => {
            const values = equipment.statModifiers || [];

            function adjusted(statIndex) {
                const value = values[statIndex] || 0;
                return getAdjustedEquipmentValue(equipment, value, hasArmorSetBonus);
            }

            stats.heroHealth += adjusted(optimizerEquipmentStatIndex.heroHealth);
            stats.heroSpeed += adjusted(optimizerEquipmentStatIndex.heroSpeed);
            stats.heroDamage += adjusted(optimizerEquipmentStatIndex.heroDamage);
            stats.heroCasting += adjusted(optimizerEquipmentStatIndex.heroCasting);
            stats.ability1 += adjusted(optimizerEquipmentStatIndex.ability1);
            stats.ability2 += adjusted(optimizerEquipmentStatIndex.ability2);
            stats.towerHealth += adjusted(optimizerEquipmentStatIndex.towerHealth);
            stats.towerRate += adjusted(optimizerEquipmentStatIndex.towerRate);
            stats.towerDamage += adjusted(optimizerEquipmentStatIndex.towerDamage);

            const rangeOrSpecial = adjusted(optimizerEquipmentStatIndex.towerRangeOrSpecial);

            if (className === "Series EV") {
                stats.specialStat += rangeOrSpecial;
            } else {
                stats.towerRange += rangeOrSpecial;
            }
        });

        return stats;
    }

    function addOptimizerStats(firstStats, secondStats) {
        const totals = createEmptyOptimizerStats();

        Object.keys(totals).forEach((statName) => {
            totals[statName] = Math.max(
                0,
                (firstStats[statName] || 0) + (secondStats[statName] || 0)
            );
        });

        return totals;
    }

    function getResistanceTotals(equipments) {
        const rawTotals = [0, 0, 0, 0];
        const hasArmorSetBonus = hasMatchingArmorSetBonus(equipments);

        equipments.forEach((equipment) => {
            const values = equipment.damageReductionPercentage || [];

            for (let index = 0; index < rawTotals.length; index++) {
                const value = values[index] || 0;
                rawTotals[index] += getAdjustedEquipmentValue(
                    equipment,
                    value,
                    hasArmorSetBonus
                );
            }
        });

        const displayedTotals = rawTotals.map((value) => {
            const nightmareValue = value < 0
                ? Math.ceil(value * 0.55)
                : Math.floor(value * 0.55);

            return Math.min(90, nightmareValue);
        });

        return {
            raw: {
                generic: rawTotals[0],
                poison: rawTotals[1],
                fire: rawTotals[2],
                lightning: rawTotals[3]
            },
            displayed: {
                generic: displayedTotals[0],
                poison: displayedTotals[1],
                fire: displayedTotals[2],
                lightning: displayedTotals[3]
            }
        };
    }

    function getLowestResistance(resistances) {
        return Math.min(
            resistances.generic,
            resistances.poison,
            resistances.fire,
            resistances.lightning
        );
    }

    function cleanImportedEquipment(equipment, index) {
        return {
            number: index + 1,
            name: equipment.userEquipmentName || equipment.description || "Unnamed Equipment",
            template: equipment.equipmentTemplate || "Unknown Equipment Template",
            currentUpgradeLevel: equipment.level,
            maximumUpgradeLevel: equipment.maxEquipmentLevel,
            quality: getEquipmentQuality(equipment),
            qualityIndex: equipment.nameIndexQualityDescriptor,
            isArmor: isArmorEquipment(equipment),
            armorSet: getArmorSetFromTemplate(equipment.equipmentTemplate),
            setBonusMultiplier: isArmorEquipment(equipment)
                ? getArmorSetBonusMultiplier(equipment)
                : 1,
            statModifiers: [...equipment.statModifiers],
            spawnStatModifiers: [...equipment.spawnStatModifiers],
            resistances: [...equipment.damageReductionPercentage],
            isSecondary: equipment.isSecondary,
            isLocked: Boolean(equipment.isLocked),
            equipmentIds: [equipment.equipmentId1, equipment.equipmentId2]
        };
    }

    function stripDd1ColorTags(value) {
        return String(value || "")
            .replace(/<\/?color(?::[^>]*)?>/gi, "")
            .replace(/<color[^>]*>/gi, "")
            .trim();
    }

    function getImportedAbilityScore(stats) {
        return Math.max(stats.ability1 || 0, stats.ability2 || 0);
    }

    function suggestImportedHeroRole(hero) {
        const stats = hero.totalStats;
        const towerScore = stats.towerHealth + stats.towerDamage + stats.towerRange + stats.towerRate;
        const abilityScore = getImportedAbilityScore(stats);
        const heroScore = stats.heroHealth + stats.heroDamage + stats.heroSpeed + stats.heroCasting + abilityScore;
        const abilityFocused = abilityScore > stats.heroDamage * 1.25 && abilityScore > 500;

        switch (hero.className) {
            case "Summoner":
                if (towerScore >= heroScore) {
                    return stats.towerHealth > stats.towerDamage * 1.35
                        ? "Waller Summoner"
                        : "Minion Summoner";
                }

                return "Damage Summoner";

            case "Series EV":
                if (towerScore >= heroScore) {
                    return stats.towerHealth > stats.towerDamage * 1.25
                        ? "Waller"
                        : "Beam EV";
                }

                return abilityFocused ? "Ability DPS" : "DPS";

            case "Monk":
                if (
                    stats.ability1 > 500 &&
                    stats.ability2 > 500 &&
                    abilityScore >= stats.heroDamage
                ) {
                    return "Boost Monk";
                }

                if (towerScore >= heroScore) {
                    return "Aura Monk";
                }

                return abilityFocused ? "Ability DPS" : "DPS";

            case "Initiate":
                if (
                    stats.heroCasting + stats.heroSpeed + abilityScore >
                    towerScore
                ) {
                    return "Upgrade Initiate";
                }

                return towerScore >= heroScore
                    ? "Aura Monk"
                    : abilityFocused ? "Ability DPS" : "DPS";

            case "Huntress":
            case "Ranger":
                return towerScore >= heroScore
                    ? "Trap Huntress"
                    : abilityFocused ? "Ability DPS" : "DPS";

            case "Squire":
            case "Countess":
                if (towerScore >= heroScore) {
                    return stats.towerHealth > stats.towerDamage * 1.25
                        ? "Waller"
                        : "Builder";
                }

                return abilityFocused ? "Ability DPS" : "DPS";

            case "Apprentice":
            case "Adept":
            case "Hermit":
            case "Warden":
            case "Guardian":
                return towerScore >= heroScore
                    ? "Builder"
                    : abilityFocused ? "Ability DPS" : "DPS";

            case "Jester":
            case "Barbarian":
            case "Gunwitch":
                return abilityFocused ? "Ability DPS" : "DPS";

            default:
                return towerScore >= heroScore
                    ? "Builder"
                    : abilityFocused ? "Ability DPS" : "DPS";
        }
    }

    function normalizeOptimizerHero(rawHero, index) {
        const heroInfo = rawHero.heroInfo;
        const className = getOptimizerHeroClass(heroInfo.heroTemplate);
        const baseStats = getBaseOptimizerStats(heroInfo, className);
        const equipmentStats = getEquipmentOptimizerStats(rawHero.equipments, className);
        const totalStats = addOptimizerStats(baseStats, equipmentStats);
        const resistanceTotals = getResistanceTotals(rawHero.equipments);
        const resistances = resistanceTotals.displayed;
        const fallbackName = `Hero ${index + 1}`;
        const cleanName = stripDd1ColorTags(heroInfo.heroName) || fallbackName;

        const hero = {
            number: index + 1,
            name: cleanName,
            template: heroInfo.heroTemplate || "Unknown Hero Template",
            className: className,
            level: heroInfo.heroLevel,
            experience: heroInfo.heroExperience,
            manaPower: heroInfo.manaPower,
            baseStats: baseStats,
            equipmentStats: equipmentStats,
            totalStats: totalStats,
            resistances: resistances,
            rawResistances: resistanceTotals.raw,
            lowestResistance: getLowestResistance(resistances),
            hasArmorSetBonus: hasMatchingArmorSetBonus(rawHero.equipments),
            equipmentCount: rawHero.equipments.length,
            equipment: rawHero.equipments.map(cleanImportedEquipment),
            suggestedRole: ""
        };

        hero.suggestedRole = suggestImportedHeroRole(hero);
        return hero;
    }

    function parseOptimizerSaveFile(arrayBuffer, fileName) {
        const decompression = decompressDunFile(arrayBuffer);
        const saveInfo = readOptimizerSaveInfo(decompression.combinedBytes);
        const heroes = saveInfo.heroes.map(normalizeOptimizerHero);
        const warnings = [];

        if (heroes.some((hero) => hero.className === "Unknown")) {
            warnings.push("At least one hero template is not mapped yet. That hero was imported as Unknown.");
        }

        return {
            fileName: fileName,
            importedAt: new Date().toISOString(),
            versionNumber: saveInfo.versionNumber,
            saveSize: saveInfo.size,
            heroCount: heroes.length,
            heroes: heroes,
            warnings: warnings,
            decompression: {
                method: decompression.decompressionMethod || "unknown",
                blockCount: decompression.blockCount,
                combinedSize: decompression.combinedSize
            }
        };
    }

    /* =========================================================
       12. Optimizer Page Population and Import Output
    ========================================================= */

    function ensureSelectOption(selectElement, value) {
        if (!selectElement || !value) {
            return;
        }

        const hasOption = Array.from(selectElement.options).some((option) => {
            return option.value === value;
        });

        if (!hasOption) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        }
    }

    function setImportedHeroHeading(slot, heroNumber, heroName) {
        if (!slot) {
            return;
        }

        slot.dataset.heroName = heroName;

        const heading = slot.querySelector("h3");

        if (heading) {
            heading.textContent = `Hero ${heroNumber}: ${heroName}`;
        }
    }

    function populateOptimizerFromImportedSave(importedSaveData) {
        const heroRosterGrid = document.querySelector("#hero-roster-grid");

        if (!heroRosterGrid) {
            throw new Error("The optimizer hero roster could not be found.");
        }

        if (typeof addHeroSlot !== "function") {
            throw new Error("optimizer.js must load before optimizer-save-import.js.");
        }

        heroRosterGrid.innerHTML = "";

        const heroesToImport = importedSaveData.heroes;

        heroesToImport.forEach(() => {
            addHeroSlot();
        });

        heroesToImport.forEach((hero, index) => {
            const heroNumber = index + 1;
            const slot = heroRosterGrid.querySelector(`.hero-slot[data-hero-number="${heroNumber}"]`);
            const classSelect = document.querySelector(`#hero-${heroNumber}-class`);

            ensureSelectOption(classSelect, hero.className);
            setHeroField(heroNumber, "class", hero.className);
            updateRoleOptions(heroNumber);

            const roleSelect = document.querySelector(`#hero-${heroNumber}-role`);
            ensureSelectOption(roleSelect, hero.suggestedRole);
            setHeroField(heroNumber, "role", hero.suggestedRole);
            updateRoleHint(heroNumber);

            const ignoreField = document.querySelector(`#hero-${heroNumber}-ignore`);

            if (ignoreField) {
                ignoreField.checked = false;
            }

            setHeroField(heroNumber, "level", hero.level);
            setHeroField(heroNumber, "tower-health", hero.totalStats.towerHealth);
            setHeroField(heroNumber, "tower-damage", hero.totalStats.towerDamage);
            setHeroField(heroNumber, "tower-range", hero.totalStats.towerRange);
            setHeroField(heroNumber, "tower-rate", hero.totalStats.towerRate);
            setHeroField(heroNumber, "hero-health", hero.totalStats.heroHealth);
            setHeroField(heroNumber, "hero-damage", hero.totalStats.heroDamage);
            setHeroField(heroNumber, "hero-speed", hero.totalStats.heroSpeed);
            setHeroField(heroNumber, "hero-casting", hero.totalStats.heroCasting);
            setHeroField(heroNumber, "lowest-resistance", hero.lowestResistance);
            setHeroField(heroNumber, "ability-1", hero.totalStats.ability1);
            setHeroField(heroNumber, "ability-2", hero.totalStats.ability2);

            if (slot) {
                slot.dataset.heroTemplate = hero.template;
                slot.dataset.imported = "true";
                slot.dataset.equipmentCount = String(hero.equipmentCount);
            }

            setImportedHeroHeading(slot, heroNumber, hero.name);
        });

        if (typeof updateAddHeroButton === "function") {
            updateAddHeroButton();
        }

        if (typeof saveOptimizerData === "function") {
            saveOptimizerData();
        }
    }

    function escapeOptimizerImportHtml(value) {
        const element = document.createElement("div");
        element.textContent = String(value);
        return element.innerHTML;
    }

    function buildOptimizerImportOutput(importedSaveData) {
        const heroRows = importedSaveData.heroes.map((hero) => {
            const specialText = hero.className === "Series EV"
                ? ` | EV Special ${hero.totalStats.specialStat}`
                : "";

            return `
                <li>
                    <strong>${escapeOptimizerImportHtml(hero.name)}</strong>
                    — ${escapeOptimizerImportHtml(hero.className)}
                    — Level ${hero.level}
                    — Suggested role: ${escapeOptimizerImportHtml(hero.suggestedRole)}
                    <br>
                    Tower HP ${hero.totalStats.towerHealth},
                    Damage ${hero.totalStats.towerDamage},
                    Range ${hero.totalStats.towerRange},
                    Rate ${hero.totalStats.towerRate}${specialText}
                    <br>
                    Hero HP ${hero.totalStats.heroHealth},
                    Damage ${hero.totalStats.heroDamage},
                    Speed ${hero.totalStats.heroSpeed},
                    Casting ${hero.totalStats.heroCasting},
                    AB1 ${hero.totalStats.ability1},
                    AB2 ${hero.totalStats.ability2},
                    Lowest resistance ${hero.lowestResistance}%
                    <br>
                    Equipped items read: ${hero.equipmentCount}
                </li>
            `;
        }).join("");

        const warningHtml = importedSaveData.warnings.length > 0
            ? `
                <div class="guide-warning">
                    <h4>Import Warning</h4>
                    <ul>
                        ${importedSaveData.warnings.map((warning) => {
                            return `<li>${escapeOptimizerImportHtml(warning)}</li>`;
                        }).join("")}
                    </ul>
                </div>
            `
            : "";

        return `
            <div class="result-box">
                <h3>Save Imported</h3>
                <p><strong>File:</strong> ${escapeOptimizerImportHtml(importedSaveData.fileName)}</p>
                <p><strong>Heroes read:</strong> ${importedSaveData.heroCount}</p>
                <p>
                    <strong>Decompression:</strong>
                    ${escapeOptimizerImportHtml(importedSaveData.decompression.method)},
                    ${importedSaveData.decompression.blockCount} block(s),
                    ${importedSaveData.decompression.combinedSize.toLocaleString()} decompressed bytes
                </p>

                <details>
                    <summary>Show Imported Hero Stats</summary>
                    <ol>${heroRows}</ol>
                </details>

                ${warningHtml}
            </div>
        `;
    }

    /* =========================================================
       13. Save File Event Handler and Startup
    ========================================================= */

    async function handleOptimizerSaveFile(event) {
        const file = event.target.files && event.target.files[0];

        if (!file) {
            return;
        }

        if (!optimizerSaveOutput) {
            return;
        }

        optimizerSaveOutput.innerHTML = "<p>Reading save file…</p>";

        try {
            if (typeof pako === "undefined") {
                throw new Error("Pako did not load. Check the pako script tag in optimizer.html.");
            }

            const arrayBuffer = await file.arrayBuffer();
            const importedSaveData = parseOptimizerSaveFile(arrayBuffer, file.name);

            window.latestDd1OptimizerSaveData = importedSaveData;
            populateOptimizerFromImportedSave(importedSaveData);
            optimizerSaveOutput.innerHTML = buildOptimizerImportOutput(importedSaveData);
        } catch (error) {
            console.error("DD1 optimizer save import failed:", error);

            optimizerSaveOutput.innerHTML = `
                <div class="guide-warning">
                    <h3>Save Import Failed</h3>
                    <p>${escapeOptimizerImportHtml(describeError(error))}</p>
                </div>
            `;
        }
    }

    extendOptimizerClassData();

    if (optimizerSaveInput) {
        optimizerSaveInput.addEventListener("change", handleOptimizerSaveFile);
    }

    window.parseDd1OptimizerSave = parseOptimizerSaveFile;
    window.populateOptimizerFromImportedSave = populateOptimizerFromImportedSave;
})();
