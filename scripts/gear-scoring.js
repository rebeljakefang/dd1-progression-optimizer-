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
       4. Upgrade Priority Plans

       These priorities follow the same general approach used by
       DDGO: required resistances first for DPS-style armor, then
       the main rating stats, then useful side stats.
    ========================================================= */

    const upgradePlans = {
        builderDamage: { primary: ["towerDamage", "towerRate", "towerRange"], secondary: ["towerHealth"], requireResists: false },
        builderApp: { primary: ["towerDamage", "towerRate", "towerRange"], secondary: ["towerHealth"], requireResists: false },
        builderHermit: { primary: ["towerDamage", "towerRange", "towerHealth"], secondary: ["towerRate"], requireResists: false },
        builderTrange: { primary: ["towerRange"], secondary: ["towerHealth", "towerDamage", "towerRate"], requireResists: false },
        builderEv: { primary: ["towerDamage"], secondary: ["towerHealth", "towerRate", "towerRange"], requireResists: false },
        builderSummoner: { primary: ["towerHealth"], secondary: ["towerDamage", "towerRate", "towerRange"], requireResists: false },
        waller: { primary: ["towerHealth"], secondary: ["towerRate", "towerDamage", "towerRange"], requireResists: false },
        wallerSummoner: { primary: ["towerHealth"], secondary: ["towerDamage", "towerRate", "towerRange"], requireResists: false },
        builderGuardian: { primary: ["towerHealth", "towerRate", "towerRange"], secondary: ["towerDamage"], requireResists: false },
        ability1Only: { primary: ["ability1"], secondary: ["heroHealth", "heroDamage", "heroCasting"], requireResists: true },
        dpsAbility1: { primary: ["heroDamage", "ability1"], secondary: ["heroHealth"], requireResists: true },
        dpsAbility2: { primary: ["heroDamage", "ability2"], secondary: ["heroHealth"], requireResists: true },
        hybridDps: { primary: ["heroDamage", "ability1", "ability2"], secondary: ["heroHealth"], requireResists: true },
        pureDps: { primary: ["heroDamage"], secondary: ["heroHealth", "ability1", "ability2"], requireResists: true },
        gunwitch: { primary: ["heroDamage", "towerDamage", "towerRate"], secondary: ["heroHealth"], requireResists: true },
        needleGunwitch: { primary: ["towerRange"], secondary: ["heroDamage", "towerDamage", "towerRate", "heroHealth"], requireResists: true },
        boostMonk: { primary: ["ability1", "ability2"], secondary: ["heroHealth", "heroDamage", "heroCasting"], requireResists: true },
        boostSummoner: { primary: ["heroHealth"], secondary: ["ability2", "heroCasting"], requireResists: true }
    };

    const upgradeStatLabels = {
        heroHealth: "Hero HP",
        heroSpeed: "Hero Speed",
        heroDamage: "Hero Damage",
        heroCasting: "Hero Casting",
        ability1: "Ability 1",
        ability2: "Ability 2",
        towerHealth: "Tower HP",
        towerDamage: "Tower Damage",
        towerRange: "Tower Range",
        towerRate: "Tower Rate"
    };

    const resistRequirements = [
        42, 42, 42, 41, 41, 41, 40, 40, 40,
        39, 39, 38, 38, 37, 37, 36, 36, 35, 34,
        33, 32, 31, 30, 29, 28, 27, 26, 25, 24,
        23, 23, 22, 21, 20, 19, 18, 17, 16, 15,
        14, 13, 12, 11, 10, 9, 9, 8, 8, 7,
        7, 6, 5, 6, 5, 4, 3, 2, 1, 0, -1, -2
    ];

    /* =========================================================
       5. Role Normalization
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
       6. Stat Reading + Score Calculation
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
       7. Upgrade Simulation + Text Guide Data
    ========================================================= */

    function getUpgradePlan(roleKey) {
        const normalizedRoleKey = normalizeRoleKey(roleKey);

        return upgradePlans[normalizedRoleKey] || upgradePlans.builderDamage;
    }

    function getQualityUpgradeRules(quality, isArmor) {
        const normalized = normalizeText(quality).replace(/\s+/g, "");
        let setBonus = 1.25;
        let resistanceTarget = 31;
        let maxStat = 300;

        if (normalized === "ult++" || normalized === "ultimate++") {
            setBonus = 1.4;
            resistanceTarget = 29;
            maxStat = 999;
        } else if (normalized === "ult+" || normalized === "ultimate+") {
            setBonus = 1.4;
            resistanceTarget = 29;
            maxStat = 700;
        } else if (normalized === "ult93" || normalized === "ult90" || normalized === "ultimate") {
            setBonus = 1.4;
            resistanceTarget = 29;
            maxStat = 600;
        } else if (normalized === "supreme") {
            setBonus = 1.36;
            resistanceTarget = 30;
            maxStat = 500;
        } else if (normalized === "trans" || normalized === "transcendent") {
            setBonus = 1.33;
            resistanceTarget = 31;
            maxStat = 420;
        } else if (normalized === "mythic" || normalized === "mythical") {
            setBonus = 1.3;
            resistanceTarget = 31;
            maxStat = 360;
        }

        if (!isArmor) {
            setBonus = 1;
            resistanceTarget = 0;
        }

        return { setBonus, resistanceTarget, maxStat };
    }

    function isArmorRow(row) {
        const type = normalizeText(row && row.itemType);

        return ["helmet", "chest", "torso", "gloves", "gauntlet", "boots"].includes(type);
    }

    function getUpgradesRequiredForResists(target, resists) {
        const values = [resists.generic, resists.poison, resists.fire, resists.lightning];
        const delta = target - 29;

        return values.reduce((total, rawValue) => {
            const value = Number(rawValue || 0);
            let required = 0;

            if (value >= -29 && value < 31) {
                required = resistRequirements[value + 29] + delta;
            }

            return total + Math.max(0, required);
        }, 0);
    }

    function cloneStats(stats) {
        return {
            heroHealth: Number(stats && stats.heroHealth || 0),
            heroSpeed: Number(stats && stats.heroSpeed || 0),
            heroDamage: Number(stats && stats.heroDamage || 0),
            heroCasting: Number(stats && stats.heroCasting || 0),
            ability1: Number(stats && stats.ability1 || 0),
            ability2: Number(stats && stats.ability2 || 0),
            towerHealth: Number(stats && stats.towerHealth || 0),
            towerDamage: Number(stats && stats.towerDamage || 0),
            towerRange: Number(stats && stats.towerRange || 0),
            towerRate: Number(stats && stats.towerRate || 0)
        };
    }

    function cloneResists(resists) {
        return {
            generic: Number(resists && resists.generic || 0),
            poison: Number(resists && resists.poison || 0),
            fire: Number(resists && resists.fire || 0),
            lightning: Number(resists && resists.lightning || 0)
        };
    }

    function simulateItemUpgrades(row, roleKey) {
        const normalizedRoleKey = normalizeRoleKey(roleKey);
        const role = getRole(normalizedRoleKey);
        const plan = getUpgradePlan(normalizedRoleKey);
        const currentLevel = Number(row && row.currentLevel || 0);
        const maxLevel = Number(row && row.maxLevel || 0);
        const upgradesAvailable = Math.max(0, maxLevel - currentLevel);
        const stats = cloneStats(row && row.stats);
        const resists = cloneResists(row && row.resists);
        const isArmor = isArmorRow(row);
        const itemType = normalizeText(row && row.itemType);
        const rules = getQualityUpgradeRules(row && row.quality, isArmor);
        const steps = [];
        let levelsLeft = upgradesAvailable;
        let resistanceLevelsUsed = 0;
        let resistStatus = "not-required";

        const currentScore = calculateScore(row, normalizedRoleKey);

        if (upgradesAvailable <= 0) {
            return {
                roleKey: normalizedRoleKey,
                roleLabel: role.label,
                currentScore,
                projectedScore: currentScore,
                scoreGain: 0,
                upgradesAvailable: 0,
                levelsLeft: 0,
                steps: [],
                projectedStats: stats,
                projectedResists: resists,
                resistStatus: "maxed",
                supported: true
            };
        }

        if (itemType === "weapon" || itemType === "pet") {
            return {
                roleKey: normalizedRoleKey,
                roleLabel: role.label,
                currentScore,
                projectedScore: currentScore,
                scoreGain: 0,
                upgradesAvailable,
                levelsLeft: upgradesAvailable,
                steps: ["Weapon and pet damage upgrades use separate rules; stat-only max-upgrade simulation is not enabled for this slot yet."],
                projectedStats: stats,
                projectedResists: resists,
                resistStatus: "not-applicable",
                supported: false
            };
        }

        if (isArmor && plan.requireResists) {
            const resistValues = [resists.generic, resists.poison, resists.fire, resists.lightning];
            const hasAllResists = resistValues.every((value) => value !== 0);

            if (!hasAllResists) {
                resistStatus = "missing";
                steps.push("This armor is missing at least one resistance type, so it cannot follow the normal DPS resistance-cap plan.");
            } else {
                const required = getUpgradesRequiredForResists(rules.resistanceTarget, resists);
                const overcapSlotsLeft = Math.floor(maxLevel / 10) - Math.floor(currentLevel / 10);
                const overcapSlotsNeeded = resistValues.reduce((total, value) => {
                    return total + Math.max(0, rules.resistanceTarget - Math.max(value, 23));
                }, 0);

                if (required <= levelsLeft && overcapSlotsLeft >= overcapSlotsNeeded) {
                    resistanceLevelsUsed = required;
                    levelsLeft -= required;
                    resists.generic = Math.max(resists.generic, rules.resistanceTarget);
                    resists.poison = Math.max(resists.poison, rules.resistanceTarget);
                    resists.fire = Math.max(resists.fire, rules.resistanceTarget);
                    resists.lightning = Math.max(resists.lightning, rules.resistanceTarget);
                    resistStatus = required > 0 ? "cap-planned" : "already-capped";

                    if (required > 0) {
                        steps.push(`Spend about ${required} upgrade level${required === 1 ? "" : "s"} getting all four resistances to the ${rules.resistanceTarget} raw target first.`);
                    }
                } else {
                    resistStatus = "cannot-cap";
                    steps.push("There are not enough remaining upgrade levels/10-level resistance bumps to reach the normal resistance target. Treat this as a lower-priority DPS piece unless the rest of the stats are exceptional.");
                }
            }
        }

        function investIntoStats(statNames, label) {
            const investments = [];

            statNames.forEach((statName) => {
                if (levelsLeft <= 0) {
                    return;
                }

                const currentValue = Number(stats[statName] || 0);

                if (currentValue === 0) {
                    return;
                }

                const room = Math.max(0, rules.maxStat - currentValue);
                const amount = Math.max(0, Math.min(room, levelsLeft));

                if (amount <= 0) {
                    return;
                }

                stats[statName] = currentValue + amount;
                levelsLeft -= amount;
                investments.push({ statName, amount });
            });

            if (investments.length > 0) {
                const text = investments.map(({ statName, amount }) => {
                    return `${upgradeStatLabels[statName] || statName} +${amount}`;
                }).join(", ");

                steps.push(`${label}: ${text}.`);
            }
        }

        investIntoStats(plan.primary, "Then prioritize the main archetype stat(s)");
        investIntoStats(plan.secondary, "Use remaining levels on useful side stat(s)");

        if (levelsLeft > 0) {
            steps.push(`${levelsLeft} upgrade level${levelsLeft === 1 ? "" : "s"} remain after the modeled priorities; use those on a useful nonzero tertiary stat or the item's special weapon/pet stat if applicable.`);
        }

        const projectedRow = {
            ...row,
            stats,
            resists
        };
        const projectedScore = calculateScore(projectedRow, normalizedRoleKey);

        return {
            roleKey: normalizedRoleKey,
            roleLabel: role.label,
            currentScore,
            projectedScore,
            scoreGain: projectedScore - currentScore,
            upgradesAvailable,
            levelsLeft,
            resistanceLevelsUsed,
            steps,
            projectedStats: stats,
            projectedResists: resists,
            resistStatus,
            maxStat: rules.maxStat,
            resistanceTarget: rules.resistanceTarget,
            setBonus: rules.setBonus,
            supported: true
        };
    }

    /* =========================================================
       8. Hero Role Guessing
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
       9. Public API
    ========================================================= */

    window.dd1GearScoring = {
        getRole: getRole,
        getRoleOptions: getRoleOptions,
        normalizeRoleKey: normalizeRoleKey,
        guessRoleForHero: guessRoleForHero,
        getUpgradePlan: getUpgradePlan,
        getQualityUpgradeRules: getQualityUpgradeRules,
        getUpgradesRequiredForResists: getUpgradesRequiredForResists,
        simulateItemUpgrades: simulateItemUpgrades,
        scoreRow: scoreRow,
        scoreRows: scoreRows
    };
})();
