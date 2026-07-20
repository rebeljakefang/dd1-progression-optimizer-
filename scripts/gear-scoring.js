/* =========================================================
   DD1 Gear Scoring

   Rating archetypes for gear-optimizer.html. This file only
   scores rows that were already created by gear-save-reader.js.
========================================================= */

(() => {
    "use strict";

    /* =========================================================
       1. Auto Role Option
    ========================================================= */

    const autoRoleOption = {
        value: "auto",
        label: "Auto by Hero Archetype",
        description: "Each hero is scored using its guessed or manually selected archetype."
    };

    /* =========================================================
       2. Archetype Definitions
    ========================================================= */

    const roles = {
        builderDamage: {
            label: "Builder Damage",
            shortLabel: "Builder",
            description: "Scores general tower gear using tower damage, tower rate, tower range, and tower health.",
            weights: {
                towerDamage: 4,
                towerRate: 3,
                towerRange: 1.5,
                towerHealth: 1.2,
                allResists: 0.08
            }
        },
        builderApp: {
            label: "Builder App",
            shortLabel: "App",
            description: "Scores Apprentice-style builder gear with strong tower damage and useful tower rate/range.",
            weights: {
                towerDamage: 4.2,
                towerRate: 3,
                towerRange: 1.6,
                towerHealth: 1,
                allResists: 0.05
            }
        },
        builderHermit: {
            label: "Builder Hermit",
            shortLabel: "Hermit",
            description: "Scores Hermit builder gear with tower damage, rate, range, and health.",
            weights: {
                towerDamage: 3.8,
                towerRate: 2.6,
                towerRange: 1.7,
                towerHealth: 1.5,
                allResists: 0.05
            }
        },
        builderTrange: {
            label: "Builder TRange",
            shortLabel: "TRange",
            description: "Scores range-focused builder gear.",
            weights: {
                towerRange: 4,
                towerDamage: 2.5,
                towerRate: 2,
                towerHealth: 1,
                allResists: 0.05
            }
        },
        builderEv: {
            label: "Builder EV",
            shortLabel: "EV",
            description: "Scores EV builder gear with strong tower health, damage, and rate.",
            weights: {
                towerHealth: 3.4,
                towerDamage: 2.8,
                towerRate: 2.2,
                towerRange: 0.8,
                allResists: 0.05
            }
        },
        builderSummoner: {
            label: "Builder Summoner",
            shortLabel: "Summoner",
            description: "Scores Summoner builder gear with tower damage, rate, and health.",
            weights: {
                towerDamage: 3.6,
                towerRate: 2.8,
                towerHealth: 2,
                towerRange: 1,
                allResists: 0.05
            }
        },
        waller: {
            label: "Waller",
            shortLabel: "Waller",
            description: "Scores waller gear mostly by tower health.",
            weights: {
                towerHealth: 6,
                towerRate: 0.4,
                towerDamage: 0.3,
                towerRange: 0.2,
                allResists: 0.05
            }
        },
        wallerSummoner: {
            label: "Waller Summoner",
            shortLabel: "Waller Summoner",
            description: "Scores Summoner waller gear mostly by tower health.",
            weights: {
                towerHealth: 6,
                towerRate: 0.5,
                towerDamage: 0.4,
                towerRange: 0.2,
                allResists: 0.05
            }
        },
        builderGuardian: {
            label: "Builder Guardian",
            shortLabel: "Guardian",
            description: "Scores Guardian-style support gear with builder stats plus survivability.",
            weights: {
                towerDamage: 2.8,
                towerRate: 2.4,
                towerHealth: 1.5,
                towerRange: 1,
                heroHealth: 0.8,
                allResists: 0.18
            }
        },
        pureDps: {
            label: "Pure DPS",
            shortLabel: "DPS",
            description: "Scores DPS gear using hero damage, hero health, casting, and resistances.",
            weights: {
                heroDamage: 4.2,
                heroHealth: 1.4,
                heroCasting: 0.8,
                allResists: 0.35
            }
        },
        hybridDps: {
            label: "Hybrid DPS",
            shortLabel: "Hybrid",
            description: "Scores hybrid gear using hero damage plus tower damage.",
            weights: {
                heroDamage: 3,
                towerDamage: 2.2,
                heroHealth: 1,
                heroCasting: 0.8,
                towerRate: 0.8,
                allResists: 0.25
            }
        },
        ability1Only: {
            label: "AB1 Only",
            shortLabel: "AB1",
            description: "Scores ability gear mostly by Ability 1.",
            weights: {
                ability1: 5,
                heroDamage: 1.7,
                heroCasting: 1,
                heroHealth: 0.8,
                allResists: 0.25
            }
        },
        dpsAbility1: {
            label: "DPS AB1",
            shortLabel: "DPS AB1",
            description: "Scores DPS gear with extra weight for Ability 1.",
            weights: {
                heroDamage: 3.5,
                ability1: 3,
                heroCasting: 0.9,
                heroHealth: 0.8,
                allResists: 0.3
            }
        },
        dpsAbility2: {
            label: "DPS AB2",
            shortLabel: "DPS AB2",
            description: "Scores DPS gear with extra weight for Ability 2.",
            weights: {
                heroDamage: 3.5,
                ability2: 3,
                heroCasting: 0.9,
                heroHealth: 0.8,
                allResists: 0.3
            }
        },
        gunwitch: {
            label: "Gunwitch",
            shortLabel: "Gunwitch",
            description: "Scores Gunwitch gear by hero damage, ability stats, casting, and resistances.",
            weights: {
                heroDamage: 3.8,
                ability1: 1.6,
                ability2: 1.6,
                heroCasting: 1,
                heroHealth: 0.8,
                allResists: 0.3
            }
        },
        needleGunwitch: {
            label: "Needle Gunwitch",
            shortLabel: "Needle",
            description: "Scores Needle Gunwitch gear with heavy hero damage and casting value.",
            weights: {
                heroDamage: 4.5,
                heroCasting: 1.4,
                ability1: 1,
                ability2: 1,
                heroHealth: 0.7,
                allResists: 0.28
            }
        },
        boostMonk: {
            label: "Boost Monk",
            shortLabel: "Boost Monk",
            description: "Scores Monk support gear using ability stats, hero damage, casting, and survivability.",
            weights: {
                ability1: 3.5,
                ability2: 3.5,
                heroDamage: 1,
                heroCasting: 1,
                heroHealth: 0.8,
                allResists: 0.25
            }
        },
        boostSummoner: {
            label: "Boost Summoner",
            shortLabel: "Boost Summoner",
            description: "Scores Summoner support gear using hero health, casting, and resistances.",
            weights: {
                heroHealth: 2.4,
                heroCasting: 2,
                allResists: 0.45,
                towerHealth: 0.7,
                towerDamage: 0.5
            }
        }
    };

    /* =========================================================
       3. Archetype Order + Aliases
    ========================================================= */

    const roleOrder = [
        "builderApp",
        "builderHermit",
        "builderTrange",
        "builderEv",
        "builderSummoner",
        "builderGuardian",
        "waller",
        "wallerSummoner",
        "ability1Only",
        "dpsAbility1",
        "dpsAbility2",
        "hybridDps",
        "pureDps",
        "gunwitch",
        "needleGunwitch",
        "boostMonk",
        "boostSummoner",
        "builderDamage"
    ];

    const roleAliases = {
        auto: "auto",
        builder: "builderDamage",
        "builder damage": "builderDamage",
        app: "builderApp",
        apprentice: "builderApp",
        adept: "builderApp",
        hermit: "builderHermit",
        trange: "builderTrange",
        range: "builderTrange",
        ev: "builderEv",
        "builder ev": "builderEv",
        "series ev": "builderEv",
        summoner: "builderSummoner",
        "builder summoner": "builderSummoner",
        waller: "waller",
        "waller summoner": "wallerSummoner",
        guardian: "builderGuardian",
        dps: "pureDps",
        "pure dps": "pureDps",
        hybrid: "hybridDps",
        "hybrid dps": "hybridDps",
        ab1: "ability1Only",
        "ab1 only": "ability1Only",
        "dps ab1": "dpsAbility1",
        "dps ab2": "dpsAbility2",
        gunwitch: "gunwitch",
        "needle gunwitch": "needleGunwitch",
        monk: "boostMonk",
        boost: "boostMonk",
        "boost monk": "boostMonk",
        "boost summoner": "boostSummoner"
    };

    /* =========================================================
       4. Role Normalization
    ========================================================= */

    function normalizeText(value) {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/[-_]/g, " ")
            .replace(/\s+/g, " ");
    }

    function normalizeRoleKey(value) {
        const rawValue = String(value || "").trim();

        if (roles[rawValue] || rawValue === "auto") {
            return rawValue;
        }

        const normalized = normalizeText(rawValue);

        if (roleAliases[normalized]) {
            return roleAliases[normalized];
        }

        if (normalized.includes("waller") && normalized.includes("summoner")) {
            return "wallerSummoner";
        }

        if (normalized.includes("waller")) {
            return "waller";
        }

        if (normalized.includes("summoner") && normalized.includes("boost")) {
            return "boostSummoner";
        }

        if (normalized.includes("summoner")) {
            return "builderSummoner";
        }

        if (normalized.includes("guardian")) {
            return "builderGuardian";
        }

        if (normalized.includes("dps") && normalized.includes("ab1")) {
            return "dpsAbility1";
        }

        if (normalized.includes("dps") && normalized.includes("ab2")) {
            return "dpsAbility2";
        }

        if (normalized.includes("dps")) {
            return "pureDps";
        }

        if (normalized.includes("ev")) {
            return "builderEv";
        }

        if (normalized.includes("builder")) {
            return "builderDamage";
        }

        return "builderDamage";
    }

    function getRole(roleKey) {
        const normalizedRoleKey = normalizeRoleKey(roleKey);

        if (normalizedRoleKey === "auto") {
            return autoRoleOption;
        }

        return roles[normalizedRoleKey] || roles.builderDamage;
    }

    function getRoleOptions(includeAuto = false) {
        const options = roleOrder.map((roleKey) => {
            return {
                value: roleKey,
                label: roles[roleKey].label,
                description: roles[roleKey].description
            };
        });

        if (includeAuto) {
            return [autoRoleOption, ...options];
        }

        return options;
    }

    /* =========================================================
       5. Stat Reading + Score Calculation
    ========================================================= */

    function getStat(row, statName) {
        if (!row) {
            return 0;
        }

        if (row.stats && Number.isFinite(Number(row.stats[statName]))) {
            return Number(row.stats[statName]);
        }

        if (Number.isFinite(Number(row[statName]))) {
            return Number(row[statName]);
        }

        return 0;
    }

    function getResist(row, resistName) {
        if (!row) {
            return 0;
        }

        if (row.resists && Number.isFinite(Number(row.resists[resistName]))) {
            return Number(row.resists[resistName]);
        }

        if (Number.isFinite(Number(row[resistName]))) {
            return Number(row[resistName]);
        }

        return 0;
    }

    function getAllResists(row) {
        return getResist(row, "generic") +
            getResist(row, "poison") +
            getResist(row, "fire") +
            getResist(row, "lightning");
    }

    function calculateScore(row, roleKey) {
        const role = getRole(roleKey);
        const weights = role.weights || {};
        let score = 0;

        Object.entries(weights).forEach(([statName, weight]) => {
            if (statName === "allResists") {
                score += getAllResists(row) * weight;
            } else {
                score += getStat(row, statName) * weight;
            }
        });

        return Math.round(score);
    }

    function getStrongestStats(row, roleKey) {
        const role = getRole(roleKey);
        const weights = role.weights || {};

        const entries = Object.entries(weights)
            .filter(([statName]) => statName !== "allResists")
            .map(([statName, weight]) => {
                const value = getStat(row, statName);

                return {
                    statName: statName,
                    value: value,
                    contribution: value * weight
                };
            })
            .filter((entry) => entry.value !== 0)
            .sort((first, second) => second.contribution - first.contribution);

        if (weights.allResists) {
            entries.push({
                statName: "allResists",
                value: getAllResists(row),
                contribution: getAllResists(row) * weights.allResists
            });
        }

        return entries.slice(0, 3);
    }

    function scoreRow(row, roleKey) {
        const normalizedRoleKey = normalizeRoleKey(roleKey);
        const role = getRole(normalizedRoleKey);

        return {
            ...row,
            score: calculateScore(row, normalizedRoleKey),
            scoreRole: normalizedRoleKey,
            scoreRoleLabel: role.label,
            strongestStats: getStrongestStats(row, normalizedRoleKey)
        };
    }

    function scoreRows(rows, roleKey) {
        return rows.map((row) => scoreRow(row, roleKey));
    }

    /* =========================================================
       6. Hero Role Guessing
    ========================================================= */

    function getHeroStat(hero, statName) {
        if (!hero || !hero.totalStats) {
            return 0;
        }

        return Number(hero.totalStats[statName] || 0);
    }

    function guessRoleForHero(hero) {
        const className = normalizeText(hero && hero.className);
        const heroName = normalizeText(hero && hero.name);
        const suggestedRole = normalizeText(hero && hero.suggestedRole);

        if (suggestedRole.includes("waller") && className.includes("summoner")) {
            return "wallerSummoner";
        }

        if (suggestedRole.includes("waller")) {
            return "waller";
        }

        if (suggestedRole.includes("guardian")) {
            return "builderGuardian";
        }

        if (suggestedRole.includes("dps")) {
            if (className.includes("gunwitch")) {
                return "gunwitch";
            }

            return "pureDps";
        }

        if (suggestedRole.includes("summoner")) {
            return "builderSummoner";
        }

        if (suggestedRole.includes("builder")) {
            if (className.includes("ev")) {
                return "builderEv";
            }

            if (className.includes("summoner")) {
                return "builderSummoner";
            }

            if (className.includes("apprentice") || className.includes("adept")) {
                return "builderApp";
            }

            if (className.includes("hermit")) {
                return "builderHermit";
            }

            if (className.includes("huntress") || className.includes("ranger")) {
                return "builderTrange";
            }

            return "builderDamage";
        }

        if (heroName.includes("waller") || heroName.includes("wall")) {
            return className.includes("summoner") ? "wallerSummoner" : "waller";
        }

        if (heroName.includes("boost") && className.includes("summoner")) {
            return "boostSummoner";
        }

        if (heroName.includes("boost") || className.includes("monk") || className.includes("initiate")) {
            return "boostMonk";
        }

        if (className.includes("ev")) {
            return "builderEv";
        }

        if (className.includes("summoner")) {
            if (getHeroStat(hero, "towerHealth") > getHeroStat(hero, "towerDamage") * 1.5) {
                return "wallerSummoner";
            }

            return "builderSummoner";
        }

        if (className.includes("apprentice") || className.includes("adept")) {
            return "builderApp";
        }

        if (className.includes("hermit")) {
            return "builderHermit";
        }

        if (className.includes("huntress") || className.includes("ranger")) {
            return "builderTrange";
        }

        if (getHeroStat(hero, "heroDamage") > getHeroStat(hero, "towerDamage") && getHeroStat(hero, "heroDamage") > 500) {
            return "pureDps";
        }

        return "builderDamage";
    }

    /* =========================================================
       7. Public API
    ========================================================= */

    window.dd1GearScoring = {
        getRole: getRole,
        getRoleOptions: getRoleOptions,
        normalizeRoleKey: normalizeRoleKey,
        guessRoleForHero: guessRoleForHero,
        scoreRow: scoreRow,
        scoreRows: scoreRows
    };
})();
