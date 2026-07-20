/* =========================================================
   DD1 Gear Item Model

   Converts imported save data into rows that the gear optimizer
   page can filter, score, display, and export.
========================================================= */

(() => {
    "use strict";

    /* =========================================================
       1. Gear Stat Constants
    ========================================================= */

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

    const statLabels = {
        heroHealth: "Hero HP",
        heroSpeed: "Hero Speed",
        heroDamage: "Hero Damage",
        heroCasting: "Casting",
        ability1: "Ability 1",
        ability2: "Ability 2",
        towerHealth: "Tower HP",
        towerRate: "Tower Rate",
        towerDamage: "Tower Damage",
        towerRange: "Tower Range"
    };

    const resistanceLabels = [
        "Generic",
        "Poison",
        "Fire",
        "Lightning"
    ];

    const knownArmorSets = [
        "Pristine",
        "Plate",
        "Chain",
        "Mail",
        "Leather",
        "Zamira"
    ];

    const qualityWords = [
        "Ult++",
        "Ult+",
        "Ultimate++",
        "Ultimate+",
        "Ultimate",
        "Supreme",
        "Transcendent",
        "Mythical",
        "Godly",
        "Legendary",
        "Epic",
        "Amazing",
        "Powerful",
        "Polished",
        "Sturdy",
        "Worn",
        "Torn"
    ];

    /* =========================================================
       2. Text Helpers
    ========================================================= */

    function cleanText(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/<color:[^>]*>/gi, "")
            .replace(/<\/color>/gi, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function normalizeSearchText(value) {
        return cleanText(value).toLowerCase();
    }

    function getCombinedItemText(equipment) {
        return [
            equipment.name,
            equipment.template,
            equipment.description,
            equipment.quality
        ].map(cleanText).join(" ");
    }

    function includesAny(text, words) {
        const lowerText = normalizeSearchText(text);

        return words.some((word) => {
            return lowerText.includes(word.toLowerCase());
        });
    }

    /* =========================================================
       3. Item Guessing Helpers
    ========================================================= */

    function guessQuality(equipment) {
        const text = getCombinedItemText(equipment);

        const matchedQuality = qualityWords.find((quality) => {
            return normalizeSearchText(text).includes(quality.toLowerCase());
        });

        if (matchedQuality) {
            if (matchedQuality === "Ultimate++") {
                return "Ult++";
            }

            if (matchedQuality === "Ultimate+") {
                return "Ult+";
            }

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

        const matchedSet = knownArmorSets.find((armorSet) => {
            return normalizeSearchText(text).includes(armorSet.toLowerCase());
        });

        return matchedSet || "Unknown";
    }

    function guessItemType(equipment) {
        const text = getCombinedItemText(equipment);

        if (includesAny(text, ["helmet", "helm", "hat", "cap", "head"])) {
            return "Helmet";
        }

        if (includesAny(text, ["chest", "vest", "torso", "shirt", "plate armor", "tunic"])) {
            return "Chest";
        }

        if (includesAny(text, ["glove", "gauntlet", "hand"])) {
            return "Gloves";
        }

        if (includesAny(text, ["boot", "shoe", "foot", "greave"])) {
            return "Boots";
        }

        if (includesAny(text, ["brooch", "mask", "bracer", "shield", "accessory", "acc_"])) {
            return "Accessory";
        }

        if (includesAny(text, ["pet", "familiar", "guardian", "cat", "genie", "dragon", "seahorse", "propeller"])) {
            return "Pet";
        }

        if (equipment.isSecondary) {
            return "Secondary";
        }

        if (includesAny(text, ["weapon", "sword", "staff", "bow", "gun", "spear", "cannon", "blade", "shooter"])) {
            return "Weapon";
        }

        return "Equipment";
    }

    /* =========================================================
       4. Stat + Resist Normalization
    ========================================================= */

    function readStatArray(equipment) {
        const rawStats = Array.isArray(equipment.statModifiers)
            ? equipment.statModifiers
            : [];

        const stats = {};

        Object.entries(statIndexes).forEach(([statName, index]) => {
            stats[statName] = Number(rawStats[index] || 0);
        });

        return stats;
    }

    function readResistArray(equipment) {
        const rawResists = Array.isArray(equipment.resistances)
            ? equipment.resistances
            : [];

        return {
            generic: Number(rawResists[0] || 0),
            poison: Number(rawResists[1] || 0),
            fire: Number(rawResists[2] || 0),
            lightning: Number(rawResists[3] || 0)
        };
    }

    function sumStats(stats, names) {
        return names.reduce((total, statName) => {
            return total + Number(stats[statName] || 0);
        }, 0);
    }

    function sumResists(resists) {
        return Number(resists.generic || 0) +
            Number(resists.poison || 0) +
            Number(resists.fire || 0) +
            Number(resists.lightning || 0);
    }

    function formatCompactStats(stats, names) {
        return names.map((statName) => {
            return `${statLabels[statName]} ${stats[statName] || 0}`;
        }).join(" / ");
    }

    /* =========================================================
       5. Gear Row Creation
    ========================================================= */

    function buildItemRow(equipment, hero, equipmentIndex) {
        const name = cleanText(equipment.name) || "Unnamed Equipment";
        const template = cleanText(equipment.template) || "Unknown Template";
        const stats = readStatArray(equipment);
        const resists = readResistArray(equipment);
        const itemType = guessItemType(equipment);
        const armorSet = guessArmorSet(equipment);
        const quality = guessQuality(equipment);
        const currentLevel = Number(equipment.currentUpgradeLevel || 0);
        const maxLevel = Number(equipment.maximumUpgradeLevel || 0);
        const towerTotal = sumStats(stats, ["towerHealth", "towerDamage", "towerRange", "towerRate"]);
        const heroTotal = sumStats(stats, ["heroHealth", "heroDamage", "heroSpeed", "heroCasting", "ability1", "ability2"]);
        const resistTotal = sumResists(resists);

        return {
            id: `${hero.number || 0}-${equipmentIndex}-${equipment.equipmentIds ? equipment.equipmentIds.join("-") : name}`,
            source: "equipped",
            location: `Equipped on ${cleanText(hero.name) || `Hero ${hero.number}`}`,
            equippedHero: cleanText(hero.name) || `Hero ${hero.number}`,
            equippedHeroClass: hero.className || "Unknown",
            heroNumber: Number(hero.number || 0),
            itemNumber: equipmentIndex + 1,
            itemType: itemType,
            armorSet: armorSet,
            quality: quality,
            name: name,
            template: template,
            currentLevel: currentLevel,
            maxLevel: maxLevel,
            stats: stats,
            resists: resists,
            towerTotal: towerTotal,
            heroTotal: heroTotal,
            resistTotal: resistTotal,
            isLocked: Boolean(equipment.isLocked),
            isSecondary: Boolean(equipment.isSecondary),
            rawEquipment: equipment
        };
    }

    /* =========================================================
       6. Save Data Conversion
    ========================================================= */

    function buildRowsFromSaveData(saveData) {
        if (!saveData || !Array.isArray(saveData.heroes)) {
            return [];
        }

        return saveData.heroes.flatMap((hero) => {
            const heroEquipment = Array.isArray(hero.equipment)
                ? hero.equipment
                : [];

            return heroEquipment.map((equipment, index) => {
                return buildItemRow(equipment, hero, index);
            });
        });
    }

    function buildHeroSummary(saveData) {
        if (!saveData || !Array.isArray(saveData.heroes)) {
            return [];
        }

        return saveData.heroes.map((hero) => {
            return {
                number: Number(hero.number || 0),
                name: cleanText(hero.name) || `Hero ${hero.number}`,
                className: hero.className || "Unknown",
                level: Number(hero.level || 0),
                suggestedRole: hero.suggestedRole || "Unknown",
                equipmentCount: Number(hero.equipmentCount || 0),
                totalStats: hero.totalStats || {},
                resistances: hero.resistances || {}
            };
        });
    }

    /* =========================================================
       7. Sorting / Filtering Helpers
    ========================================================= */

    function getUniqueSortedValues(rows, key) {
        return [...new Set(rows.map((row) => {
            return row[key] || "Unknown";
        }))].sort((first, second) => {
            return first.localeCompare(second);
        });
    }

    /* =========================================================
       8. Public API
    ========================================================= */

    window.dd1GearItemModel = {
        statLabels: statLabels,
        resistanceLabels: resistanceLabels,
        buildRowsFromSaveData: buildRowsFromSaveData,
        buildHeroSummary: buildHeroSummary,
        cleanText: cleanText,
        formatCompactStats: formatCompactStats,
        getUniqueSortedValues: getUniqueSortedValues,
        sumStats: sumStats,
        sumResists: sumResists
    };
})();
