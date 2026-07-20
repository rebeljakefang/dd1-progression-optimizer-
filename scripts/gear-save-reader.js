/* =========================================================
   DD1 Gear Save Reader

   Reads DunDefHeroes.dun files and CSV gear exports for the
   separate Gear Optimizer page. The .dun reader now attempts
   a full inventory pass: equipped gear, item box gear, tavern
   floor gear, and player shop gear.
========================================================= */

(() => {
    "use strict";

    const sessionFileKey = "dd1-session-save-file-data-url";
    const sessionMetaKey = "dd1-session-save-file-meta";
    const compressedTag = 0x9e2a83c1;

/* =========================================================
   2. Hero/Class/Stat Maps
========================================================= */

    const heroClassMap = {
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
        "Gunwitch.hero.HeroArchetypes.HeroTemplateGunwitch": "Gunwitch",
        "Hermit.hero.HeroArchetypes.HeroTemplateHermit": "Hermit",
        "Warden.hero.Archetype.HeroTemplateWarden": "Warden",
        "Guardian.hero.Archetypes.HeroTemplateGuardian": "Guardian"
    };

    const statIndexes = {
        heroHealth: 1,
        heroSpeed: 2,
        heroDamage: 3,
        heroCasting: 4,
        ability1: 5,
        ability2: 6,
        towerHealth: 7,
        towerRate: 8,
        towerDamage: 9,
        towerRange: 10
    };

    const qualityList = [
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
        "Mythic",
        "Trans",
        "Supreme",
        "Ult90",
        "Ult93",
        "Ult+",
        "Ult++"
    ];

/* =========================================================
   3. Required Script Checks
========================================================= */

    function requireParser() {
        if (typeof window.parseDd1OptimizerSave !== "function") {
            throw new Error("The DD1 save parser is not loaded. Check that pako and optimizer-save-import.js are linked before the gear optimizer scripts.");
        }
    }

    function requirePako() {
        if (!window.pako || typeof window.pako.inflate !== "function") {
            throw new Error("Pako is not loaded. Check that the pako CDN script loads before gear-save-reader.js.");
        }
    }

/* =========================================================
   4. Text + Number Helpers
========================================================= */

    function cleanText(value) {
        return window.dd1GearItemModel.cleanText(value);
    }

    function normalizeText(value) {
        return cleanText(value).toLowerCase();
    }

    function toNumber(value) {
        const number = Number(String(value || "0").replace(/,/g, ""));
        return Number.isFinite(number) ? number : 0;
    }

    function getCsvCell(row, name) {
        return row[name] === null || row[name] === undefined
            ? ""
            : String(row[name]).trim();
    }

/* =========================================================
   5. Binary Reader Class
========================================================= */

    class SaveBinaryReader {
        constructor(bytes) {
            this.bytes = bytes instanceof Uint8Array
                ? bytes
                : new Uint8Array(bytes);

            this.view = new DataView(
                this.bytes.buffer,
                this.bytes.byteOffset,
                this.bytes.byteLength
            );

            this.offset = 0;
        }

        get remaining() {
            return this.bytes.length - this.offset;
        }

        ensure(size) {
            if (this.offset + size > this.bytes.length) {
                throw new Error("The save file ended before the inventory parser finished reading.");
            }
        }

        readU8() {
            this.ensure(1);
            const value = this.view.getUint8(this.offset);
            this.offset += 1;
            return value;
        }

        readI32() {
            this.ensure(4);
            const value = this.view.getInt32(this.offset, true);
            this.offset += 4;
            return value;
        }

        readU32() {
            this.ensure(4);
            const value = this.view.getUint32(this.offset, true);
            this.offset += 4;
            return value;
        }

        readF32() {
            this.ensure(4);
            const value = this.view.getFloat32(this.offset, true);
            this.offset += 4;
            return value;
        }

        readBytes(count) {
            this.ensure(count);
            const value = this.bytes.slice(this.offset, this.offset + count);
            this.offset += count;
            return value;
        }

        skip(count) {
            this.ensure(count);
            this.offset += count;
        }

        readLinearColor() {
            return {
                r: this.readF32(),
                g: this.readF32(),
                b: this.readF32(),
                a: this.readF32()
            };
        }

        readFString() {
            const length = this.readI32();

            if (length === 0) {
                return "";
            }

            if (length < 0) {
                const charCount = Math.abs(length);
                const byteCount = charCount * 2;
                const data = this.readBytes(byteCount);
                let text = "";

                for (let index = 0; index < data.length; index += 2) {
                    const code = data[index] | (data[index + 1] << 8);

                    if (code !== 0) {
                        text += String.fromCharCode(code);
                    }
                }

                return text;
            }

            const data = this.readBytes(length);
            let text = "";

            for (let index = 0; index < data.length; index++) {
                const code = data[index];

                if (code !== 0) {
                    text += String.fromCharCode(code);
                }
            }

            return text;
        }
    }

/* =========================================================
   6. CSV Reading
========================================================= */

    function parseCsvText(text) {
        const rows = [];
        let currentRow = [];
        let currentCell = "";
        let insideQuotes = false;

        for (let index = 0; index < text.length; index++) {
            const char = text[index];
            const nextChar = text[index + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    currentCell += '"';
                    index++;
                } else {
                    insideQuotes = !insideQuotes;
                }
                continue;
            }

            if (char === "," && !insideQuotes) {
                currentRow.push(currentCell);
                currentCell = "";
                continue;
            }

            if ((char === "\n" || char === "\r") && !insideQuotes) {
                if (char === "\r" && nextChar === "\n") {
                    index++;
                }

                currentRow.push(currentCell);
                rows.push(currentRow);
                currentRow = [];
                currentCell = "";
                continue;
            }

            currentCell += char;
        }

        if (currentCell.length > 0 || currentRow.length > 0) {
            currentRow.push(currentCell);
            rows.push(currentRow);
        }

        const nonEmptyRows = rows.filter((row) => {
            return row.some((cell) => String(cell).trim() !== "");
        });

        if (nonEmptyRows.length < 2) {
            return [];
        }

        const headers = nonEmptyRows[0].map((header) => {
            return String(header || "").trim();
        });

        return nonEmptyRows.slice(1).map((row) => {
            const result = {};

            headers.forEach((header, index) => {
                result[header] = row[index] || "";
            });

            return result;
        });
    }

/* =========================================================
   7. CSV Row Conversion
========================================================= */

    function buildHeroSummariesFromCsv(rows) {
        const heroMap = new Map();

        rows.forEach((row) => {
            const heroName = cleanText(getCsvCell(row, "Hero")) || "Unassigned";
            const className = cleanText(getCsvCell(row, "Class")) || "Unknown";
            const key = `${heroName}|${className}`;

            if (!heroMap.has(key)) {
                heroMap.set(key, {
                    number: heroMap.size + 1,
                    name: heroName,
                    className: className,
                    level: 0,
                    suggestedRole: "CSV Import",
                    equipmentCount: 0,
                    totalStats: createEmptyStats(),
                    resistances: createEmptyResists()
                });
            }

            const hero = heroMap.get(key);
            hero.equipmentCount++;
            hero.totalStats.towerHealth += toNumber(getCsvCell(row, "Tower Health"));
            hero.totalStats.towerDamage += toNumber(getCsvCell(row, "Tower Damage"));
            hero.totalStats.towerRange += toNumber(getCsvCell(row, "Tower Range"));
            hero.totalStats.towerRate += toNumber(getCsvCell(row, "Tower Rate"));
            hero.totalStats.heroHealth += toNumber(getCsvCell(row, "Hero Health"));
            hero.totalStats.heroDamage += toNumber(getCsvCell(row, "Hero Damage"));
            hero.totalStats.heroCasting += toNumber(getCsvCell(row, "Hero Casting"));
            hero.resistances.generic += toNumber(getCsvCell(row, "Generic Resist"));
            hero.resistances.poison += toNumber(getCsvCell(row, "Poison Resist"));
            hero.resistances.fire += toNumber(getCsvCell(row, "Fire Resist"));
            hero.resistances.lightning += toNumber(getCsvCell(row, "Lightning Resist"));
        });

        return [...heroMap.values()];
    }

    function buildItemsFromCsv(rows) {
        return rows.map((row, index) => {
            const heroName = cleanText(getCsvCell(row, "Hero")) || "Unassigned";
            const className = cleanText(getCsvCell(row, "Class")) || "Unknown";
            const itemType = cleanText(getCsvCell(row, "Type")) || "Equipment";
            const armorSet = cleanText(getCsvCell(row, "Set")) || "Unknown";
            const quality = cleanText(getCsvCell(row, "Quality")) || "Unknown";
            const name = cleanText(getCsvCell(row, "Name")) || "Unnamed Equipment";

            const stats = {
                heroHealth: toNumber(getCsvCell(row, "Hero Health")),
                heroSpeed: toNumber(getCsvCell(row, "Hero Speed")),
                heroDamage: toNumber(getCsvCell(row, "Hero Damage")),
                heroCasting: toNumber(getCsvCell(row, "Hero Casting")),
                ability1: toNumber(getCsvCell(row, "Ability 1")),
                ability2: toNumber(getCsvCell(row, "Ability 2")),
                towerHealth: toNumber(getCsvCell(row, "Tower Health")),
                towerDamage: toNumber(getCsvCell(row, "Tower Damage")),
                towerRange: toNumber(getCsvCell(row, "Tower Range")),
                towerRate: toNumber(getCsvCell(row, "Tower Rate"))
            };

            const resists = {
                generic: toNumber(getCsvCell(row, "Generic Resist")),
                poison: toNumber(getCsvCell(row, "Poison Resist")),
                fire: toNumber(getCsvCell(row, "Fire Resist")),
                lightning: toNumber(getCsvCell(row, "Lightning Resist"))
            };

            return finalizeItemRow({
                id: `csv-${index + 1}-${heroName}-${itemType}-${name}`,
                source: "csv",
                location: `CSV row ${index + 1}`,
                equippedHero: heroName,
                equippedHeroClass: className,
                heroNumber: 0,
                itemNumber: index + 1,
                itemType: itemType,
                armorSet: armorSet,
                quality: quality,
                name: name,
                template: "CSV Import",
                currentLevel: toNumber(getCsvCell(row, "Current Level")),
                maxLevel: toNumber(getCsvCell(row, "Max Level")),
                stats: stats,
                resists: resists,
                importedScore: toNumber(getCsvCell(row, "Score")),
                isLocked: false,
                isSecondary: false,
                isEquipped: heroName !== "Unassigned",
                rawCsvRow: row
            });
        });
    }

    function createEmptyStats() {
        return {
            heroHealth: 0,
            heroSpeed: 0,
            heroDamage: 0,
            heroCasting: 0,
            ability1: 0,
            ability2: 0,
            towerHealth: 0,
            towerDamage: 0,
            towerRange: 0,
            towerRate: 0
        };
    }

    function createEmptyResists() {
        return {
            generic: 0,
            poison: 0,
            fire: 0,
            lightning: 0
        };
    }

/* =========================================================
   8. Save Decompression
========================================================= */

    function decompressDunFile(arrayBuffer) {
        requirePako();

        const rawBytes = new Uint8Array(arrayBuffer);
        const rawView = new DataView(rawBytes.buffer, rawBytes.byteOffset, rawBytes.byteLength);
        let tagPosition = -1;

        for (let position = 0; position + 4 <= Math.min(rawBytes.length, 1024); position += 4) {
            if (rawView.getUint32(position, true) === compressedTag) {
                tagPosition = position;
                break;
            }
        }

        if (tagPosition < 0) {
            throw new Error("The save file does not appear to contain a UE3 compressed block table.");
        }

        const reader = new SaveBinaryReader(rawBytes);
        reader.offset = tagPosition + 4;

        const blockSize = reader.readI32();
        const totalCompressed = reader.readI32();
        const totalUncompressed = reader.readI32();
        const blockCount = Math.ceil(totalUncompressed / blockSize);
        const blockSizes = [];

        if (blockSize <= 0 || totalCompressed <= 0 || totalUncompressed <= 0 || blockCount <= 0) {
            throw new Error("The save file has an invalid compressed block table.");
        }

        for (let index = 0; index < blockCount; index++) {
            const compressedSize = reader.readI32();
            const uncompressedSize = reader.readI32();

            if (compressedSize <= 0 || uncompressedSize <= 0 || uncompressedSize > blockSize) {
                throw new Error("The save file has a malformed compressed block.");
            }

            blockSizes.push({
                compressedSize: compressedSize,
                uncompressedSize: uncompressedSize
            });
        }

        const outputBytes = new Uint8Array(totalUncompressed);
        let outputOffset = 0;

        blockSizes.forEach((block) => {
            const compressedBytes = reader.readBytes(block.compressedSize);
            const decodedBytes = window.pako.inflate(compressedBytes);

            if (decodedBytes.length !== block.uncompressedSize) {
                throw new Error("A decompressed save block did not match the expected size.");
            }

            outputBytes.set(decodedBytes, outputOffset);
            outputOffset += decodedBytes.length;
        });

        return outputBytes;
    }

    function readAndDiscardIntArray(reader) {
        const count = reader.readI32();
        reader.skip(count * 4);
    }

    function readAndDiscardByteArray(reader) {
        const count = reader.readI32();
        reader.skip(count);
    }

    function readLevelProgressList(reader) {
        const count = reader.readI32();

        for (let index = 0; index < count; index++) {
            reader.readFString();
            reader.readI32();
        }
    }

    function readOptions(reader) {
        reader.readI32();
        reader.readI32();

        reader.skip(5);
        reader.skip(10 * 4);
        reader.skip(4 * 4);
        reader.skip(3);
        reader.skip(3 * 4);
        reader.skip(3);

        reader.readI32();
        reader.skip(3);
        reader.skip(3 * 4);
        reader.skip(4 * 4);
        reader.skip(1);

        readAndDiscardByteArray(reader);
        readAndDiscardIntArray(reader);
        readAndDiscardIntArray(reader);

        reader.readFString();
        reader.readFString();
        reader.readFString();
        reader.readFString();

        readAndDiscardIntArray(reader);
        readAndDiscardIntArray(reader);
        reader.skip(9);
        readAndDiscardIntArray(reader);
    }

/* =========================================================
   9. Hero Parsing
========================================================= */

    function readHero(reader) {
        const hero = {
            isInitialized: reader.readU8() > 0,
            stats: new Array(11).fill(0)
        };

        for (let index = 1; index < 11; index++) {
            hero.stats[index] = reader.readI32();
        }

        hero.level = reader.readI32();
        hero.experience = reader.readI32();
        hero.manaPower = reader.readI32();
        hero.guid1 = reader.readI32();
        hero.guid2 = reader.readI32();
        hero.guid3 = reader.readI32();
        hero.guid4 = reader.readI32();
        hero.costumeIndex = reader.readI32();
        hero.color1 = reader.readLinearColor();
        hero.color2 = reader.readLinearColor();
        hero.color3 = reader.readLinearColor();
        hero.didRespec = reader.readU8();
        hero.gaveExpBonus = reader.readU8();
        hero.allowRename = reader.readU8();
        hero.name = reader.readFString();
        hero.template = reader.readFString();

        for (let index = 0; index < 10; index++) {
            reader.readFString();
        }

        reader.readI32();
        hero.equipmentCount = reader.readI32();
        hero.guid = getHeroGuid(hero);
        hero.className = getHeroClass(hero.template);
        hero.equipment = [];

        return hero;
    }

/* =========================================================
   10. Equipment Parsing
========================================================= */

    function readEquipment(reader) {
        const equipment = {
            isInitialized: reader.readU8() > 0,
            damageReductionIndex: [],
            damageReductionPercentage: [],
            statModifiers: [],
            spawnStatModifiers: []
        };

        for (let index = 0; index < 4; index++) {
            equipment.damageReductionIndex.push(reader.readU8());
        }

        for (let index = 0; index < 4; index++) {
            equipment.damageReductionPercentage.push(reader.readU8() - 127);
        }

        for (let index = 0; index < 11; index++) {
            equipment.statModifiers.push(reader.readI32() - 127);
        }

        for (let index = 0; index < 11; index++) {
            equipment.spawnStatModifiers.push(reader.readI32() - 127);
        }

        equipment.weaponDamageBonus = reader.readI32();
        equipment.weaponNumberOfProjectilesBonus = reader.readU8();
        equipment.weaponSpeedOfProjectilesBonus = reader.readI32();
        equipment.weaponAdditionalDamageTypeIndex = reader.readU8();
        equipment.weaponAdditionalDamageAmount = reader.readI32();
        equipment.weaponDrawScaleMultiplier = reader.readF32();
        equipment.weaponSwingSpeedMultiplier = reader.readF32();
        equipment.currentUpgradeLevel = reader.readI32();
        equipment.storedMana = reader.readI32();
        equipment.spawnQuality = reader.readF32();
        equipment.spawnRandomizerMultiplier = reader.readF32();
        equipment.weaponBlockingBonus = reader.readU8();
        equipment.weaponAltDamageBonus = reader.readI32();
        equipment.weaponClipAmmoBonus = reader.readI32();
        equipment.weaponReloadSpeedBonus = reader.readU8();
        equipment.weaponKnockbackBonus = reader.readU8();
        equipment.weaponChargeSpeedBonus = reader.readU8();
        equipment.weaponShotsPerSecondBonus = reader.readU8();
        equipment.nameIndexBase = reader.readU8();
        equipment.nameIndexDamageReduction = reader.readU8();
        equipment.nameIndexQualityDescriptor = reader.readU8();
        equipment.primaryColorSet = reader.readU8();
        equipment.secondaryColorSet = reader.readU8();
        equipment.equipmentId1 = reader.readI32();
        equipment.equipmentId2 = reader.readI32();
        equipment.minimumSellWorth = reader.readI32();
        equipment.maximumSellWorth = reader.readI32();
        equipment.maximumUpgradeLevel = reader.readI32();
        equipment.droppedLocationX = reader.readI32();
        equipment.droppedLocationY = reader.readI32();
        equipment.droppedLocationZ = reader.readI32();
        equipment.canBeUpgraded = reader.readU8();
        equipment.allowRenamingAtMaxUpgrade = reader.readU8();
        equipment.cantBeDropped = reader.readU8();
        equipment.cantBeSold = reader.readU8();
        equipment.autoLockInItemBox = reader.readU8();
        equipment.didOnetimeEffect = reader.readU8();
        equipment.isLocked = reader.readU8();
        equipment.manualLr = reader.readU8();
        equipment.primaryColorOverride = reader.readLinearColor();
        equipment.secondaryColorOverride = reader.readLinearColor();
        equipment.userEquipmentName = reader.readFString();
        equipment.forgerName = reader.readFString();
        equipment.description = reader.readFString();
        equipment.equipmentTemplate = reader.readFString();
        equipment.equipmentTimestamp = reader.readFString();
        equipment.folderId = reader.readI32();
        equipment.isSecondary = reader.readU8() > 0;
        equipment.statEquipmentIds = reader.readBytes(40);
        equipment.statEquipmentTiers = reader.readBytes(40);
        equipment.featureColor = reader.readLinearColor();
        equipment.equipmentFeatureString = reader.readFString();
        equipment.hideQualityDescriptor = reader.readU8();
        equipment.equipmentFeatureByte1 = reader.readU8();
        equipment.equipmentFeatureByte2 = reader.readU8();
        equipment.equipmentFeatureArray = reader.readBytes(40);

        return equipment;
    }

    function readFolderArray(reader) {
        const folders = new Map();
        const count = reader.readI32();

        for (let index = 0; index < count; index++) {
            const parentIndex = reader.readI32();
            const folderIndex = reader.readI32();
            const name = cleanText(reader.readFString()) || `Folder ${folderIndex}`;

            folders.set(folderIndex, {
                parentIndex: parentIndex,
                index: folderIndex,
                name: name
            });

            reader.readU8();
        }

        return folders;
    }

    function getFolderPath(folderId, folders, baseName) {
        if (folderId === -1) {
            return baseName;
        }

        if (!folders.has(folderId)) {
            return baseName;
        }

        const folder = folders.get(folderId);
        const parentPath = getFolderPath(folder.parentIndex, folders, baseName);

        return parentPath
            ? `${parentPath} > ${folder.name}`
            : folder.name;
    }

    function applyFolderLocations(items, inventoryName, folders) {
        items.forEach((item) => {
            if (item.location === inventoryName) {
                item.location = getFolderPath(item.folderId, folders, inventoryName);
            }
        });
    }

    function parseFullInventory(arrayBuffer) {
        const combinedBytes = decompressDunFile(arrayBuffer);
        const reader = new SaveBinaryReader(combinedBytes);
        const heroes = [];
        const items = [];

        readOptions(reader);

        const heroCount = reader.readI32();

        for (let heroIndex = 0; heroIndex < heroCount; heroIndex++) {
            const hero = readHero(reader);
            hero.number = heroIndex + 1;

            for (let equipmentIndex = 0; equipmentIndex < hero.equipmentCount; equipmentIndex++) {
                const equipment = readEquipment(reader);

                equipment.location = `Character > ${cleanText(hero.name) || `Hero ${hero.number}`}`;
                equipment.equippedHeroId = hero.guid;
                equipment.isEquipped = true;
                equipment.heroNumber = hero.number;
                equipment.equippedHeroName = cleanText(hero.name) || `Hero ${hero.number}`;
                equipment.equippedHeroClass = hero.className;

                hero.equipment.push(equipment);
                items.push(equipment);
            }

            heroes.push(hero);
        }

        reader.skip(500);
        reader.skip(40);
        reader.readI32();

        for (let index = 0; index < 3; index++) {
            reader.readLinearColor();
        }

        readLevelProgressList(reader);
        readLevelProgressList(reader);

        reader.readI32();
        reader.readI32();
        reader.readI32();
        reader.readI32();

        readEquipmentArray(reader, items, "ItemBox");
        readEquipmentArray(reader, items, "HeroEquipment?");
        readEquipmentArray(reader, items, "Tavern");

        const shopSetCount = reader.readI32();

        for (let shopSetIndex = 0; shopSetIndex < shopSetCount; shopSetIndex++) {
            const shopKeeperCount = reader.readI32();

            for (let itemIndex = 0; itemIndex < shopKeeperCount; itemIndex++) {
                readEquipment(reader);
            }
        }

        const playerShopCount = reader.readI32();

        for (let itemIndex = 0; itemIndex < playerShopCount; itemIndex++) {
            const equipment = readEquipment(reader);

            equipment.userSellPrice = reader.readI32();
            equipment.location = "Shop";
            equipment.isEquipped = false;
            items.push(equipment);
        }

        const itemBoxFolders = readFolderArray(reader);
        const shopFolders = readFolderArray(reader);

        applyFolderLocations(items, "ItemBox", itemBoxFolders);
        applyFolderLocations(items, "Shop", shopFolders);

        return {
            heroes: heroes,
            items: items,
            combinedSize: combinedBytes.length,
            itemBoxFolderCount: itemBoxFolders.size,
            shopFolderCount: shopFolders.size
        };
    }

/* =========================================================
   11. Inventory Source Readers
========================================================= */

    function readEquipmentArray(reader, items, location) {
        const count = reader.readI32();

        for (let index = 0; index < count; index++) {
            const equipment = readEquipment(reader);

            equipment.location = location;
            equipment.isEquipped = false;
            items.push(equipment);
        }
    }

    function getHeroGuid(hero) {
        return [hero.guid1, hero.guid2, hero.guid3, hero.guid4].join("-");
    }

    function getHeroClass(template) {
        if (heroClassMap[template]) {
            return heroClassMap[template];
        }

        const text = String(template || "");

        if (text.includes("Warden")) {
            return "Warden";
        }

        if (text.includes("Hermit")) {
            return "Hermit";
        }

        if (text.includes("Gunwitch")) {
            return "Gunwitch";
        }

        if (text.includes("Guardian")) {
            return "Guardian";
        }

        return "Unknown";
    }

    function getStatsFromArray(rawStats) {
        const stats = createEmptyStats();

        Object.entries(statIndexes).forEach(([statName, index]) => {
            stats[statName] = Number(rawStats[index] || 0);
        });

        return stats;
    }

    function addStats(first, second) {
        const stats = createEmptyStats();

        Object.keys(stats).forEach((statName) => {
            stats[statName] = Number(first[statName] || 0) + Number(second[statName] || 0);
        });

        return stats;
    }

    function getEquipmentStats(equipmentRows) {
        return equipmentRows.reduce((total, equipment) => {
            return addStats(total, getStatsFromArray(equipment.statModifiers || []));
        }, createEmptyStats());
    }

    function getEquipmentResists(equipmentRows) {
        return equipmentRows.reduce((total, equipment) => {
            const rawResists = equipment.damageReductionPercentage || [];

            total.generic += Number(rawResists[0] || 0);
            total.poison += Number(rawResists[1] || 0);
            total.fire += Number(rawResists[2] || 0);
            total.lightning += Number(rawResists[3] || 0);

            return total;
        }, createEmptyResists());
    }

    function suggestHeroRole(heroSummary) {
        const stats = heroSummary.totalStats || createEmptyStats();
        const towerScore = stats.towerHealth + stats.towerDamage + stats.towerRange + stats.towerRate;
        const heroScore = stats.heroHealth + stats.heroDamage + stats.heroSpeed + stats.ability1 + stats.ability2;

        switch (heroSummary.className) {
            case "Summoner":
                return stats.towerHealth > stats.towerDamage * 1.15
                    ? "Waller Summoner"
                    : "Minion Summoner";

            case "Series EV":
                return stats.towerHealth > stats.towerDamage * 1.25
                    ? "Waller"
                    : "Beam EV";

            case "Monk":
            case "Initiate":
                if (stats.heroDamage > stats.towerDamage && stats.ability1 + stats.ability2 > stats.towerDamage) {
                    return "Boost Monk";
                }

                return towerScore >= heroScore ? "Aura Monk" : "DPS";

            case "Huntress":
            case "Ranger":
                return towerScore >= heroScore ? "Trap Huntress" : "DPS";

            case "Squire":
            case "Countess":
                if (stats.towerHealth > stats.towerDamage * 1.25) {
                    return "Waller";
                }

                return towerScore >= heroScore ? "Builder" : "DPS";

            case "Jester":
            case "Barbarian":
            case "Gunwitch":
                return "DPS";

            default:
                return towerScore >= heroScore ? "Builder" : "DPS";
        }
    }

/* =========================================================
   12. Hero Summary Building
========================================================= */

    function buildHeroSummariesFromFullInventory(fullInventory, fallbackHeroes) {
        if (fallbackHeroes && fallbackHeroes.length > 0) {
            return fallbackHeroes.map((hero) => {
                return {
                    ...hero,
                    equipmentCount: getEquippedItemsForHero(fullInventory.items, hero.name).length || hero.equipmentCount
                };
            });
        }

        return fullInventory.heroes.map((hero) => {
            const baseStats = getStatsFromArray(hero.stats || []);
            const equipmentStats = getEquipmentStats(hero.equipment || []);
            const totalStats = addStats(baseStats, equipmentStats);
            const resistances = getEquipmentResists(hero.equipment || []);

            const heroSummary = {
                number: hero.number,
                name: cleanText(hero.name) || `Hero ${hero.number}`,
                className: hero.className || "Unknown",
                level: Number(hero.level || 0),
                suggestedRole: "Unknown",
                equipmentCount: hero.equipment.length,
                totalStats: totalStats,
                resistances: resistances
            };

            heroSummary.suggestedRole = suggestHeroRole(heroSummary);

            return heroSummary;
        });
    }

    function getEquippedItemsForHero(items, heroName) {
        return items.filter((item) => {
            return item.isEquipped && cleanText(item.equippedHeroName) === cleanText(heroName);
        });
    }

    function getCombinedItemText(equipment) {
        return [
            equipment.userEquipmentName,
            equipment.forgerName,
            equipment.description,
            equipment.equipmentTemplate,
            equipment.equipmentFeatureString
        ].map(cleanText).join(" ");
    }

    function includesAny(text, words) {
        const normalized = normalizeText(text);

        return words.some((word) => {
            return normalized.includes(String(word).toLowerCase());
        });
    }

/* =========================================================
   13. Item Type / Set / Quality Guessing
========================================================= */

    function guessQuality(equipment) {
        const index = Number(equipment.nameIndexQualityDescriptor);

        if (index >= 0 && index < qualityList.length) {
            return qualityList[index];
        }

        const text = getCombinedItemText(equipment);
        const matchedQuality = qualityList.find((quality) => {
            return normalizeText(text).includes(quality.toLowerCase());
        });

        if (matchedQuality) {
            return matchedQuality;
        }

        const maxLevel = Number(equipment.maximumUpgradeLevel || 0);

        if (maxLevel >= 370) {
            return "Ult++?";
        }

        if (maxLevel >= 300) {
            return "Ultimate?";
        }

        if (maxLevel >= 200) {
            return "Supreme/Trans?";
        }

        if (maxLevel >= 100) {
            return "Mythical?";
        }

        return "Unknown";
    }

    function guessArmorSet(equipment) {
        const text = getCombinedItemText(equipment);

        if (includesAny(text, ["pristine"])) {
            return "Pristine";
        }

        if (includesAny(text, ["plate"])) {
            return "Plate";
        }

        if (includesAny(text, ["chain"])) {
            return "Chain";
        }

        if (includesAny(text, ["mail"])) {
            return "Mail";
        }

        if (includesAny(text, ["leather"])) {
            return "Leather";
        }

        if (includesAny(text, ["zamira"])) {
            return "Zamira";
        }

        return "Unknown";
    }

    function guessItemType(equipment) {
        const text = getCombinedItemText(equipment);

        if (includesAny(text, ["helmet", "helm", "hat", "cap", "head"])) {
            return "Helmet";
        }

        if (includesAny(text, ["torso", "chest", "vest", "shirt", "tunic", "armor"])
            && !includesAny(text, ["accessory"])) {
            return "Torso";
        }

        if (includesAny(text, ["gauntlet", "glove", "hand"])) {
            return "Gauntlet";
        }

        if (includesAny(text, ["boot", "shoe", "foot", "greave"])) {
            return "Boots";
        }

        if (includesAny(text, ["bracer", "bracers"])) {
            return "Bracers";
        }

        if (includesAny(text, ["brooch"])) {
            return "Brooch";
        }

        if (includesAny(text, ["mask"])) {
            return "Mask";
        }

        if (includesAny(text, ["shield"])) {
            return "Shield";
        }

        if (includesAny(text, ["familiar", "pet", "guardian", "cat", "genie", "dragon", "seahorse", "propeller", "fairy", "tiger", "griffin", "donkey", "horse", "imp", "hawk", "chicken"])) {
            return "Pet";
        }

        if (equipment.isSecondary) {
            return "Secondary";
        }

        if (includesAny(text, ["weapon", "sword", "staff", "bow", "gun", "spear", "cannon", "blade", "shooter", "crossbow", "rifle", "lance", "polearm"])) {
            return "Weapon";
        }

        if (Number(equipment.currentUpgradeLevel || 0) === 1
            && Number(equipment.maximumUpgradeLevel || 0) === 1
            && (equipment.statModifiers || []).every((value, index) => index === 0 || Number(value || 0) === 0)) {
            return "Currency";
        }

        return "Equipment";
    }

/* =========================================================
   14. Friendly Item Names
========================================================= */

    function isGenericEquipmentName(value) {
        const text = normalizeText(value);

        return (
            !text ||
            text === "gearcat" ||
            text === "aura" ||
            text === "basic familar" ||
            text === "basic familiar" ||
            text === "unnamed equipment" ||
            text === "equipment" ||
            text === "accessory equipment" ||
            text === "dundef equipment" ||
            text === "unknown equipment template" ||
            text === "armor base" ||
            text === "weapon base" ||
            text === "pet base"
        );
    }

    function splitReadableWords(value) {
        return cleanText(value)
            .replace(/_/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/([A-Za-z])(\d)/g, "$1 $2")
            .replace(/(\d)([A-Za-z])/g, "$1 $2")
            .replace(/\bUlt\s*\+\s*\+\b/gi, "Ult++")
            .replace(/\bUlt\s*\+\b/gi, "Ult+")
            .replace(/\s+/g, " ")
            .trim();
    }

    function titleCleanup(value) {
        return splitReadableWords(value)
            .replace(/\bDun Def\b/gi, "")
            .replace(/\bCDT\b/gi, "")
            .replace(/\bAccessory Equipment\b/gi, "")
            .replace(/\bAccesory Equipment\b/gi, "")
            .replace(/\bEssory Equipment\b/gi, "")
            .replace(/\bAccessory\b/gi, "")
            .replace(/\bEquipment\b/gi, "")
            .replace(/\bArmor Base\b/gi, "")
            .replace(/\bWeapon Base\b/gi, "")
            .replace(/\bPet Base\b/gi, "")
            .replace(/\bFamiliar\b/gi, "")
            .replace(/\bHero Equipment\b/gi, "")
            .replace(/\bArchetypes\b/gi, "")
            .replace(/\bItems\b/gi, "")
            .replace(/\bItem\b/gi, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function makeFriendlyTemplateName(value) {
        const text = cleanText(value);

        if (!text) {
            return "";
        }

        const pathParts = text.split(".").filter((part) => {
            return part.trim() !== "";
        });

        let coreName = pathParts.length > 0
            ? pathParts[pathParts.length - 1]
            : text;

        coreName = coreName
            .replace(/^AccessoryEquipment_?/i, "")
            .replace(/^AccesoryEquipment_?/i, "")
            .replace(/^Equipment_?/i, "")
            .replace(/^DunDefEquipment_?/i, "")
            .replace(/^ArmorBase_?/i, "")
            .replace(/^WeaponBase_?/i, "")
            .replace(/^PetBase_?/i, "")
            .replace(/^Familiar_?/i, "")
            .replace(/^HeroEquipment_?/i, "")
            .replace(/^Acc(?=[A-Z_])/i, "");

        const specialNames = {
            Hat_LifeTree: "Life Tree Hat",
            LifeTreeHat: "Life Tree Hat",
            AccLifeTreeHat: "Life Tree Hat",
            HallowsPumpkinHead: "Hallows Pumpkin Head",
            GoblinMech: "Goblin Mech",
            MinerBracer: "Miner Bracer",
            Mask10: "Mask 10",
            Mask15: "Mask 15",
            Feather02: "Feather 02",
            GargoyleHorns: "Gargoyle Horns",
            Giraffe_Ruthless: "Ruthless Giraffe",
            Griffon_Ruthless: "Ruthless Griffon",
            HeroEquipment_Apprentice02_Ruthless: "Apprentice Ruthless",
            HeroEquipment_Monk02_Ruthless: "Monk Ruthless",
            HeroEquipment_Huntress02_Ruthless: "Huntress Ruthless",
            HeroEquipment_Squire02_Ruthless: "Squire Ruthless"
        };

        if (specialNames[coreName]) {
            return specialNames[coreName];
        }

        const friendlyName = titleCleanup(coreName);

        if (!friendlyName || isGenericEquipmentName(friendlyName)) {
            return "";
        }

        return friendlyName;
    }

    function getFriendlyEquipmentName(value) {
        const text = cleanText(value);

        if (!text || isGenericEquipmentName(text)) {
            return "";
        }

        if (text.includes(".") || text.includes("_")) {
            const friendlyTemplateName = makeFriendlyTemplateName(text);

            if (friendlyTemplateName) {
                return friendlyTemplateName;
            }
        }

        const friendlyName = titleCleanup(text);

        if (!friendlyName || isGenericEquipmentName(friendlyName)) {
            return "";
        }

        return friendlyName;
    }

    function buildItemName(equipment) {
        const userName = getFriendlyEquipmentName(equipment.userEquipmentName);
        const forgerName = getFriendlyEquipmentName(equipment.forgerName);
        const templateName = makeFriendlyTemplateName(equipment.equipmentTemplate);
        const itemType = guessItemType(equipment);

        if (userName) {
            return userName;
        }

        if (forgerName) {
            return forgerName;
        }

        if (templateName) {
            return templateName;
        }

        if (itemType && itemType !== "Unknown") {
            return `${itemType} Equipment`;
        }

        return "Unnamed Equipment";
    }

/* =========================================================
   15. Gear Row Creation
========================================================= */

    function finalizeItemRow(row) {
        const stats = row.stats || createEmptyStats();
        const resists = row.resists || createEmptyResists();

        return {
            ...row,
            stats: stats,
            resists: resists,
            towerTotal: window.dd1GearItemModel.sumStats(stats, ["towerHealth", "towerDamage", "towerRange", "towerRate"]),
            heroTotal: window.dd1GearItemModel.sumStats(stats, ["heroHealth", "heroDamage", "heroSpeed", "heroCasting", "ability1", "ability2"]),
            resistTotal: window.dd1GearItemModel.sumResists(resists)
        };
    }

    function buildRowFromEquipment(equipment, index) {
        const stats = getStatsFromArray(equipment.statModifiers || []);
        const resists = {
            generic: Number((equipment.damageReductionPercentage || [])[0] || 0),
            poison: Number((equipment.damageReductionPercentage || [])[1] || 0),
            fire: Number((equipment.damageReductionPercentage || [])[2] || 0),
            lightning: Number((equipment.damageReductionPercentage || [])[3] || 0)
        };

        const itemType = guessItemType(equipment);
        const armorSet = guessArmorSet(equipment);
        const name = buildItemName(equipment);
        const location = cleanText(equipment.location) || "Unknown Location";
        const isEquipped = Boolean(equipment.isEquipped);
        const equippedHero = isEquipped
            ? cleanText(equipment.equippedHeroName) || "Unknown Hero"
            : "";
        const equippedHeroClass = isEquipped
            ? cleanText(equipment.equippedHeroClass) || "Unknown"
            : "";

        return finalizeItemRow({
            id: `dun-${index + 1}-${equipment.equipmentId1 || 0}-${equipment.equipmentId2 || 0}`,
            source: isEquipped ? "equipped" : getSourceFromLocation(location),
            location: location,
            equippedHero: equippedHero,
            equippedHeroClass: equippedHeroClass,
            heroNumber: Number(equipment.heroNumber || 0),
            itemNumber: index + 1,
            itemType: itemType,
            armorSet: armorSet,
            quality: guessQuality(equipment),
            name: name,
            template: cleanText(equipment.equipmentTemplate) || "Unknown Equipment Template",
            currentLevel: Number(equipment.currentUpgradeLevel || 0),
            maxLevel: Number(equipment.maximumUpgradeLevel || 0),
            stats: stats,
            resists: resists,
            isLocked: Boolean(equipment.isLocked),
            isSecondary: Boolean(equipment.isSecondary),
            isEquipped: isEquipped,
            folderId: Number(equipment.folderId || -1),
            storedMana: Number(equipment.storedMana || 0),
            userSellPrice: Number(equipment.userSellPrice || 0),
            weapon: {
                damage: Number(equipment.weaponDamageBonus || 0),
                projectiles: Number(equipment.weaponNumberOfProjectilesBonus || 0) - 127,
                projectileSpeed: Number(equipment.weaponSpeedOfProjectilesBonus || 0),
                additionalDamage: Number(equipment.weaponAdditionalDamageAmount || 0),
                shotsPerSecond: Number(equipment.weaponShotsPerSecondBonus || 0) - 127,
                chargeSpeed: Number(equipment.weaponChargeSpeedBonus || 0) - 127,
                swingSpeed: Number(equipment.weaponSwingSpeedMultiplier || 0),
                altDamage: Number(equipment.weaponAltDamageBonus || 0)
            },
            rawEquipment: equipment
        });
    }

    function getSourceFromLocation(location) {
        const text = normalizeText(location);

        if (text.includes("itembox") || text.includes("item box")) {
            return "itemBox";
        }

        if (text.includes("tavern")) {
            return "tavern";
        }

        if (text.includes("shop")) {
            return "shop";
        }

        if (text.includes("heroequipment")) {
            return "heroEquipmentExtra";
        }

        return "inventory";
    }

    function buildRowsFromFullInventory(fullInventory) {
        return fullInventory.items.map((equipment, index) => {
            return buildRowFromEquipment(equipment, index);
        });
    }

/* =========================================================
   16. Main File Parsers
========================================================= */

    async function parseDunFile(file) {
        requireParser();

        const arrayBuffer = await file.arrayBuffer();
        const fallbackSaveData = window.parseDd1OptimizerSave(arrayBuffer, file.name);
        const fallbackHeroes = window.dd1GearItemModel.buildHeroSummary(fallbackSaveData);
        let fullInventory = null;
        let rows = [];
        let inventoryMessage = "Equipped gear from save file";
        let fullInventoryReady = false;
        let warnings = [];

        try {
            fullInventory = parseFullInventory(arrayBuffer);
            rows = buildRowsFromFullInventory(fullInventory);
            inventoryMessage = "Full save inventory";
            fullInventoryReady = true;
        } catch (error) {
            rows = window.dd1GearItemModel.buildRowsFromSaveData(fallbackSaveData).map((row) => {
                return {
                    ...row,
                    isEquipped: true,
                    source: "equipped"
                };
            });

            warnings = [
                `Full inventory parser fell back to equipped gear only: ${error.message || "unknown parser error"}`
            ];
        }

        const heroes = fullInventory
            ? buildHeroSummariesFromFullInventory(fullInventory, fallbackHeroes)
            : fallbackHeroes;

        return {
            fileName: file.name,
            fileType: "dun",
            saveData: fallbackSaveData,
            fullInventory: fullInventory,
            heroes: heroes,
            items: rows,
            fullInventoryReady: fullInventoryReady,
            inventoryMessage: inventoryMessage,
            warnings: warnings
        };
    }

    async function parseCsvFile(file) {
        const text = await file.text();
        const csvRows = parseCsvText(text);

        if (csvRows.length === 0) {
            throw new Error("The CSV did not contain any gear rows.");
        }

        const heroes = buildHeroSummariesFromCsv(csvRows);
        const items = buildItemsFromCsv(csvRows);

        return {
            fileName: file.name,
            fileType: "csv",
            saveData: null,
            heroes: heroes,
            items: items,
            fullInventoryReady: true,
            inventoryMessage: "CSV gear rows",
            warnings: []
        };
    }

    async function parseFile(file) {
        if (!file) {
            throw new Error("Choose a DunDefHeroes.dun file or gear CSV first.");
        }

        const fileName = file.name.toLowerCase();

        if (fileName.endsWith(".csv")) {
            return parseCsvFile(file);
        }

        if (fileName.endsWith(".dun")) {
            return parseDunFile(file);
        }

        throw new Error("Unsupported file type. Use a .dun save file or .csv gear export.");
    }

    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener("load", () => {
                resolve(reader.result);
            });

            reader.addEventListener("error", () => {
                reject(reader.error || new Error("Could not read the file."));
            });

            reader.readAsDataURL(file);
        });
    }

    async function saveFileForSession(file) {
        if (!file || !file.name.toLowerCase().endsWith(".dun")) {
            return null;
        }

        const dataUrl = await fileToDataUrl(file);

        const meta = {
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
            lastModified: file.lastModified || Date.now(),
            savedAt: new Date().toISOString()
        };

        sessionStorage.setItem(sessionFileKey, dataUrl);
        sessionStorage.setItem(sessionMetaKey, JSON.stringify(meta));

        return meta;
    }

    function getSessionFile() {
        const dataUrl = sessionStorage.getItem(sessionFileKey);
        const rawMeta = sessionStorage.getItem(sessionMetaKey);

        if (!dataUrl || !rawMeta) {
            return null;
        }

        try {
            const meta = JSON.parse(rawMeta);
            const parts = dataUrl.split(",");

            if (parts.length < 2) {
                return null;
            }

            const binary = atob(parts[1]);
            const bytes = new Uint8Array(binary.length);

            for (let index = 0; index < binary.length; index++) {
                bytes[index] = binary.charCodeAt(index);
            }

            return new File(
                [bytes],
                meta.name || "DunDefHeroes.dun",
                {
                    type: meta.type || "application/octet-stream",
                    lastModified: meta.lastModified || Date.now()
                }
            );
        } catch {
            return null;
        }
    }

/* =========================================================
   18. Public API
========================================================= */

    window.dd1GearSaveReader = {
        getSessionFile: getSessionFile,
        parseFile: parseFile,
        saveFileForSession: saveFileForSession
    };
})();
