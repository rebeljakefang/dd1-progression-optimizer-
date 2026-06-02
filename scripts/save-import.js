/* =========================================================
   1. Page Elements
========================================================= */

const saveFileInput = document.querySelector("#save-file-input");
const saveFileOutput = document.querySelector("#save-file-output");


/* =========================================================
   2. Save Reader Constants
========================================================= */

const maxAchievements = 500;

const dd1HeroClassRules = [
    {
        className: "Apprentice",
        templateIncludes: [
            "DunDefPlayers.HeroTemplateApprentice",
            "DunDefHeroes.HeroTemplateApprentice",
            "DunDefHeroes.HeroTemplate_Apprentice",
            "DunDefNewHeroes.HeroTemplateSorceress",
            "HeroTemplateApprentice",
            "HeroTemplateSorceress",
            "Apprentice",
            "Sorceress"
        ]
    },
    {
        className: "Squire",
        templateIncludes: [
            "DunDefPlayers.HeroTemplateSquire",
            "DunDefHeroes.HeroTemplateSquire",
            "DunDefHeroes.HeroTemplate_Squire",
            "DunDefNewHeroes.HeroTemplateLadyKnight",
            "HeroTemplateSquire",
            "HeroTemplateLadyKnight",
            "Squire",
            "LadyKnight",
            "Countess"
        ]
    },
    {
        className: "Huntress",
        templateIncludes: [
            "DunDefPlayers.HeroTemplateHuntress",
            "DunDefHeroes.HeroTemplateHuntress",
            "DunDefHeroes.HeroTemplate_Huntress",
            "DunDefNewHeroes.HeroTemplateHunter",
            "HeroTemplateHuntress",
            "HeroTemplateHunter",
            "Huntress",
            "Hunter",
            "Ranger"
        ]
    },
    {
        className: "Monk",
        templateIncludes: [
            "DunDefPlayers.HeroTemplateRecruit",
            "DunDefPlayers.HeroTemplateInitiate",
            "DunDefHeroes.HeroTemplateMonk",
            "DunDefHeroes.HeroTemplate_Monk",
            "DunDefNewHeroes.HeroTemplateMonkette",
            "HeroTemplateRecruit",
            "HeroTemplateInitiate",
            "HeroTemplateMonk",
            "HeroTemplateMonkette",
            "Monk",
            "Initiate",
            "Monkette",
            "Recruit"
        ]
    }
];
/* =========================================================
   3. Steam Achievement Data
========================================================= */

const dd1SteamAchievementIndex = [
    "ACH_SMITHY",
    "ACH_MY_WEAPON",
    "ACH_OBEDIENCE",
    "ACH_PUPIL",
    "ACH_VETERAN",
    "ACH_ETHERIA",
    "ACH_LIMIT",
    "ACH_DEPTHS",
    "ACH_ROOFTOPS",
    "ACH_VICTORY",
    "ACH_CRAWLER",
    "ACH_BELLY",
    "ACH_BODY",
    "ACH_CROWN",
    "ACH_RAIDER",
    "ACH_BRIMSTONE",
    "ACH_KEEP",
    "ACH_SUMMIT",
    "ACH_DEFENDER",
    "ACH_BLUEPRINT",
    "ACH_FRIENDS",
    "ACH_CORE",
    "ACH_ELLA",
    "ACH_WIZARD",
    "ACH_MUSHROOM",
    "ACH_FREAK",
    "ACH_FOWL",
    "ACH_CARDIO",
    "ACH_MANIA",
    "ACH_DESTROYER",
    "ACH_GOLD",
    "ACH_CHALLANGER",
    "ACH_WEAPON",
    "ACH_EXTERMINATOR",
    "ACH_MADNESS",
    "ACH_DANCING",
    "ACH_BLITZ",
    "ACH_BLOCK",
    "ACH_SURVIVALIST",
    "ACH_THICK",
    "ACH_TOUGH",
    "ACH_IRONMAN",
    "ACH_OFFENSE",
    "ACH_NOBILITY",
    "ACH_SMITER",
    "ACH_DEVINE",
    "ACH_PERFECTIONIST",
    "ACH_DAREDEVIL",
    "ACH_MASTERMIND",
    "ACH_FORCE",
    "ACH_EFFORT",
    "ACH_PERSPECTIVE",
    "ACH_HUG",
    "ACH_CATCH",
    "ACH_BANKER",
    "ACH_STUDENT",
    "ACH_LEGENDARY",
    "ACH_XMAS",
    "ACH_ETERNIASHARDS_PART1_ANY",
    "ACH_ETERNIASHARDS_PART1_NIGHTMARE",
    "ACH_PORTAL_PROTECTOR",
    "ACH_PORTAL_PROTECTOR_NIGHTMARE",
    "ACH_MYTHICAL_DEFENDER",
    "NEW_ACHIEVEMENT_9_2",
    "NEW_ACHIEVEMENT_9_3",
    "NEW_ACHIEVEMENT_9_4",
    "ACH_PLAYIN_CUPID",
    "ACH_PLAYIN_CUPID_NIGHTMARE",
    "ACH_CHALLENGE_MYTHICAL_HARDCORE",
    "ACH_ETERNIASHARDS_PART2_ANY",
    "ACH_DJINN_RECRUITER",
    "ACH_ETERNIASHARDS_PART2_NIGHTMARE",
    "ACH_DJINN_RECRUITER_NIGHTMARE",
    "ACH_TRANSCENDENT_SURVIVALIST",
    "ACH_ETERNIASHARDS_PART3_ANY",
    "ACH_PUZZLE_SOLVER",
    "ACH_ETERNIASHARDS_PART3_NIGHTMARE",
    "ACH_PUZZLE_SOLVER_NIGHTMARE",
    "ACH_RTS",
    "ACH_RTS_MYTHICAL",
    "ACH_ETERNIASHARDS_PART4_ANY",
    "ACH_ETERNIASHARDS_PART4_NIGHTMARE",
    "ACH_BOSS_CRUSHER",
    "ACH_BOSS_CRUSHER_NIGHTMARE",
    "ACH_HEROES",
    "ACH_HEROES_NIGHTMARE",
    "ACH_MONSTERS",
    "ACH_ULTIMATE_DEFENDER",
    "ACH_ANNIVERSARY",
    "ACH_ANNIVERSARY_NIGHTMARE",
    "ACH_PUMPKIN_PARTY",
    "ACH_PUMPKINPARTY_NIGHTMARE",
    "ACH_GREATER_TURKEYHUNTER",
    "ACH_GREATER_TURKEYHUNTER_NIGHTMARE",
    "ACH_SILENT_NIGHT",
    "ACH_SILENT_NIGHT_NIGHTMARE",
    "ACH_WINTER_WONDERLAND",
    "ACH_WINTER_WONDERLAND_NIGHTMARE",
    "ACH_VDAY_2013",
    "ACH_VDAY_2013_NIGHTMARE",
    "ACH_LAB",
    "ACH_LAB_NIGHTMARE",
    "ACH_LABASSAULT",
    "ACH_LABASSAULT_NIGHTMARE",
    "ACH_TRIAL_FIRELIGHT",
    "ACH_TRIAL_FIRELIGHT_NIGHTMARE",
    "ACH_MOONBASE",
    "ACH_MOONBASE_NIGHTMARE",
    "ACH_TEMPLE_WATER",
    "ACH_TEMPLE_WATER_NIGHTMARE",
    "ACH_BUCCANEER_BAY",
    "ACH_BUCCANEER_BAY_NIGHTMARE",
    "ACH_CR",
    "ACH_CR_NIGHTMARE",
    "ACH_WM_NIGHTMARE",
    "ACH_IF_NIGHTMARE",
    "ACH_OME_NIGHTMARE",
    "ACH_TOMB_NIGHTMARE"
];

const dd1SteamAchievementNames = {
    ACH_SMITHY: "Smithy",
    ACH_MY_WEAPON: "And This Is My Weapon",
    ACH_OBEDIENCE: "Obedience Training",
    ACH_PUPIL: "Pupil",
    ACH_VETERAN: "Veteran",
    ACH_ETHERIA: "Defender of Etheria",
    ACH_LIMIT: "To The Limit",
    ACH_DEPTHS: "From the Depths",
    ACH_ROOFTOPS: "To the Rooftops",
    ACH_VICTORY: "A Taste of Victory",
    ACH_CRAWLER: "Dungeon Crawler",
    ACH_BELLY: "The Belly of the Beast",
    ACH_BODY: "The Body of the Beast",
    ACH_CROWN: "The Crown of the Beast",
    ACH_RAIDER: "Dungeon Raider",
    ACH_BRIMSTONE: "From Fire with Brimstone",
    ACH_KEEP: "Through The Crowded Keep",
    ACH_SUMMIT: "To the Lofty Summit",
    ACH_DEFENDER: "Dungeon Defender",
    ACH_BLUEPRINT: "Where's The Blueprints?",
    ACH_FRIENDS: "Friends Forever",
    ACH_CORE: "88 Core",
    ACH_ELLA: "Ella, Ella",
    ACH_WIZARD: "Wizard Hunter",
    ACH_MUSHROOM: "You No Take Mushroom",
    ACH_FREAK: "Speed Freak",
    ACH_FOWL: "In A Fowl Mood",
    ACH_CARDIO: "Core Cardio",
    ACH_MANIA: "Monster Mania",
    ACH_DESTROYER: "Core Destroyer",
    ACH_GOLD: "Gold Rush",
    ACH_CHALLANGER: "A Challenger Approaches",
    ACH_WEAPON: "Weapon Master",
    ACH_EXTERMINATOR: "Kobold Exterminator",
    ACH_MADNESS: "Monster Madness",
    ACH_DANCING: "Dancing in the Rain",
    ACH_BLITZ: "Gold Blitz",
    ACH_BLOCK: "Ogre Block Party",
    ACH_SURVIVALIST: "Survivalist",
    ACH_THICK: "Thick Skin",
    ACH_TOUGH: "Tough Guy",
    ACH_IRONMAN: "Iron Man",
    ACH_OFFENSE: "Defense Is the Best Offense",
    ACH_NOBILITY: "True Nobility",
    ACH_SMITER: "O Mighty Smiter!",
    ACH_DEVINE: "Divine Intention",
    ACH_PERFECTIONIST: "Perfectionist",
    ACH_DAREDEVIL: "Daredevil",
    ACH_MASTERMIND: "Mastermind",
    ACH_FORCE: "Brute Force",
    ACH_EFFORT: "Team Effort",
    ACH_PERSPECTIVE: "A Matter of Perspective",
    ACH_HUG: "Group Hug",
    ACH_CATCH: "Catch 'em All",
    ACH_BANKER: "Master Banker",
    ACH_STUDENT: "Good Student",
    ACH_LEGENDARY: "Legendary Defender",
    ACH_XMAS: "Jingled All the Way",
    ACH_ETERNIASHARDS_PART1_ANY: "Eternia Shard Recovered: Purple",
    ACH_ETERNIASHARDS_PART1_NIGHTMARE: "Nightmare Eternia Shard: Purple",
    ACH_PORTAL_PROTECTOR: "Portal Protector",
    ACH_PORTAL_PROTECTOR_NIGHTMARE: "Nightmare Portal Protector",
    ACH_MYTHICAL_DEFENDER: "Mythical Defender",
    NEW_ACHIEVEMENT_9_2: "Hardcore Mythical Defender",
    NEW_ACHIEVEMENT_9_3: "Dungeon Raider",
    NEW_ACHIEVEMENT_9_4: "Mythical Dungeon Raider",
    ACH_PLAYIN_CUPID: "Playin' Cupid",
    ACH_PLAYIN_CUPID_NIGHTMARE: "Playin' Mythical Cupid",
    ACH_CHALLENGE_MYTHICAL_HARDCORE: "Transcendent Challenge Champion",
    ACH_ETERNIASHARDS_PART2_ANY: "Eternia Shard Recovered: Blue",
    ACH_DJINN_RECRUITER: "Djinn Recruiter",
    ACH_ETERNIASHARDS_PART2_NIGHTMARE: "Nightmare Eternia Shard: Blue",
    ACH_DJINN_RECRUITER_NIGHTMARE: "Nightmare Djinn Recruiter",
    ACH_TRANSCENDENT_SURVIVALIST: "Transcendent Survivalist",
    ACH_ETERNIASHARDS_PART3_ANY: "Eternia Shard Recovered: Yellow",
    ACH_PUZZLE_SOLVER: "Puzzle Solver",
    ACH_ETERNIASHARDS_PART3_NIGHTMARE: "Nightmare Eternia Shard: Yellow",
    ACH_PUZZLE_SOLVER_NIGHTMARE: "Nightmare Puzzle Solver",
    ACH_RTS: "Real Time Strategist",
    ACH_RTS_MYTHICAL: "Mythical Real Time Strategist",
    ACH_ETERNIASHARDS_PART4_ANY: "Eternia Shard Recovered: Red",
    ACH_ETERNIASHARDS_PART4_NIGHTMARE: "Nightmare Eternia Shard: Red",
    ACH_BOSS_CRUSHER: "Boss Crusher",
    ACH_BOSS_CRUSHER_NIGHTMARE: "Nightmare Boss Crusher",
    ACH_HEROES: "Heroes to the Rescue",
    ACH_HEROES_NIGHTMARE: "Nightmare Heroes to the Rescue",
    ACH_MONSTERS: "I've Got Monsters in My Pocket",
    ACH_ULTIMATE_DEFENDER: "Ultimate Defender",
    ACH_ANNIVERSARY: "Anniversary",
    ACH_ANNIVERSARY_NIGHTMARE: "Nightmare Anniversary",
    ACH_PUMPKIN_PARTY: "Pumpkin Party",
    ACH_PUMPKINPARTY_NIGHTMARE: "Nightmare Pumpkin Party",
    ACH_GREATER_TURKEYHUNTER: "Greater Turkey Hunt",
    ACH_GREATER_TURKEYHUNTER_NIGHTMARE: "Nightmare Greater Turkey Hunt",
    ACH_SILENT_NIGHT: "Silent Night",
    ACH_SILENT_NIGHT_NIGHTMARE: "Nightmare Silent Night",
    ACH_WINTER_WONDERLAND: "Winter Wonderland",
    ACH_WINTER_WONDERLAND_NIGHTMARE: "Nightmare Winter Wonderland",
    ACH_VDAY_2013: "Playin' Anticupid",
    ACH_VDAY_2013_NIGHTMARE: "Nightmare Playin' Anticupid",
    ACH_LAB: "Tinkerer's Defender",
    ACH_LAB_NIGHTMARE: "Nightmare Tinkerer's Defender",
    ACH_LABASSAULT: "EV Reprogrammer",
    ACH_LABASSAULT_NIGHTMARE: "Nightmare EV Reprogrammer",
    ACH_TRIAL_FIRELIGHT: "Trial by Fire and Lightning",
    ACH_TRIAL_FIRELIGHT_NIGHTMARE: "Nightmare Trial by Fire and Lightning",
    ACH_MOONBASE: "Out of this World",
    ACH_MOONBASE_NIGHTMARE: "Nightmare Out of this World",
    ACH_TEMPLE_WATER: "Hero of Water",
    ACH_TEMPLE_WATER_NIGHTMARE: "Nightmare Hero of Water",
    ACH_BUCCANEER_BAY: "Swashbuckler",
    ACH_BUCCANEER_BAY_NIGHTMARE: "Nightmare Swashbuckler",
    ACH_CR: "Crystalline Resurgence",
    ACH_CR_NIGHTMARE: "Nightmare Crystalline Resurgence",
    ACH_WM_NIGHTMARE: "Nightmare Wintermire",
    ACH_IF_NIGHTMARE: "Nightmare Infested Ruins",
    ACH_OME_NIGHTMARE: "Nightmare The Outcast Summoner",
    ACH_TOMB_NIGHTMARE: "Nightmare Tomb of Etheria"
};

function getDd1AchievementName(steamId) {
    return dd1SteamAchievementNames[steamId] || steamId;
}


/* =========================================================
   4. HTML Safety Helper
========================================================= */

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
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
   8. Pattern Search Helpers
========================================================= */

function stringToBytes(value) {
    const bytes = [];

    for (let index = 0; index < value.length; index++) {
        bytes.push(value.charCodeAt(index));
    }

    return bytes;
}


function findAsciiPattern(bytes, pattern, startPosition) {
    const patternBytes = stringToBytes(pattern);

    for (let index = Math.max(0, startPosition); index <= bytes.length - patternBytes.length; index++) {
        let matched = true;

        for (let patternIndex = 0; patternIndex < patternBytes.length; patternIndex++) {
            if (bytes[index + patternIndex] !== patternBytes[patternIndex]) {
                matched = false;
                break;
            }
        }

        if (matched) {
            return index;
        }
    }

    return -1;
}


function findAllAsciiPatternMatches(bytes, pattern) {
    const matches = [];
    let startPosition = 0;

    while (startPosition < bytes.length) {
        const position = findAsciiPattern(bytes, pattern, startPosition);

        if (position === -1) {
            break;
        }

        matches.push(position);
        startPosition = position + 1;
    }

    return matches;
}


function getNullTerminatedAscii(bytes, startPosition, maxLength) {
    let output = "";

    for (let index = startPosition; index < startPosition + maxLength && index < bytes.length; index++) {
        const byte = bytes[index];

        if (byte === 0) {
            break;
        }

        if (byte >= 32 && byte <= 126) {
            output += String.fromCharCode(byte);
        } else {
            break;
        }
    }

    return output.trim();
}


/* =========================================================
   9. Hero Scanner
========================================================= */

function looksLikeRealHeroTemplate(bytes, templatePosition) {
    const preview = bytesToAscii(bytes, templatePosition, 350);

    return (
        preview.includes("EntryHealSelf") ||
        preview.includes("EntryRepair") ||
        preview.includes("EntryUpgradeTower") ||
        preview.includes("EntryPhaseShift") ||
        preview.includes("EntryCalltoArms") ||
        preview.includes("EntryWheeloFortuna")
    );
}


function extractHeroTemplate(bytes, templatePosition) {
    return getNullTerminatedAscii(bytes, templatePosition, 120) || "Unknown Template";
}


function extractHeroNameBeforeTemplate(bytes, templatePosition) {
    const templateLengthPosition = templatePosition - 4;
    let bestName = null;
    let bestPosition = -1;

    for (let position = templateLengthPosition - 1; position >= Math.max(0, templateLengthPosition - 140); position--) {
        const possibleLength = readI32At(bytes, position);

        if (possibleLength === null) {
            continue;
        }

        if (possibleLength < 3 || possibleLength > 40) {
            continue;
        }

        const stringStart = position + 4;
        const stringEnd = stringStart + possibleLength;

        if (stringEnd > templateLengthPosition) {
            continue;
        }

        const raw = bytes.slice(stringStart, stringEnd);

        if (raw.length === 0) {
            continue;
        }

        if (raw[raw.length - 1] !== 0) {
            continue;
        }

        let readable = true;

        for (let index = 0; index < raw.length - 1; index++) {
            const byte = raw[index];

            if (byte < 32 || byte > 126) {
                readable = false;
                break;
            }
        }

        if (!readable) {
            continue;
        }

        const name = readAsciiStringAt(bytes, stringStart, possibleLength);

        if (name.length >= 3) {
            bestName = name;
            bestPosition = position;
            break;
        }
    }

    return {
        name: bestName || "Unnamed Hero",
        namePosition: bestPosition
    };
}


function scanHeroes(bytes) {
    const templatePositions = [];

    heroTemplatePatterns.forEach((pattern) => {
        const matches = findAllAsciiPatternMatches(bytes, pattern);

        matches.forEach((position) => {
            if (looksLikeRealHeroTemplate(bytes, position)) {
                templatePositions.push(position);
            }
        });
    });

    templatePositions.sort((a, b) => a - b);

    const uniqueTemplatePositions = [];

    templatePositions.forEach((position) => {
        const alreadySaved = uniqueTemplatePositions.some((savedPosition) => {
            return Math.abs(savedPosition - position) < 10;
        });

        if (!alreadySaved) {
            uniqueTemplatePositions.push(position);
        }
    });

    return uniqueTemplatePositions.map((templatePosition, index) => {
        const nameInfo = extractHeroNameBeforeTemplate(bytes, templatePosition);
        const template = extractHeroTemplate(bytes, templatePosition);

        return {
            number: index + 1,
            name: nameInfo.name,
            namePosition: nameInfo.namePosition,
            template: template,
            templatePosition: templatePosition,
            previewAscii: bytesToAscii(bytes, templatePosition - 40, 240),
            previewHex: debugBytes(bytes, templatePosition - 40, 160)
        };
    });
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
            () => reader.readI8("damage_reduction_index"),
            "damage_reduction_index"
        ),
        damageReductionPercentage: reader.readArray(
            4,
            () => reader.readI8("damage_reduction_percentage"),
            "damage_reduction_percentage"
        ),
        statModifiers: reader.readArray(
            11,
            () => reader.readI32("stat_modifier"),
            "stat_modifiers"
        ),
        spawnStatModifiers: reader.readArray(
            11,
            () => reader.readI32("spawn_stat_modifier"),
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

        nameIndexBase: reader.readI8("name_index_base"),
        nameIndexDamageReduction: reader.readI8("name_index_damage_reduction"),
        nameIndexQualityDescriptor: reader.readI8("name_index_quality_descriptor"),

        primaryColorSet: reader.readI8("primary_color_set"),
        secondaryColorSet: reader.readI8("secondary_color_set"),

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


function readAchievementInfo(reader) {
    return {
        achievements: reader.readArray(
            maxAchievements,
            () => reader.readI8("achievement"),
            "achievements"
        )
    };
}


function readCoreUnlockInfo(reader) {
    return {
        coreUnlocks: reader.readArray(
            40,
            () => reader.readI8("core_unlock"),
            "core_unlocks"
        )
    };
}


function readCrystalCoreOptions(reader) {
    return {
        coreIndex: reader.readI32("core_index"),
        color1: readLinearColor(reader, "core_color_1"),
        color2: readLinearColor(reader, "core_color_2"),
        color3: readLinearColor(reader, "core_color_3")
    };
}


function readLevelProgressInfo(reader) {
    return {
        campaignTag: reader.readOptionString("campaign_tag"),
        difficultyMask: reader.readI32("difficulty_mask")
    };
}


function readSaveFileInfoUntilLevelProgress(bytes) {
    const reader = new SaveBinaryReader(bytes);

    const versionNumber = reader.readI32("version_number");
    const size = reader.readI32("size");

    const options = readOptionsInfo(reader);
    const heroes = reader.readVec(() => readHero(reader), "heroes");
    const achievements = readAchievementInfo(reader);
    const coreInfo = readCoreUnlockInfo(reader);
    const coreOptions = readCrystalCoreOptions(reader);
    const beatenLevels = reader.readVec(() => readLevelProgressInfo(reader), "beaten_levels");
    const unlockedLevels = reader.readVec(() => readLevelProgressInfo(reader), "unlocked_levels");

    return {
        versionNumber: versionNumber,
        size: size,
        options: options,
        heroes: heroes,
        achievements: achievements,
        coreInfo: coreInfo,
        coreOptions: coreOptions,
        beatenLevels: beatenLevels,
        unlockedLevels: unlockedLevels,
        readerPosition: reader.position,
        remainingBytes: reader.remaining()
    };
}


function getUnlockedSteamAchievementsFromStructuredSave(saveInfo) {
    const unlockedSteamAchievements = [];

    for (let index = 0; index < dd1SteamAchievementIndex.length; index++) {
        const steamId = dd1SteamAchievementIndex[index];
        const value = saveInfo.achievements.achievements[index];

        if (value === 1) {
            unlockedSteamAchievements.push({
                index: index,
                steamId: steamId,
                name: getDd1AchievementName(steamId)
            });
        }
    }

    return unlockedSteamAchievements;
}

/* =========================================================
   11. Save Scanner
========================================================= */

function scanSaveFile(arrayBuffer) {
    const decompression = decompressDunFile(arrayBuffer);
    const combinedBytes = decompression.combinedBytes;

    const structuredSaveInfo = readSaveFileInfoUntilLevelProgress(combinedBytes);
    const unlockedSteamAchievements = getUnlockedSteamAchievementsFromStructuredSave(structuredSaveInfo);

    const unlockedSteamAchievementIds = unlockedSteamAchievements.map((achievementInfo) => {
        return achievementInfo.steamId;
    });

    const unlockedSteamAchievementNames = unlockedSteamAchievements.map((achievementInfo) => {
        return achievementInfo.name;
    });

    const heroes = structuredSaveInfo.heroes.map((hero, index) => {
        return {
            number: index + 1,
            name: hero.heroInfo.heroName || "Unnamed Hero",
            namePosition: null,
            template: hero.heroInfo.heroTemplate || "Unknown Template",
            templatePosition: null,
            level: hero.heroInfo.heroLevel,
            experience: hero.heroInfo.heroExperience,
            equipmentCount: hero.equipments.length,
            previewAscii: "",
            previewHex: ""
        };
    });

    const achievementBytes = structuredSaveInfo.achievements.achievements;

    const saveData = {
        heroes: heroes,

        unlockedSteamAchievements: unlockedSteamAchievements,
        unlockedSteamAchievementIds: unlockedSteamAchievementIds,
        unlockedSteamAchievementNames: unlockedSteamAchievementNames,

        steamAchievementsUnlocked: unlockedSteamAchievements.length,
        totalSteamAchievements: dd1SteamAchievementIndex.length,

        beatenLevels: structuredSaveInfo.beatenLevels,
        unlockedLevels: structuredSaveInfo.unlockedLevels,

        saveAchievementFlagsFound: achievementBytes.filter((value) => {
            return value !== 0;
        }).length,

        maxSaveAchievementFlags: maxAchievements,

        achievementStartPosition: null,
        achievementOriginalStartPosition: null,
        achievementOffsetAdjustment: 0,
        achievementBytes: achievementBytes,
        achievementCounts: {
            zeroCount: achievementBytes.filter((value) => {
                return value === 0;
            }).length,
            oneCount: achievementBytes.filter((value) => {
                return value === 1;
            }).length,
            nonZeroCount: achievementBytes.filter((value) => {
                return value !== 0;
            }).length,
            otherNonZeroCount: achievementBytes.filter((value) => {
                return value !== 0 && value !== 1;
            }).length
        },
        achievementSteamCounts: {
            zeroCount: achievementBytes.slice(0, dd1SteamAchievementIndex.length).filter((value) => {
                return value === 0;
            }).length,
            oneCount: achievementBytes.slice(0, dd1SteamAchievementIndex.length).filter((value) => {
                return value === 1;
            }).length,
            nonZeroCount: achievementBytes.slice(0, dd1SteamAchievementIndex.length).filter((value) => {
                return value !== 0;
            }).length,
            otherNonZeroCount: achievementBytes.slice(0, dd1SteamAchievementIndex.length).filter((value) => {
                return value !== 0 && value !== 1;
            }).length
        },
        achievementPreviewHex: debugBytes(new Uint8Array(achievementBytes), 0, 200),
        achievementPreviewAscii: bytesToAscii(new Uint8Array(achievementBytes), 0, 200),

        structuredReaderPosition: structuredSaveInfo.readerPosition,
        structuredReaderRemainingBytes: structuredSaveInfo.remainingBytes,

        decompression: {
            blocks: decompression.blocks,
            blockCount: decompression.blockCount,
            combinedSize: decompression.combinedSize,
            zlibHeaderOffsets: decompression.zlibHeaderOffsets,
            method: decompression.decompressionMethod || "unknown"
        },

        header: {
            version: structuredSaveInfo.versionNumber,
            saveSize: structuredSaveInfo.size
        }
    };

    return {
        decompression: saveData.decompression,
        header: saveData.header,
        heroes: heroes,
        achievement: {
            start: null,
            originalStart: null,
            offsetAdjustment: 0,
            bytes: achievementBytes,
            counts: saveData.achievementCounts,
            steamCounts: saveData.achievementSteamCounts,
            unlockedSteamAchievements: unlockedSteamAchievements,
            previewHex: saveData.achievementPreviewHex,
            previewAscii: saveData.achievementPreviewAscii
        },
        beatenLevels: structuredSaveInfo.beatenLevels,
        unlockedLevels: structuredSaveInfo.unlockedLevels,
        combinedSize: decompression.combinedSize,
        cleanSaveData: saveData
    };
}


function getDd1SaveData(arrayBuffer) {
    return scanSaveFile(arrayBuffer).cleanSaveData;
}


/* =========================================================
   12. Output Builders and Checklist Helpers
========================================================= */


/* =========================================================
   12A. Output Builders
========================================================= */

function buildBlockRows(blocks) {
    return blocks.map((block) => {
        return `
            <li>
                <strong>Offset:</strong> ${block.offset}
                |
                <strong>End:</strong> ${block.end}
                |
                <strong>Raw Length:</strong> ${block.rawLength.toLocaleString()} bytes
                |
                <strong>Decompressed Size:</strong> ${block.decompressedSize.toLocaleString()} bytes
            </li>
        `;
    }).join("");
}


function buildHeroRows(heroes) {
    return heroes.map((hero) => {
        return `
            <li>
                <strong>Hero ${hero.number}:</strong> ${escapeHtml(hero.name)}
                <br>
                <strong>Template:</strong> ${escapeHtml(hero.template)}
                <br>
                <strong>Level:</strong> ${hero.level ?? "Unknown"}
                |
                <strong>Equipment Count:</strong> ${hero.equipmentCount ?? "Unknown"}
            </li>
        `;
    }).join("");
}


function buildUnlockedAchievementRows(unlockedAchievements) {
    if (!unlockedAchievements || unlockedAchievements.length === 0) {
        return "<li>No Steam achievements detected as unlocked.</li>";
    }

    return unlockedAchievements.map((achievement) => {
        return `
            <li>
                <strong>${achievement.index}:</strong>
                ${escapeHtml(achievement.name)}
                <br>
                <code>${escapeHtml(achievement.steamId)}</code>
            </li>
        `;
    }).join("");
}


/* =========================================================
   12B. Basic Achievement Helpers
========================================================= */

function getRequiredSteamIdsFromCheckbox(checkbox) {
    if (checkbox.dataset.steamAchievement) {
        return [checkbox.dataset.steamAchievement];
    }

    if (checkbox.dataset.steamAchievements) {
        return checkbox.dataset.steamAchievements
            .split(" ")
            .map((steamId) => steamId.trim())
            .filter((steamId) => steamId.length > 0);
    }

    return [];
}


function saveHasAchievement(saveData, steamId) {
    return saveData.unlockedSteamAchievementIds.includes(steamId);
}


function saveHasAnyAchievement(saveData, steamIds) {
    return steamIds.some((steamId) => {
        return saveHasAchievement(saveData, steamId);
    });
}


/* =========================================================
   12C. Checkbox Text Helpers
========================================================= */

function normalizeChecklistText(value) {
    return String(value)
        .toLowerCase()
        .replaceAll("’", "'")
        .replaceAll("'", "")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


function getCheckboxTextContainer(checkbox) {
    return checkbox.closest("li, tr, label, .checklist-item, .checklist-row, div") || checkbox.parentElement;
}


function getCheckboxVisibleText(checkbox) {
    const container = getCheckboxTextContainer(checkbox);

    if (!container) {
        return "";
    }

    return normalizeChecklistText(container.textContent || "");
}


function getAllChecklistCheckboxes(rootElement = document) {
    return Array.from(rootElement.querySelectorAll("input[type='checkbox']"));
}


function checkBoxesByTextRules(rootElement, rules) {
    let checkedCount = 0;
    const checkboxes = getAllChecklistCheckboxes(rootElement);

    checkboxes.forEach((checkbox) => {
        const visibleText = getCheckboxVisibleText(checkbox);

        const matched = rules.some((rule) => {
            const requiredText = normalizeChecklistText(rule.text || "");
            const requiredIncludes = (rule.includes || []).map(normalizeChecklistText);
            const excludedIncludes = (rule.excludes || []).map(normalizeChecklistText);

            if (requiredText && !visibleText.includes(requiredText)) {
                return false;
            }

            const hasAllRequiredIncludes = requiredIncludes.every((required) => {
                return visibleText.includes(required);
            });

            if (!hasAllRequiredIncludes) {
                return false;
            }

            const hasExcludedText = excludedIncludes.some((excluded) => {
                return visibleText.includes(excluded);
            });

            return !hasExcludedText;
        });

        if (matched && !checkbox.checked) {
            checkbox.checked = true;
            checkedCount++;
        }
    });

    return checkedCount;
}


function findCheckboxesByTextRules(rootElement, rules) {
    const checkboxes = getAllChecklistCheckboxes(rootElement);

    return checkboxes.filter((checkbox) => {
        const visibleText = getCheckboxVisibleText(checkbox);

        return rules.some((rule) => {
            const requiredText = normalizeChecklistText(rule.text || "");
            const requiredIncludes = (rule.includes || []).map(normalizeChecklistText);
            const excludedIncludes = (rule.excludes || []).map(normalizeChecklistText);

            if (requiredText && !visibleText.includes(requiredText)) {
                return false;
            }

            const hasAllRequiredIncludes = requiredIncludes.every((required) => {
                return visibleText.includes(required);
            });

            if (!hasAllRequiredIncludes) {
                return false;
            }

            const hasExcludedText = excludedIncludes.some((excluded) => {
                return visibleText.includes(excluded);
            });

            return !hasExcludedText;
        });
    });
}


function areAllRequiredRuleGroupsChecked(rootElement, ruleGroups) {
    return ruleGroups.every((rules) => {
        const matches = findCheckboxesByTextRules(rootElement, rules);

        if (matches.length === 0) {
            return false;
        }

        return matches.some((checkbox) => checkbox.checked);
    });
}


/* =========================================================
   12D. Section-Based Checkbox Helpers
========================================================= */

function getHeadingLevel(element) {
    if (!element || !element.tagName) {
        return 99;
    }

    const match = element.tagName.match(/^H([1-6])$/i);

    if (!match) {
        return 99;
    }

    return Number(match[1]);
}


function getSectionCheckboxesByHeading(rootElement, headingIncludes) {
    const normalizedIncludes = headingIncludes.map(normalizeChecklistText);
    const headings = Array.from(rootElement.querySelectorAll("h1, h2, h3, h4, h5, h6"));

    const startHeading = headings.find((heading) => {
        const headingText = normalizeChecklistText(heading.textContent || "");

        return normalizedIncludes.every((includeText) => {
            return headingText.includes(includeText);
        });
    });

    if (!startHeading) {
        return [];
    }

    const startLevel = getHeadingLevel(startHeading);
    const nextHeading = headings.find((heading) => {
        if (heading === startHeading) {
            return false;
        }

        const isAfterStart = Boolean(
            startHeading.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING
        );

        return isAfterStart && getHeadingLevel(heading) <= startLevel;
    });

    return getAllChecklistCheckboxes(rootElement).filter((checkbox) => {
        const isAfterStart = Boolean(
            startHeading.compareDocumentPosition(checkbox) & Node.DOCUMENT_POSITION_FOLLOWING
        );

        if (!isAfterStart) {
            return false;
        }

        if (!nextHeading) {
            return true;
        }

        return Boolean(
            checkbox.compareDocumentPosition(nextHeading) & Node.DOCUMENT_POSITION_FOLLOWING
        );
    });
}


function checkBoxesInSectionByTextRules(rootElement, headingIncludes, rules) {
    let checkedCount = 0;
    const checkboxes = getSectionCheckboxesByHeading(rootElement, headingIncludes);

    checkboxes.forEach((checkbox) => {
        const visibleText = getCheckboxVisibleText(checkbox);

        const matched = rules.some((rule) => {
            const requiredText = normalizeChecklistText(rule.text || "");
            const requiredIncludes = (rule.includes || []).map(normalizeChecklistText);
            const excludedIncludes = (rule.excludes || []).map(normalizeChecklistText);

            if (requiredText && !visibleText.includes(requiredText)) {
                return false;
            }

            const hasAllRequiredIncludes = requiredIncludes.every((required) => {
                return visibleText.includes(required);
            });

            if (!hasAllRequiredIncludes) {
                return false;
            }

            const hasExcludedText = excludedIncludes.some((excluded) => {
                return visibleText.includes(excluded);
            });

            return !hasExcludedText;
        });

        if (matched && !checkbox.checked) {
            checkbox.checked = true;
            checkedCount++;
        }
    });

    return checkedCount;
}


/* =========================================================
   12E. Save Progress / Difficulty Helpers
========================================================= */

function getBeatenLevelMap(saveData) {
    const beatenMap = new Map();

    if (!saveData.beatenLevels) {
        return beatenMap;
    }

    saveData.beatenLevels.forEach((levelInfo) => {
        if (!levelInfo || !levelInfo.campaignTag) {
            return;
        }

        beatenMap.set(levelInfo.campaignTag, levelInfo.difficultyMask);
    });

    return beatenMap;
}


function levelMaskHasDifficulty(difficultyMask, difficultyBit) {
    return (difficultyMask & difficultyBit) !== 0;
}


function levelMaskHasNightmare(difficultyMask) {
    return levelMaskHasDifficulty(difficultyMask, 16);
}


function levelMaskHasRuthless(difficultyMask) {
    return levelMaskHasDifficulty(difficultyMask, 2048) || difficultyMask === 4095;
}


function saveHasBeatenTag(saveData, campaignTag) {
    const beatenMap = getBeatenLevelMap(saveData);
    return beatenMap.has(campaignTag);
}


function saveHasAnyBeatenTag(saveData, campaignTags) {
    return campaignTags.some((campaignTag) => {
        return saveHasBeatenTag(saveData, campaignTag);
    });
}


function saveHasBeatenTagOnNightmare(saveData, campaignTag) {
    const beatenMap = getBeatenLevelMap(saveData);

    if (!beatenMap.has(campaignTag)) {
        return false;
    }

    return levelMaskHasNightmare(beatenMap.get(campaignTag));
}


function saveHasAnyBeatenTagOnNightmare(saveData, campaignTags) {
    return campaignTags.some((campaignTag) => {
        return saveHasBeatenTagOnNightmare(saveData, campaignTag);
    });
}


function saveHasBeatenTagOnRuthless(saveData, campaignTag) {
    const beatenMap = getBeatenLevelMap(saveData);

    if (!beatenMap.has(campaignTag)) {
        return false;
    }

    return levelMaskHasRuthless(beatenMap.get(campaignTag));
}


function saveHasAnyBeatenTagOnRuthless(saveData, campaignTags) {
    return campaignTags.some((campaignTag) => {
        return saveHasBeatenTagOnRuthless(saveData, campaignTag);
    });
}


/* =========================================================
   12F. Hero / Class Helpers
========================================================= */

function getHeroClassFromTemplate(template) {
    if (!template) {
        return null;
    }

    const normalizedTemplate = String(template).toLowerCase();

    for (const rule of dd1HeroClassRules) {
        const matched = rule.templateIncludes.some((templatePart) => {
            return normalizedTemplate.includes(templatePart.toLowerCase());
        });

        if (matched) {
            return rule.className;
        }
    }

    return null;
}


function getOriginalLevel70HeroClasses(saveData) {
    const classes = new Set();

    if (!saveData.heroes) {
        return classes;
    }

    saveData.heroes.forEach((hero) => {
        const heroClass = getHeroClassFromTemplate(hero.template);

        if (!heroClass) {
            return;
        }

        if (hero.level >= 70) {
            classes.add(heroClass);
        }
    });

    return classes;
}


function applyGroupHugChecklistProgress(saveData, rootElement = document) {
    let checkedCount = 0;
    const level70Classes = getOriginalLevel70HeroClasses(saveData);

    const originalHeroRows = [
        {
            className: "Apprentice",
            possibleTexts: [
                "Apprentice Level 70",
                "Apprentice Reach level 70",
                "Apprentice Raise to level 70",
                "Apprentice Raise one to level 70"
            ]
        },
        {
            className: "Squire",
            possibleTexts: [
                "Squire Level 70",
                "Squire Reach level 70",
                "Squire Raise to level 70",
                "Squire Raise one to level 70"
            ]
        },
        {
            className: "Huntress",
            possibleTexts: [
                "Huntress Level 70",
                "Huntress Reach level 70",
                "Huntress Raise to level 70",
                "Huntress Raise one to level 70"
            ]
        },
        {
            className: "Monk",
            possibleTexts: [
                "Monk Level 70",
                "Monk Reach level 70",
                "Monk Raise to level 70",
                "Monk Raise one to level 70"
            ]
        }
    ];

    originalHeroRows.forEach((row) => {
        if (!level70Classes.has(row.className)) {
            return;
        }

        checkedCount += checkBoxesByTextRules(rootElement, row.possibleTexts.map((text) => {
            return {
                text: text,
                excludes: [
                    "defeat the summit",
                    "player one",
                    "a matter of perspective"
                ]
            };
        }));

        checkedCount += checkBoxesByTextRules(rootElement, [
            {
                includes: [
                    row.className,
                    "level 70"
                ],
                excludes: [
                    "defeat the summit",
                    "player one",
                    "a matter of perspective"
                ]
            },
            {
                includes: [
                    row.className,
                    "raise",
                    "70"
                ],
                excludes: [
                    "defeat the summit",
                    "player one",
                    "a matter of perspective"
                ]
            }
        ]);
    });

    return checkedCount;
}


/* =========================================================
   12G. Achievement-Based Subcheck Logic
========================================================= */

function applyPerspectiveChecklistProgress(saveData, rootElement = document) {
    if (!saveHasAchievement(saveData, "ACH_PERSPECTIVE")) {
        return 0;
    }

    return checkBoxesInSectionByTextRules(rootElement, ["a matter of perspective"], [
        { includes: ["apprentice", "defeat the summit"] },
        { includes: ["monk", "defeat the summit"] },
        { includes: ["huntress", "defeat the summit"] },
        { includes: ["squire", "defeat the summit"] }
    ]);
}


function applyDefenseBestOffenseChecklistProgress(saveData, rootElement = document) {
    if (!saveHasAchievement(saveData, "ACH_OFFENSE")) {
        return 0;
    }

    const originalCampaignMaps = [
        "The Deeper Well",
        "Foundries and Forges",
        "Magus Quarters",
        "Alchemical Laboratory",
        "Servants Quarters",
        "Castle Armory",
        "Hall of Court",
        "The Throne Room",
        "Royal Gardens",
        "The Ramparts",
        "Endless Spires",
        "The Summit",
        "Glitterhelm Caverns"
    ];

    return checkBoxesInSectionByTextRules(
        rootElement,
        ["defense is the best offense"],
        originalCampaignMaps.map((mapName) => {
            return { text: mapName };
        })
    );
}


function applyPetChecklistProgress(saveData, rootElement = document) {
    let checkedCount = 0;

    const petRows = [
        "The Deeper Well",
        "Foundries and Forges",
        "Omenak",
        "Magus Quarters",
        "Infested Ruins",
        "Alchemical Laboratory",
        "The Throne Room",
        "Servants Quarters",
        "Glitterhelm Caverns",
        "Lover's Paradise",
        "Castle Armory",
        "Hall of Court",
        "Tavern Defense",
        "Coastal Bazaar",
        "Royal Gardens",
        "Temple of Water",
        "The Striking Tree",
        "The Ramparts",
        "Endless Spires",
        "Emerald City",
        "The Summit",
        "Magus Citadel",
        "Palantir",
        "Mistymire Forest",
        "Crystalline Resurgence Part 1",
        "Moraggo Desert Town",
        "Crystalline Resurgence Part 2",
        "Aquanos",
        "Sky City",
        "City in the Cliffs",
        "Karathiki Jungle",
        "Akatiti Jungle",
        "Sky O' Love",
        "Assault Pack Parts 1-3",
        "Talay Mining Complex",
        "Presidential Battle Royale"
    ];

    if (saveHasAchievement(saveData, "ACH_CATCH") || saveHasAchievement(saveData, "ACH_MONSTERS")) {
        checkedCount += checkBoxesInSectionByTextRules(
            rootElement,
            ["pet achievement goals"],
            petRows.map((rowText) => {
                return { text: rowText };
            })
        );
    }

    return checkedCount;
}


function applyRtsChecklistProgress(saveData, rootElement = document) {
    if (!saveHasAnyAchievement(saveData, ["ACH_RTS", "ACH_RTS_MYTHICAL"])) {
        return 0;
    }

    const rtsRows = [
        "The Deeper Well through The Summit",
        "Glitterhelm Caverns",
        "Mistymire Forest",
        "Moraggo Desert Town",
        "Aquanos",
        "City in the Cliffs"
    ];

    return checkBoxesInSectionByTextRules(
        rootElement,
        ["real time strategist"],
        rtsRows.map((rowText) => {
            return { text: rowText };
        })
    );
}


/* =========================================================
   12H. Beaten-Level Map Matching
========================================================= */

function applyBeatenLevelChecklistProgress(saveData, rootElement = document) {
    let checkedCount = 0;

    const campaignRows = [
        { tags: ["CAMPDW"], text: "The Deeper Well" },
        { tags: ["CAMPFF"], text: "Foundries and Forges" },
        { tags: ["CAMPMQ"], text: "Magus Quarters" },
        { tags: ["CAMPAL"], text: "Alchemical Laboratory" },
        { tags: ["CAMPSQ"], text: "Servants Quarters" },
        { tags: ["CAMPCA"], text: "Castle Armory" },
        { tags: ["CAMPHC"], text: "Hall of Court" },
        { tags: ["CAMPTR"], text: "The Throne Room" },
        { tags: ["CAMPRG"], text: "Royal Gardens" },
        { tags: ["CAMPRP"], text: "The Ramparts" },
        { tags: ["CAMPES"], text: "Endless Spires" },
        { tags: ["CAMPTS"], text: "The Summit" },
        { tags: ["CAMPGC"], text: "Glitterhelm Caverns" }
    ];

    const shardsAndCampaignRows = [
        { tags: ["CAMPAR", "RETMIS"], text: "Mistymire Forest" },
        { tags: ["CAMPMB", "RETMOR"], text: "Moraggo Desert Town" },
        { tags: ["CAMPAQ", "RETAQU"], text: "Aquanos" },
        { tags: ["CAMPSC", "RETSKY"], text: "Sky City" },
        { tags: ["CAMPCL", "RETCRD"], text: "Crystalline Dimension" }
    ];

    const lostQuestNightmareRows = [
        { tags: ["CDTCDD"], text: "Dread Dungeon" },
        { tags: ["CDTARC"], text: "Arcane Library" },
        { tags: ["CDTTWA"], text: "Buccaneer Bay" },
        { tags: ["SPECHI"], text: "Pirate Invasion" },
        { tags: ["CDTTWC", "CDTCBB", "CDTCOB"], text: "Coastal Bazaar" },
        { tags: ["CDTARA", "CDTEMV"], text: "Embermount Volcano" },
        { tags: ["CDTFOR", "LIFHOL"], text: "Flames of Rebirth" },
        { tags: ["CDTTOW"], text: "Temple of Water" },
        { tags: ["CDTTOP"], text: "Temple of Polybius" },
        { tags: ["CDTVAL"], text: "Spring Valley" },
        { tags: ["CDTTOE", "CDTTOP"], text: "Tomb of Etheria" },
        { tags: ["CDTEME"], text: "Emerald City" },
        { tags: ["ACH_CR_NIGHTMARE_FAKE_TAG"], text: "Crystalline Resurgence Part 1" },
        { tags: ["ACH_CR_NIGHTMARE_FAKE_TAG"], text: "Crystalline Resurgence Part 2" },
        { tags: ["ACH_CR_NIGHTMARE_FAKE_TAG"], text: "Crystalline Resurgence Part 3" },
        { tags: ["ACH_CR_NIGHTMARE_FAKE_TAG"], text: "Crystalline Resurgence Part 4" },
        { tags: ["CDTWIM"], text: "Wintermire" },
        { tags: ["MAGUSV"], text: "Magus Citadel" },
        { tags: ["CDTOMN"], text: "Omenak" },
        { tags: ["CDTINF"], text: "Infested Ruins" }
    ];

    const challengeRows = [
        { tags: ["SPECDW"], text: "No Towers Allowed" },
        { tags: ["SPECFF"], text: "Unlikely Allies" },
        { tags: ["SPECMQ"], text: "Warping Core" },
        { tags: ["SPECAL"], text: "Raining Goblins" },
        { tags: ["SPECSQ"], text: "Wizardry" },
        { tags: ["SPECCA"], text: "Ogre Crush" },
        { tags: ["SPECHC"], text: "Zippy Terror" },
        { tags: ["SPECTR"], text: "Chicken" },
        { tags: ["SPECRG"], text: "Moving Core" },
        { tags: ["SPECRP"], text: "Death From Above" },
        { tags: ["SPECES"], text: "Assault" },
        { tags: ["SPECTS"], text: "Treasure Hunt" },
        { tags: ["CAMPMF", "SPECMF"], text: "Monster Fest" }
    ];

    const extraCleanupRows = [
        { tags: ["CDTSBB"], text: "Spooktacular Bay" },
        { tags: ["CAMPST", "TBRUOO"], text: "The Striking Tree" },
        { tags: ["CAMPTD"], text: "Tavern Defense" },
        { tags: ["VDAY04"], text: "Lover's Paradise" },
        { tags: ["SPECJC"], text: "Crystal Escort" },
        { tags: ["LHOLOC"], text: "Lifestream Hollow" },
        { tags: ["CDHUNT"], text: "Forest Ogre Crush" }
    ];

    campaignRows.forEach((row) => {
        if (!saveHasAnyBeatenTag(saveData, row.tags)) {
            return;
        }

        checkedCount += checkBoxesByTextRules(rootElement, [
            {
                includes: [
                    row.text,
                    "complete required campaign clears"
                ],
                excludes: [
                    "griffon",
                    "giraffe",
                    "steam robot",
                    "serpent",
                    "laser robot",
                    "hamster",
                    "tiger",
                    "genie",
                    "fairy",
                    "hawk",
                    "imp",
                    "guardian",
                    "guardians",
                    "animus",
                    "shroomite",
                    "seahorse",
                    "propeller cat",
                    "rainbow unicorn",
                    "defeat the summit as player one",
                    "apprentice",
                    "monk",
                    "huntress",
                    "squire",
                    "survival",
                    "pure strategy",
                    "ruthless"
                ]
            }
        ]);
    });

    shardsAndCampaignRows.forEach((row) => {
        if (!saveHasAnyBeatenTag(saveData, row.tags)) {
            return;
        }

        checkedCount += checkBoxesByTextRules(rootElement, [
            {
                includes: [
                    row.text,
                    "complete shard"
                ]
            }
        ]);
    });

    lostQuestNightmareRows.forEach((row) => {
        if (!saveHasAnyBeatenTagOnNightmare(saveData, row.tags)) {
            return;
        }

        if (row.text === "Pirate Invasion") {
            checkedCount += checkBoxesByTextRules(rootElement, [
                {
                    includes: [
                        row.text,
                        "wave 7",
                        "nightmare"
                    ]
                }
            ]);
            return;
        }

        checkedCount += checkBoxesByTextRules(rootElement, [
            {
                includes: [
                    row.text,
                    "complete on nightmare"
                ]
            }
        ]);
    });

    challengeRows.forEach((row) => {
        if (!saveHasAnyBeatenTag(saveData, row.tags)) {
            return;
        }

        checkedCount += checkBoxesByTextRules(rootElement, [
            {
                includes: [
                    row.text,
                    "complete challenge progress"
                ],
                excludes: [
                    "ruthless"
                ]
            }
        ]);
    });

    extraCleanupRows.forEach((row) => {
        if (!saveHasAnyBeatenTagOnNightmare(saveData, row.tags)) {
            return;
        }

        checkedCount += checkBoxesByTextRules(rootElement, [
            {
                includes: [row.text]
            }
        ]);
    });

    return checkedCount;
}


/* =========================================================
   12I. Ruthless Matching
========================================================= */

function applyRuthlessChecklistProgress(saveData, rootElement = document) {
    let checkedCount = 0;

    const ruthlessCampaignRows = [
        { tags: ["CAMPDW"], text: "The Deeper Well" },
        { tags: ["CAMPFF"], text: "Foundries and Forges" },
        { tags: ["CAMPMQ"], text: "Magus Quarters" },
        { tags: ["CAMPAL"], text: "Alchemical Laboratory" },
        { tags: ["CAMPSQ"], text: "Servants Quarters" },
        { tags: ["CAMPCA"], text: "Castle Armory" },
        { tags: ["CAMPHC"], text: "Hall of Court" },
        { tags: ["CAMPTR"], text: "The Throne Room" },
        { tags: ["CAMPRG"], text: "Royal Gardens" },
        { tags: ["CAMPRP"], text: "The Ramparts" },
        { tags: ["CAMPES"], text: "Endless Spires" },
        { tags: ["CAMPTS"], text: "The Summit" },
        { tags: ["CAMPGC"], text: "Glitterhelm Caverns" }
    ];

    const ruthlessChallengeRows = [
        { tags: ["SPECDW"], text: "No Towers Allowed" },
        { tags: ["SPECFF"], text: "Unlikely Allies" },
        { tags: ["SPECMQ"], text: "Warping Core" },
        { tags: ["SPECAL"], text: "Raining Goblins" },
        { tags: ["SPECSQ"], text: "Wizardry" },
        { tags: ["SPECCA"], text: "Ogre Crush" },
        { tags: ["SPECHC"], text: "Zippy Terror" },
        { tags: ["SPECTR"], text: "Chicken" },
        { tags: ["SPECRG"], text: "Moving Core" },
        { tags: ["SPECRP"], text: "Death From Above" },
        { tags: ["SPECES"], text: "Assault" },
        { tags: ["SPECTS"], text: "Treasure Hunt" },
        { tags: ["CAMPMF", "SPECMF"], text: "Monster Fest" }
    ];

    ruthlessCampaignRows.forEach((row) => {
        if (!saveHasAnyBeatenTagOnRuthless(saveData, row.tags)) {
            return;
        }

        checkedCount += checkBoxesByTextRules(rootElement, [
            {
                includes: [
                    row.text,
                    "ruthless"
                ],
                excludes: [
                    "nightmare",
                    "survival",
                    "pure strategy",
                    "pet",
                    "complete required campaign clears"
                ]
            }
        ]);
    });

    ruthlessChallengeRows.forEach((row) => {
        if (!saveHasAnyBeatenTagOnRuthless(saveData, row.tags)) {
            return;
        }

        checkedCount += checkBoxesByTextRules(rootElement, [
            {
                includes: [
                    row.text,
                    "ruthless"
                ],
                excludes: [
                    "nightmare",
                    "survival",
                    "pure strategy"
                ]
            }
        ]);
    });

    return checkedCount;
}


/* =========================================================
   12J. Achievement-Based Main Logic
========================================================= */

function applyAchievementBasedChecklistInferences(saveData, rootElement = document) {
    let checkedCount = 0;

    if (saveHasAchievement(saveData, "ACH_HUG")) {
        checkedCount += applyGroupHugChecklistProgress(saveData, rootElement);
    }

    checkedCount += applyPerspectiveChecklistProgress(saveData, rootElement);
    checkedCount += applyDefenseBestOffenseChecklistProgress(saveData, rootElement);
    checkedCount += applyPetChecklistProgress(saveData, rootElement);
    checkedCount += applyRtsChecklistProgress(saveData, rootElement);

    if (
        saveHasAnyAchievement(saveData, [
            "ACH_TRANSCENDENT_SURVIVALIST",
            "ACH_ULTIMATE_DEFENDER"
        ])
    ) {
        checkedCount += checkBoxesByTextRules(rootElement, [
            { includes: ["nightmare survival victory"] }
        ]);
    }

    if (
        saveHasAnyAchievement(saveData, [
            "ACH_ETERNIASHARDS_PART1_ANY",
            "ACH_ETERNIASHARDS_PART1_NIGHTMARE"
        ])
    ) {
        checkedCount += checkBoxesByTextRules(rootElement, [
            { includes: ["mistymire forest", "complete shard"] }
        ]);
    }

    if (
        saveHasAnyAchievement(saveData, [
            "ACH_ETERNIASHARDS_PART2_ANY",
            "ACH_ETERNIASHARDS_PART2_NIGHTMARE"
        ])
    ) {
        checkedCount += checkBoxesByTextRules(rootElement, [
            { includes: ["moraggo desert town", "complete shard"] }
        ]);
    }

    if (
        saveHasAnyAchievement(saveData, [
            "ACH_ETERNIASHARDS_PART3_ANY",
            "ACH_ETERNIASHARDS_PART3_NIGHTMARE"
        ])
    ) {
        checkedCount += checkBoxesByTextRules(rootElement, [
            { includes: ["aquanos", "complete shard"] }
        ]);
    }

    if (
        saveHasAnyAchievement(saveData, [
            "ACH_ETERNIASHARDS_PART4_ANY",
            "ACH_ETERNIASHARDS_PART4_NIGHTMARE"
        ])
    ) {
        checkedCount += checkBoxesByTextRules(rootElement, [
            { includes: ["sky city", "complete shard"] }
        ]);
    }

    if (
        saveHasAnyAchievement(saveData, [
            "ACH_HEROES",
            "ACH_HEROES_NIGHTMARE"
        ])
    ) {
        checkedCount += checkBoxesByTextRules(rootElement, [
            { includes: ["crystalline dimension", "complete heroes"] }
        ]);
    }

    const extraAchievementRows = [
        {
            text: "Boss Rush",
            achievements: ["ACH_BOSS_CRUSHER", "ACH_BOSS_CRUSHER_NIGHTMARE"]
        },
        {
            text: "Anti Cupid",
            achievements: ["ACH_VDAY_2013", "ACH_VDAY_2013_NIGHTMARE"]
        },
        {
            text: "Halloween Spooktacular 2",
            achievements: ["ACH_PUMPKIN_PARTY", "ACH_PUMPKINPARTY_NIGHTMARE"]
        },
        {
            text: "Greater Turkey Hunt",
            achievements: ["ACH_GREATER_TURKEYHUNTER", "ACH_GREATER_TURKEYHUNTER_NIGHTMARE"]
        },
        {
            text: "Silent Night",
            achievements: ["ACH_SILENT_NIGHT", "ACH_SILENT_NIGHT_NIGHTMARE"]
        },
        {
            text: "Anniversary Pack",
            achievements: ["ACH_ANNIVERSARY", "ACH_ANNIVERSARY_NIGHTMARE"]
        },
        {
            text: "Winter Wonderland",
            achievements: ["ACH_WINTER_WONDERLAND", "ACH_WINTER_WONDERLAND_NIGHTMARE"]
        },
        {
            text: "Tinkerers Lab",
            achievements: [
                "ACH_LAB",
                "ACH_LAB_NIGHTMARE",
                "ACH_LABASSAULT",
                "ACH_LABASSAULT_NIGHTMARE"
            ]
        },
        {
            text: "Moonbase",
            achievements: ["ACH_MOONBASE", "ACH_MOONBASE_NIGHTMARE"]
        },
        {
            text: "Spooktacular Bay",
            achievements: ["ACH_PUMPKIN_PARTY", "ACH_PUMPKINPARTY_NIGHTMARE"]
        },
        {
            text: "Crystalline Resurgence Part 1",
            achievements: ["ACH_CR_NIGHTMARE"]
        },
        {
            text: "Crystalline Resurgence Part 2",
            achievements: ["ACH_CR_NIGHTMARE"]
        },
        {
            text: "Crystalline Resurgence Part 3",
            achievements: ["ACH_CR_NIGHTMARE"]
        },
        {
            text: "Crystalline Resurgence Part 4",
            achievements: ["ACH_CR_NIGHTMARE"]
        }
    ];

    extraAchievementRows.forEach((row) => {
        if (!saveHasAnyAchievement(saveData, row.achievements)) {
            return;
        }

        if (row.text.startsWith("Crystalline Resurgence Part")) {
            checkedCount += checkBoxesByTextRules(rootElement, [
                {
                    includes: [
                        row.text,
                        "complete on nightmare"
                    ]
                }
            ]);
            return;
        }

        checkedCount += checkBoxesByTextRules(rootElement, [
            { text: row.text }
        ]);
    });

    return checkedCount;
}


/* =========================================================
   12K. Master Checkbox Logic
========================================================= */

function checkFirstMatchingUncheckedBox(rootElement, rules) {
    const matches = findCheckboxesByTextRules(rootElement, rules);

    if (matches.length === 0) {
        return 0;
    }

    const uncheckedMatch = matches.find((checkbox) => {
        return !checkbox.checked;
    });

    if (!uncheckedMatch) {
        return 0;
    }

    uncheckedMatch.checked = true;
    return 1;
}


function applyMasterChecklistProgress(saveData, rootElement = document) {
    let checkedCount = 0;

    const masterRules = [
        {
            required: [
                [{ includes: ["apprentice", "defeat the summit"] }],
                [{ includes: ["monk", "defeat the summit"] }],
                [{ includes: ["huntress", "defeat the summit"] }],
                [{ includes: ["squire", "defeat the summit"] }]
            ],
            master: [{ includes: ["a matter of perspective", "defeat the summit with each original hero"] }]
        },
        {
            required: [
                [{ includes: ["the deeper well"] }],
                [{ includes: ["foundries and forges"] }],
                [{ includes: ["magus quarters"] }],
                [{ includes: ["alchemical laboratory"] }],
                [{ includes: ["servants quarters"] }],
                [{ includes: ["castle armory"] }],
                [{ includes: ["hall of court"] }],
                [{ includes: ["the throne room"] }],
                [{ includes: ["royal gardens"] }],
                [{ includes: ["the ramparts"] }],
                [{ includes: ["endless spires"] }],
                [{ includes: ["the summit"] }],
                [{ includes: ["glitterhelm caverns"] }]
            ],
            master: [{ includes: ["defense is the best offense", "wave 10"] }]
        },
        {
            required: [
                [{ includes: ["mistymire forest", "complete shard"] }],
                [{ includes: ["moraggo desert town", "complete shard"] }],
                [{ includes: ["aquanos", "complete shard"] }],
                [{ includes: ["sky city", "complete shard"] }],
                [{ includes: ["crystalline dimension", "complete heroes"] }]
            ],
            master: [{ includes: ["quest for lost eternia shards", "complete the main shards"] }]
        },
        {
            required: [
                [{ includes: ["the deeper well through the summit"] }],
                [{ includes: ["glitterhelm caverns"] }],
                [{ includes: ["mistymire forest"] }],
                [{ includes: ["moraggo desert town"] }],
                [{ includes: ["aquanos"] }],
                [{ includes: ["city in the cliffs"] }]
            ],
            master: [{ includes: ["real time strategist", "complete the required maps"] }]
        }
    ];

    masterRules.forEach((group) => {
        if (!areAllRequiredRuleGroupsChecked(rootElement, group.required)) {
            return;
        }

        checkedCount += checkFirstMatchingUncheckedBox(rootElement, group.master);
    });

    const eternalDefenderRequiredRowGroups = [
        [{ includes: ["dread dungeon", "complete on nightmare"] }],
        [{ includes: ["arcane library", "complete on nightmare"] }],
        [{ includes: ["buccaneer bay", "complete on nightmare"] }],
        [{ includes: ["pirate invasion", "wave 7", "nightmare"] }],
        [{ includes: ["coastal bazaar", "complete on nightmare"] }],
        [{ includes: ["embermount volcano", "complete on nightmare"] }],
        [{ includes: ["flames of rebirth", "complete on nightmare"] }],
        [{ includes: ["temple of water", "complete on nightmare"] }],
        [{ includes: ["temple of polybius", "complete on nightmare"] }],
        [{ includes: ["spring valley", "complete on nightmare"] }],
        [{ includes: ["tomb of etheria", "complete on nightmare"] }],
        [{ includes: ["emerald city", "complete on nightmare"] }],
        [{ includes: ["crystalline resurgence part 1", "complete on nightmare"] }],
        [{ includes: ["crystalline resurgence part 2", "complete on nightmare"] }],
        [{ includes: ["crystalline resurgence part 3", "complete on nightmare"] }],
        [{ includes: ["crystalline resurgence part 4", "complete on nightmare"] }],
        [{ includes: ["wintermire", "complete on nightmare"] }],
        [{ includes: ["magus citadel", "complete on nightmare"] }],
        [{ includes: ["omenak", "complete on nightmare"] }],
        [{ includes: ["infested ruins", "complete on nightmare"] }]
    ];

    const ruthlessRequiredRowGroups = [
        [{ includes: ["the deeper well", "ruthless"] }],
        [{ includes: ["foundries and forges", "ruthless"] }],
        [{ includes: ["magus quarters", "ruthless"] }],
        [{ includes: ["alchemical laboratory", "ruthless"] }],
        [{ includes: ["servants quarters", "ruthless"] }],
        [{ includes: ["castle armory", "ruthless"] }],
        [{ includes: ["hall of court", "ruthless"] }],
        [{ includes: ["the throne room", "ruthless"] }],
        [{ includes: ["royal gardens", "ruthless"] }],
        [{ includes: ["the ramparts", "ruthless"] }],
        [{ includes: ["endless spires", "ruthless"] }],
        [{ includes: ["the summit", "ruthless"] }],
        [{ includes: ["glitterhelm caverns", "ruthless"] }],
        [{ includes: ["no towers allowed", "ruthless"] }],
        [{ includes: ["unlikely allies", "ruthless"] }],
        [{ includes: ["warping core", "ruthless"] }],
        [{ includes: ["raining goblins", "ruthless"] }],
        [{ includes: ["wizardry", "ruthless"] }],
        [{ includes: ["ogre crush", "ruthless"] }],
        [{ includes: ["zippy terror", "ruthless"] }],
        [{ includes: ["chicken", "ruthless"] }],
        [{ includes: ["moving core", "ruthless"] }],
        [{ includes: ["death from above", "ruthless"] }],
        [{ includes: ["assault", "ruthless"] }],
        [{ includes: ["treasure hunt", "ruthless"] }],
        [{ includes: ["monster fest", "ruthless"] }]
    ];

    if (areAllRequiredRuleGroupsChecked(rootElement, eternalDefenderRequiredRowGroups)) {
        checkedCount += checkFirstMatchingUncheckedBox(rootElement, [
            {
                includes: [
                    "eternal defender",
                    "complete all required lost quest maps on nightmare"
                ]
            }
        ]);

        checkedCount += checkFirstMatchingUncheckedBox(rootElement, [
            {
                includes: [
                    "eternal defender",
                    "after ultimate defender",
                    "complete the required lost quest maps"
                ]
            }
        ]);
    }

    if (areAllRequiredRuleGroupsChecked(rootElement, ruthlessRequiredRowGroups)) {
        checkedCount += checkFirstMatchingUncheckedBox(rootElement, [
            {
                includes: [
                    "ruthless defender",
                    "complete classic campaign and classic challenges on ruthless"
                ]
            }
        ]);

        checkedCount += checkFirstMatchingUncheckedBox(rootElement, [
            {
                includes: [
                    "ruthless defender",
                    "complete the classic campaign"
                ]
            }
        ]);
    }

    return checkedCount;
}


/* =========================================================
   12L. Debug Builder and Final Apply Function
========================================================= */

function buildSaveImportDebug(saveData, rootElement = document) {
    const eternalDefenderRequiredRowGroups = [
        { name: "Dread Dungeon", rules: [{ includes: ["dread dungeon", "complete on nightmare"] }] },
        { name: "Arcane Library", rules: [{ includes: ["arcane library", "complete on nightmare"] }] },
        { name: "Buccaneer Bay", rules: [{ includes: ["buccaneer bay", "complete on nightmare"] }] },
        { name: "Pirate Invasion", rules: [{ includes: ["pirate invasion", "wave 7", "nightmare"] }] },
        { name: "Coastal Bazaar", rules: [{ includes: ["coastal bazaar", "complete on nightmare"] }] },
        { name: "Embermount Volcano", rules: [{ includes: ["embermount volcano", "complete on nightmare"] }] },
        { name: "Flames of Rebirth", rules: [{ includes: ["flames of rebirth", "complete on nightmare"] }] },
        { name: "Temple of Water", rules: [{ includes: ["temple of water", "complete on nightmare"] }] },
        { name: "Temple of Polybius", rules: [{ includes: ["temple of polybius", "complete on nightmare"] }] },
        { name: "Spring Valley", rules: [{ includes: ["spring valley", "complete on nightmare"] }] },
        { name: "Tomb of Etheria", rules: [{ includes: ["tomb of etheria", "complete on nightmare"] }] },
        { name: "Emerald City", rules: [{ includes: ["emerald city", "complete on nightmare"] }] },
        { name: "Crystalline Resurgence Part 1", rules: [{ includes: ["crystalline resurgence part 1", "complete on nightmare"] }] },
        { name: "Crystalline Resurgence Part 2", rules: [{ includes: ["crystalline resurgence part 2", "complete on nightmare"] }] },
        { name: "Crystalline Resurgence Part 3", rules: [{ includes: ["crystalline resurgence part 3", "complete on nightmare"] }] },
        { name: "Crystalline Resurgence Part 4", rules: [{ includes: ["crystalline resurgence part 4", "complete on nightmare"] }] },
        { name: "Wintermire", rules: [{ includes: ["wintermire", "complete on nightmare"] }] },
        { name: "Magus Citadel", rules: [{ includes: ["magus citadel", "complete on nightmare"] }] },
        { name: "Omenak", rules: [{ includes: ["omenak", "complete on nightmare"] }] },
        { name: "Infested Ruins", rules: [{ includes: ["infested ruins", "complete on nightmare"] }] }
    ];

    const ruthlessRequiredRowGroups = [
        { name: "The Deeper Well", rules: [{ includes: ["the deeper well", "ruthless"] }] },
        { name: "Foundries and Forges", rules: [{ includes: ["foundries and forges", "ruthless"] }] },
        { name: "Magus Quarters", rules: [{ includes: ["magus quarters", "ruthless"] }] },
        { name: "Alchemical Laboratory", rules: [{ includes: ["alchemical laboratory", "ruthless"] }] },
        { name: "Servants Quarters", rules: [{ includes: ["servants quarters", "ruthless"] }] },
        { name: "Castle Armory", rules: [{ includes: ["castle armory", "ruthless"] }] },
        { name: "Hall of Court", rules: [{ includes: ["hall of court", "ruthless"] }] },
        { name: "The Throne Room", rules: [{ includes: ["the throne room", "ruthless"] }] },
        { name: "Royal Gardens", rules: [{ includes: ["royal gardens", "ruthless"] }] },
        { name: "The Ramparts", rules: [{ includes: ["the ramparts", "ruthless"] }] },
        { name: "Endless Spires", rules: [{ includes: ["endless spires", "ruthless"] }] },
        { name: "The Summit", rules: [{ includes: ["the summit", "ruthless"] }] },
        { name: "Glitterhelm Caverns", rules: [{ includes: ["glitterhelm caverns", "ruthless"] }] },
        { name: "No Towers Allowed", rules: [{ includes: ["no towers allowed", "ruthless"] }] },
        { name: "Unlikely Allies", rules: [{ includes: ["unlikely allies", "ruthless"] }] },
        { name: "Warping Core", rules: [{ includes: ["warping core", "ruthless"] }] },
        { name: "Raining Goblins", rules: [{ includes: ["raining goblins", "ruthless"] }] },
        { name: "Wizardry", rules: [{ includes: ["wizardry", "ruthless"] }] },
        { name: "Ogre Crush", rules: [{ includes: ["ogre crush", "ruthless"] }] },
        { name: "Zippy Terror", rules: [{ includes: ["zippy terror", "ruthless"] }] },
        { name: "Chicken", rules: [{ includes: ["chicken", "ruthless"] }] },
        { name: "Moving Core", rules: [{ includes: ["moving core", "ruthless"] }] },
        { name: "Death From Above", rules: [{ includes: ["death from above", "ruthless"] }] },
        { name: "Assault", rules: [{ includes: ["assault", "ruthless"] }] },
        { name: "Treasure Hunt", rules: [{ includes: ["treasure hunt", "ruthless"] }] },
        { name: "Monster Fest", rules: [{ includes: ["monster fest", "ruthless"] }] }
    ];

    const eternalDefenderRows = eternalDefenderRequiredRowGroups.map((entry) => {
        const matches = findCheckboxesByTextRules(rootElement, entry.rules);

        return {
            row: entry.name,
            found: matches.length > 0,
            checked: matches.some((checkbox) => checkbox.checked),
            matchedText: matches.map((checkbox) => getCheckboxVisibleText(checkbox))
        };
    });

    const ruthlessRows = ruthlessRequiredRowGroups.map((entry) => {
        const matches = findCheckboxesByTextRules(rootElement, entry.rules);

        return {
            row: entry.name,
            found: matches.length > 0,
            checked: matches.some((checkbox) => checkbox.checked),
            matchedText: matches.map((checkbox) => getCheckboxVisibleText(checkbox))
        };
    });

    const originalLevel70Classes = Array.from(getOriginalLevel70HeroClasses(saveData));

    const debugData = {
        checkedCount: Array.from(rootElement.querySelectorAll("input[type='checkbox']")).filter((checkbox) => checkbox.checked).length,
        totalCheckboxes: rootElement.querySelectorAll("input[type='checkbox']").length,
        beatenLevels: saveData.beatenLevels || [],
        unlockedLevels: saveData.unlockedLevels || [],
        heroes: saveData.heroes || [],
        originalLevel70Classes: originalLevel70Classes,
        eternalDefenderRows: eternalDefenderRows,
        ruthlessRows: ruthlessRows
    };

    window.latestDd1ImportDebug = debugData;
    return debugData;
}


function applySaveDataToChecklist(saveData, rootElement = document) {
    const achievementCheckboxes = rootElement.querySelectorAll("[data-steam-achievement], [data-steam-achievements]");
    let checkedCount = 0;

    achievementCheckboxes.forEach((checkbox) => {
        const requiredSteamIds = getRequiredSteamIdsFromCheckbox(checkbox);

        const shouldCheck = requiredSteamIds.length > 0 && requiredSteamIds.every((steamId) => {
            return saveData.unlockedSteamAchievementIds.includes(steamId);
        });

        checkbox.checked = shouldCheck;

        if (shouldCheck) {
            checkedCount++;
        }
    });

    checkedCount += applyBeatenLevelChecklistProgress(saveData, rootElement);
    checkedCount += applyRuthlessChecklistProgress(saveData, rootElement);
    checkedCount += applyAchievementBasedChecklistInferences(saveData, rootElement);
    checkedCount += applyMasterChecklistProgress(saveData, rootElement);

    const statusElements = rootElement.querySelectorAll("[data-steam-status]");

    statusElements.forEach((statusElement) => {
        const steamId = statusElement.dataset.steamStatus;

        if (saveData.unlockedSteamAchievementIds.includes(steamId)) {
            statusElement.textContent = "Unlocked";
        } else {
            statusElement.textContent = "Missing";
        }
    });

    buildSaveImportDebug(saveData, rootElement);

    const allCheckedBoxes = Array.from(rootElement.querySelectorAll("input[type='checkbox']")).filter((checkbox) => {
        return checkbox.checked;
    });

    return {
        checkedCount: allCheckedBoxes.length,
        totalSteamAchievementCheckboxes: rootElement.querySelectorAll("input[type='checkbox']").length
    };
}


/* =========================================================
   13. Save Import Summary Builder
========================================================= */

function getMappedSteamIdsFromPage(rootElement = document) {
    const mappedSteamIds = new Set();
    const achievementCheckboxes = rootElement.querySelectorAll("[data-steam-achievement], [data-steam-achievements]");

    achievementCheckboxes.forEach((checkbox) => {
        const requiredSteamIds = getRequiredSteamIdsFromCheckbox(checkbox);

        requiredSteamIds.forEach((steamId) => {
            mappedSteamIds.add(steamId);
        });
    });

    return mappedSteamIds;
}


function buildMissingMappedAchievementRows(saveData, rootElement = document) {
    const mappedSteamIds = getMappedSteamIdsFromPage(rootElement);

    const missingMappedAchievements = saveData.unlockedSteamAchievements.filter((achievementInfo) => {
        return !mappedSteamIds.has(achievementInfo.steamId);
    });

    if (missingMappedAchievements.length === 0) {
        return `
            <p>
                Every unlocked Steam achievement found in this save currently has a matching mapped checklist ID.
            </p>
        `;
    }

    return `
        <p>
            These achievements were found in this save, but do not currently have a matching mapped checkbox on this page.
        </p>

        <ul>
            ${missingMappedAchievements.map((achievementInfo) => {
                return `
                    <li>
                        <strong>${escapeHtml(achievementInfo.name)}</strong>
                        <br>
                        <code>${escapeHtml(achievementInfo.steamId)}</code>
                    </li>
                `;
            }).join("")}
        </ul>
    `;
}


function buildAllUnmappedAchievementRows(rootElement = document) {
    const mappedSteamIds = getMappedSteamIdsFromPage(rootElement);

    const allUnmappedAchievements = dd1SteamAchievementIndex
        .map((steamId, index) => {
            return {
                index: index,
                steamId: steamId,
                name: getDd1AchievementName(steamId)
            };
        })
        .filter((achievementInfo) => {
            return !mappedSteamIds.has(achievementInfo.steamId);
        });

    if (allUnmappedAchievements.length === 0) {
        return `
            <p>
                All ${dd1SteamAchievementIndex.length} Steam achievement IDs currently have a mapped checklist spot.
            </p>
        `;
    }

    return `
        <p>
            These Steam achievements exist in the save reader, but do not currently have a mapped checklist spot.
        </p>

        <p>
            <strong>Unmapped Steam achievements:</strong>
            ${allUnmappedAchievements.length} / ${dd1SteamAchievementIndex.length}
        </p>

        <ul>
            ${allUnmappedAchievements.map((achievementInfo) => {
                return `
                    <li>
                        <strong>${achievementInfo.index}: ${escapeHtml(achievementInfo.name)}</strong>
                        <br>
                        <code>${escapeHtml(achievementInfo.steamId)}</code>
                    </li>
                `;
            }).join("")}
        </ul>
    `;
}


function buildSaveImportSummary(file, saveData, pageAutoCheckResult) {
    return `
        <h2>Save Import Complete</h2>

        <p>
            Your save file was read successfully, and matching Steam achievements were checked on this page.
        </p>

        <ul>
            <li><strong>File:</strong> ${escapeHtml(file.name)}</li>
            <li><strong>Steam Achievements Found:</strong> ${saveData.steamAchievementsUnlocked} / ${saveData.totalSteamAchievements}</li>
            <li><strong>Checklist Boxes Checked:</strong> ${pageAutoCheckResult.checkedCount} / ${pageAutoCheckResult.totalSteamAchievementCheckboxes}</li>
            <li><strong>Heroes Detected:</strong> ${saveData.heroes.length}</li>
        </ul>

        <details open>
            <summary>Unlocked Save Verification Report</summary>
            ${buildMissingMappedAchievementRows(saveData, document)}
        </details>

        <details>
            <summary>Full 118 Achievement Mapping Report</summary>
            ${buildAllUnmappedAchievementRows(document)}
        </details>

        <p>
            You can keep using the checklist normally after importing.
        </p>
    `;
}


/* =========================================================
   14. File Upload Handler
========================================================= */

async function handleSaveFileUpload(event) {
    const file = event.target.files[0];

    if (!file) {
        saveFileOutput.innerHTML = "<p>No file selected.</p>";
        return;
    }

    try {
        saveFileOutput.innerHTML = "<p>Reading save file...</p>";

        const arrayBuffer = await file.arrayBuffer();

        setTimeout(() => {
            try {
                const saveData = getDd1SaveData(arrayBuffer);

                window.latestDd1SaveData = saveData;

                const pageAutoCheckResult = applySaveDataToChecklist(
                    saveData,
                    document
                );

                saveFileOutput.innerHTML = buildSaveImportSummary(
                    file,
                    saveData,
                    pageAutoCheckResult
                );
            } catch (error) {
                saveFileOutput.innerHTML = `
                    <h2>Import Failed</h2>
                    <p>${escapeHtml(describeError(error))}</p>
                `;
            }
        }, 50);
    } catch (error) {
        saveFileOutput.innerHTML = `
            <h2>Import Failed</h2>
            <p>${escapeHtml(describeError(error))}</p>
        `;
    }
}


/* =========================================================
   15. Page Startup
========================================================= */

saveFileInput.addEventListener("change", handleSaveFileUpload);