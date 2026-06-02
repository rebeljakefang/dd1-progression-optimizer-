/* =========================================================
   1. Page Elements
========================================================= */

const saveFileInput = document.querySelector("#save-file-input");
const saveFileOutput = document.querySelector("#save-file-output");


/* =========================================================
   2. Save Reader Constants
========================================================= */

const targetZlibOffsets = [60, 20602, 38463];

const targetSearchRanges = {
    60: 20602,
    20602: 38463,
    38463: null
};

const maxAchievements = 500;

const heroTemplatePatterns = [
    "DunDefNewHeroes.HeroTemplate",
    "DunDefHeroes.HeroTemplate"
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
   7. Zlib Exact End Search
========================================================= */

function tryInflateExactEnd(rawBytes, offset, maxEnd) {
    const startEnd = offset + 20;
    const finalEnd = maxEnd || rawBytes.length;

    for (let end = startEnd; end <= finalEnd; end++) {
        try {
            const slice = rawBytes.slice(offset, end);
            const decompressed = pako.inflate(slice);

            if (decompressed && decompressed.length !== undefined) {
                return {
                    success: true,
                    offset: offset,
                    end: end,
                    rawLength: end - offset,
                    decompressedBytes: decompressed,
                    decompressedSize: decompressed.length,
                    error: ""
                };
            }
        } catch {
            // Keep searching for the exact zlib end.
        }
    }

    return {
        success: false,
        offset: offset,
        end: finalEnd,
        rawLength: finalEnd - offset,
        decompressedBytes: null,
        decompressedSize: 0,
        error: "No exact zlib end found in the target range."
    };
}


function decompressDunFile(arrayBuffer) {
    const rawBytes = new Uint8Array(arrayBuffer);
    const blocks = [];

    targetZlibOffsets.forEach((offset) => {
        const maxEnd = targetSearchRanges[offset] || rawBytes.length;
        const result = tryInflateExactEnd(rawBytes, offset, maxEnd);

        if (!result.success) {
            throw new Error(`Failed to decompress zlib block at offset ${offset}: ${result.error}`);
        }

        blocks.push(result);
    });

    let totalLength = 0;

    blocks.forEach((block) => {
        totalLength += block.decompressedBytes.length;
    });

    const combinedBytes = new Uint8Array(totalLength);
    let position = 0;

    blocks.forEach((block) => {
        combinedBytes.set(block.decompressedBytes, position);
        position += block.decompressedBytes.length;
    });

    return {
        rawBytes: rawBytes,
        blocks: blocks,
        combinedBytes: combinedBytes
    };
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
   10. Achievement Window Scanner
========================================================= */

function countAchievementWindow(bytes, start) {
    let zeroCount = 0;
    let oneCount = 0;
    let nonZeroCount = 0;
    let otherNonZeroCount = 0;

    for (let offset = 0; offset < maxAchievements; offset++) {
        const value = bytes[start + offset];

        if (value === 0) {
            zeroCount++;
        } else {
            nonZeroCount++;

            if (value === 1) {
                oneCount++;
            } else {
                otherNonZeroCount++;
            }
        }
    }

    return {
        zeroCount: zeroCount,
        oneCount: oneCount,
        nonZeroCount: nonZeroCount,
        otherNonZeroCount: otherNonZeroCount
    };
}


function looksLikeAchievementWindow(bytes, start) {
    if (start < 0 || start + maxAchievements > bytes.length) {
        return false;
    }

    const counts = countAchievementWindow(bytes, start);

    return (
        counts.nonZeroCount >= 1 &&
        counts.nonZeroCount <= 118 &&
        counts.otherNonZeroCount === 0
    );
}


function findLikelyAchievementStart(bytes, heroes) {
    let searchStart = 0;

    if (heroes.length > 0) {
        const lastHero = heroes[heroes.length - 1];
        searchStart = lastHero.templatePosition + 500;
    }

    const searchEnd = bytes.length - maxAchievements;

    for (let position = searchStart; position <= searchEnd; position++) {
        if (looksLikeAchievementWindow(bytes, position)) {
            return position;
        }
    }

    return -1;
}


function findAchievementCandidates(bytes, heroes) {
    const candidates = [];
    let searchStart = 0;

    if (heroes.length > 0) {
        const lastHero = heroes[heroes.length - 1];
        searchStart = lastHero.templatePosition + 500;
    }

    const searchEnd = bytes.length - maxAchievements;

    for (let position = searchStart; position <= searchEnd; position++) {
        if (looksLikeAchievementWindow(bytes, position)) {
            const counts = countAchievementWindow(bytes, position);
            const achievementBytes = bytes.slice(position, position + maxAchievements);

            candidates.push({
                start: position,
                adjustedStart: position + 44,
                counts: counts,
                previewHex: debugBytes(achievementBytes, 0, 160),
                previewAscii: bytesToAscii(achievementBytes, 0, 160)
            });

            if (candidates.length >= 10) {
                break;
            }
        }
    }

    return candidates;
}


function readAchievementBytes(bytes, heroes) {
    const start = findLikelyAchievementStart(bytes, heroes);

    if (start === -1) {
        throw new Error("Could not find a clean 500-byte achievement window.");
    }

    const adjustedStart = start + 44;
    const achievementBytes = bytes.slice(adjustedStart, adjustedStart + maxAchievements);
    const counts = countAchievementWindow(bytes, adjustedStart);
    const unlockedSteamAchievements = [];

    for (let index = 0; index < dd1SteamAchievementIndex.length; index++) {
        const steamId = dd1SteamAchievementIndex[index];
        const value = achievementBytes[index];

        if (value === 1) {
            unlockedSteamAchievements.push({
                index: index,
                steamId: steamId,
                name: getDd1AchievementName(steamId)
            });
        }
    }

    return {
        start: adjustedStart,
        originalStart: start,
        offsetAdjustment: 44,
        bytes: achievementBytes,
        counts: counts,
        unlockedSteamAchievements: unlockedSteamAchievements,
        previewHex: debugBytes(achievementBytes, 0, 200),
        previewAscii: bytesToAscii(achievementBytes, 0, 200)
    };
}


/* =========================================================
   11. Save Scanner
========================================================= */

function getDd1SaveData(arrayBuffer) {
    const decompression = decompressDunFile(arrayBuffer);
    const combinedBytes = decompression.combinedBytes;

    const headerVersion = readI32At(combinedBytes, 0);
    const headerSaveSize = readI32At(combinedBytes, 4);

    const heroes = scanHeroes(combinedBytes);
    const achievement = readAchievementBytes(combinedBytes, heroes);

    const unlockedSteamAchievementIds = achievement.unlockedSteamAchievements.map((achievementInfo) => {
        return achievementInfo.steamId;
    });

    const unlockedSteamAchievementNames = achievement.unlockedSteamAchievements.map((achievementInfo) => {
        return achievementInfo.name;
    });

    return {
        heroes: heroes,

        unlockedSteamAchievements: achievement.unlockedSteamAchievements,
        unlockedSteamAchievementIds: unlockedSteamAchievementIds,
        unlockedSteamAchievementNames: unlockedSteamAchievementNames,

        steamAchievementsUnlocked: achievement.unlockedSteamAchievements.length,
        totalSteamAchievements: dd1SteamAchievementIndex.length,

        saveAchievementFlagsFound: achievement.counts.nonZeroCount,
        maxSaveAchievementFlags: maxAchievements,

        achievementStartPosition: achievement.start,
        achievementOriginalStartPosition: achievement.originalStart,
        achievementOffsetAdjustment: achievement.offsetAdjustment,

        achievementBytes: achievement.bytes,
        achievementCounts: achievement.counts,
        achievementPreviewHex: achievement.previewHex,
        achievementPreviewAscii: achievement.previewAscii,

        decompression: {
            blocks: decompression.blocks,
            blockCount: decompression.blocks.length,
            combinedSize: combinedBytes.length
        },

        header: {
            version: headerVersion,
            saveSize: headerSaveSize
        }
    };
}


function scanSaveFile(arrayBuffer) {
    const saveData = getDd1SaveData(arrayBuffer);
    const achievementCandidates = findAchievementCandidates(
        decompressDunFile(arrayBuffer).combinedBytes,
        saveData.heroes
    );

    return {
        decompression: {
            blocks: saveData.decompression.blocks
        },
        header: saveData.header,
        heroes: saveData.heroes,
        achievement: {
            start: saveData.achievementStartPosition,
            originalStart: saveData.achievementOriginalStartPosition,
            offsetAdjustment: saveData.achievementOffsetAdjustment,
            bytes: saveData.achievementBytes,
            counts: saveData.achievementCounts,
            unlockedSteamAchievements: saveData.unlockedSteamAchievements,
            previewHex: saveData.achievementPreviewHex,
            previewAscii: saveData.achievementPreviewAscii
        },
        achievementCandidates: achievementCandidates,
        combinedSize: saveData.decompression.combinedSize,
        cleanSaveData: saveData
    };
}


/* =========================================================
   12. Output Builders and Checklist Helpers
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
                <strong>Name Position:</strong> ${hero.namePosition}
                |
                <strong>Template Position:</strong> ${hero.templatePosition}

                <details>
                    <summary>Hero preview</summary>
                    <p><strong>ASCII:</strong> <code>${escapeHtml(hero.previewAscii)}</code></p>
                    <p><strong>Hex:</strong> <code>${escapeHtml(hero.previewHex)}</code></p>
                </details>
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

    const statusElements = rootElement.querySelectorAll("[data-steam-status]");

    statusElements.forEach((statusElement) => {
        const steamId = statusElement.dataset.steamStatus;

        if (saveData.unlockedSteamAchievementIds.includes(steamId)) {
            statusElement.textContent = "Unlocked";
        } else {
            statusElement.textContent = "Missing";
        }
    });

    return {
        checkedCount: checkedCount,
        totalSteamAchievementCheckboxes: achievementCheckboxes.length
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