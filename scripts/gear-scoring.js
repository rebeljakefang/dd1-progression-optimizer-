/* =========================================================
   DD1 Gear Scoring

   Early role-based scoring for gear rows. This does not replace
   a full item-box optimizer yet. It gives the new gear page useful
   sorting and early gear review notes.
========================================================= */

(() => {
    "use strict";

    const roleDefinitions = {
        builderDamage: {
            label: "Builder Damage",
            description: "Prioritizes Tower Damage, then Tower Rate and Tower Range.",
            weights: {
                towerDamage: 1.25,
                towerRate: 0.75,
                towerRange: 0.55,
                towerHealth: 0.35,
                heroCasting: 0.15
            },
            resistWeight: 0.05
        },
        waller: {
            label: "Waller",
            description: "Prioritizes Tower Health with a small value for Tower Rate and resistances.",
            weights: {
                towerHealth: 1.4,
                towerRate: 0.3,
                towerDamage: 0.15,
                heroHealth: 0.1
            },
            resistWeight: 0.1
        },
        auraTrap: {
            label: "Aura / Trap Builder",
            description: "Balances Tower Damage, Tower Range, Tower Rate, and Tower Health.",
            weights: {
                towerDamage: 1.0,
                towerRange: 0.9,
                towerRate: 0.8,
                towerHealth: 0.65,
                heroCasting: 0.1
            },
            resistWeight: 0.04
        },
        boostMonk: {
            label: "Boost Monk",
            description: "Values Hero Damage, abilities, health, and casting for active play.",
            weights: {
                heroDamage: 1.0,
                ability1: 0.9,
                ability2: 0.9,
                heroHealth: 0.45,
                heroCasting: 0.3,
                heroSpeed: 0.15
            },
            resistWeight: 0.18
        },
        dps: {
            label: "DPS",
            description: "Prioritizes Hero Damage, Hero Health, Casting, and resistances.",
            weights: {
                heroDamage: 1.25,
                heroHealth: 0.55,
                heroCasting: 0.35,
                ability1: 0.3,
                ability2: 0.3,
                heroSpeed: 0.1
            },
            resistWeight: 0.2
        },
        abilityDps: {
            label: "Ability DPS",
            description: "Prioritizes Ability 1, Ability 2, Hero Damage, and survivability.",
            weights: {
                ability1: 1.0,
                ability2: 1.0,
                heroDamage: 0.65,
                heroHealth: 0.35,
                heroCasting: 0.3,
                heroSpeed: 0.1
            },
            resistWeight: 0.16
        },
        guardianSummoner: {
            label: "Guardian Summoner",
            description: "Prioritizes survivability and resistances for a Summoner used to hold guardians.",
            weights: {
                heroHealth: 1.0,
                heroCasting: 0.25,
                heroSpeed: 0.15,
                towerHealth: 0.1
            },
            resistWeight: 0.45
        },
        balanced: {
            label: "Balanced Review",
            description: "General-purpose score for mixed gear review.",
            weights: {
                towerDamage: 0.65,
                towerHealth: 0.55,
                towerRate: 0.45,
                towerRange: 0.45,
                heroDamage: 0.45,
                heroHealth: 0.35,
                ability1: 0.25,
                ability2: 0.25,
                heroCasting: 0.25
            },
            resistWeight: 0.08
        }
    };

    function getRoleOptions() {
        return Object.entries(roleDefinitions).map(([value, role]) => {
            return {
                value: value,
                label: role.label,
                description: role.description
            };
        });
    }

    function getRole(roleName) {
        return roleDefinitions[roleName] || roleDefinitions.builderDamage;
    }

    function getResistScore(row) {
        if (!row || !row.resists) {
            return 0;
        }

        return Number(row.resists.generic || 0) +
            Number(row.resists.poison || 0) +
            Number(row.resists.fire || 0) +
            Number(row.resists.lightning || 0);
    }

    function scoreItem(row, roleName) {
        const role = getRole(roleName);
        const stats = row.stats || {};
        let score = 0;

        Object.entries(role.weights).forEach(([statName, weight]) => {
            score += Number(stats[statName] || 0) * weight;
        });

        score += getResistScore(row) * Number(role.resistWeight || 0);

        if (row.itemType === "Accessory") {
            score *= 0.9;
        }

        if (row.itemType === "Pet" || row.itemType === "Weapon") {
            score *= 0.65;
        }

        return Math.round(score);
    }

    function getStrongestStats(row, roleName, limit = 3) {
        const role = getRole(roleName);
        const stats = row.stats || {};

        return Object.keys(role.weights)
            .map((statName) => {
                return {
                    statName: statName,
                    value: Number(stats[statName] || 0),
                    weighted: Number(stats[statName] || 0) * Number(role.weights[statName] || 0)
                };
            })
            .filter((entry) => {
                return entry.value !== 0;
            })
            .sort((first, second) => {
                return second.weighted - first.weighted;
            })
            .slice(0, limit);
    }

    function scoreRows(rows, roleName) {
        return rows.map((row) => {
            return {
                ...row,
                score: scoreItem(row, roleName),
                strongestStats: getStrongestStats(row, roleName)
            };
        });
    }

    function findGearNotes(rows, roleName, heroName = "all") {
        const scoredRows = scoreRows(rows, roleName);
        const role = getRole(roleName);
        const filteredRows = heroName === "all"
            ? scoredRows
            : scoredRows.filter((row) => {
                return row.equippedHero === heroName;
            });

        if (filteredRows.length === 0) {
            return [
                {
                    type: "empty",
                    title: "No matching gear yet",
                    text: "Load a save file or adjust the filters to see gear notes."
                }
            ];
        }

        const lowestRows = [...filteredRows]
            .sort((first, second) => {
                return first.score - second.score;
            })
            .slice(0, 5);

        const highestRows = [...filteredRows]
            .sort((first, second) => {
                return second.score - first.score;
            })
            .slice(0, 3);

        const notes = [];

        notes.push({
            type: "info",
            title: role.label,
            text: role.description
        });

        lowestRows.forEach((row) => {
            notes.push({
                type: "warning",
                title: `${row.equippedHero}: review ${row.itemType}`,
                text: `${row.name} has a ${role.label} score of ${row.score}. This is one of the lower-scoring equipped items in the current view.`
            });
        });

        if (highestRows.length > 0) {
            notes.push({
                type: "success",
                title: "Strongest equipped pieces in this view",
                text: highestRows.map((row) => {
                    return `${row.equippedHero} ${row.itemType}: ${row.name} (${row.score})`;
                }).join(" | ")
            });
        }

        notes.push({
            type: "todo",
            title: "Next optimizer step",
            text: "After the item-box reader is ported, these low-scoring equipped pieces can be compared against unequipped inventory items for real replacement recommendations."
        });

        return notes;
    }

    window.dd1GearScoring = {
        getRoleOptions: getRoleOptions,
        getRole: getRole,
        scoreItem: scoreItem,
        scoreRows: scoreRows,
        findGearNotes: findGearNotes,
        getStrongestStats: getStrongestStats
    };
})();
