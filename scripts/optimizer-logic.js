/* =========================================================
   1. Basic Progression Helpers
========================================================= */

function determineExperience(level) {
    return level >= 74;
}


function determineProgression(level, towerDamage, experiencedPlayer) {
    if (level < 20) {
        return "First Hero + Main Campaign";
    }

    if (level < 31) {
        return "Raining Goblins";
    }

    if (level < 50) {
        return "Deeper Well Survival";
    }

    if (level < 72) {
        if (experiencedPlayer) {
            return "Tinkerer's Lab to 72";
        }

        return "Insane Campaign";
    }

    if (level < 74) {
        return "Tinkerer's Lab to 74";
    }

    if (towerDamage < 500) {
        return "Moonbase Insane for Fish";
    }

    if (towerDamage < 1000) {
        return "First Nightmare Campaign Clear";
    }

    if (towerDamage < 2500) {
        if (level < 78) {
            return "King's Game Pre-78";
        }

        return "King's Game 78+";
    }

    if (towerDamage < 3000) {
        return "Balanced Nightmare Progression";
    }

    if (towerDamage < 3500) {
        return "Arcane or Coastal";
    }

    if (towerDamage < 4000) {
        return "Aquanos or Sky City";
    }

    if (towerDamage < 5000) {
        return "Moonbase NMHC or Deep Survival";
    }

    if (towerDamage < 6500) {
        return "Tavern Defense or Akatiti Jungle";
    }

    if (towerDamage < 8000) {
        return "Lab Assault or Harder Maps";
    }

    return "Infested Ruins and Beyond";
}


/* =========================================================
   2. Main Goal-Based Recommendation Logic
========================================================= */

function chooseGoalRecommendation(stepName, stepData, account) {
    const goal = account.mainGoal;

    if (goal === "pets") {
        if (!account.hasFish && account.level >= 74) {
            return {
                name: "Moonbase",
                goal: "Farm Fish in a Bowl pets for your builders.",
                difficulty: "Insane",
                mode: "Campaign",
                risk: "Medium",
                reward: "High",
                reason: "You selected pets and do not have a Fish in a Bowl yet, so Moonbase is a strong pet priority."
            };
        }

        if (!account.hasGenie && account.towerDamage >= 2500) {
            return {
                name: "Coastal Bazaar",
                goal: "Farm a Genie pet while also working on strong gear progression.",
                difficulty: "Nightmare",
                mode: "Campaign/Survival",
                risk: "High",
                reward: "High",
                reason: "You selected pets and do not have a Genie yet. Coastal Bazaar is useful because it can help with both Genie progression and gear."
            };
        }

        if (!account.hasSeahorse && !account.hasHarpoonPet && account.towerDamage >= 2500) {
            return {
                name: "Harpoon Pet or Seahorse",
                goal: "Farm a strong DPS pet. Harpoon Pet is easier to get early by lowering difficulty, while Seahorse is stronger for single-target DPS later.",
                difficulty: "Hard to Nightmare",
                mode: "Campaign/Survival",
                risk: "Medium",
                reward: "High",
                reason: "You selected pets and do not have a major DPS pet yet, so Harpoon Pet or Seahorse should be a priority."
            };
        }

        if (!account.hasSeahorse && account.towerDamage >= 3500) {
            return {
                name: "Aquanos",
                goal: "Clear Aquanos and farm a Seahorse for strong single-target DPS.",
                difficulty: "Nightmare",
                mode: "Campaign/Survival",
                risk: "High",
                reward: "Very High",
                reason: "You selected pets and do not have a Seahorse yet. Seahorse is still one of the best single-target DPS pet goals."
            };
        }

        if (!account.hasHarpoonPet && account.towerDamage >= 2500) {
            return {
                name: "Harpoon Pet",
                goal: "Farm a Harpoon Pet for strong wave clear. It is not as strong as Seahorse for single target, but it tears through waves and can be farmed earlier by lowering difficulty.",
                difficulty: "Hard to Nightmare",
                mode: "Campaign/Survival",
                risk: "Medium",
                reward: "High wave-clear DPS",
                reason: "You selected pets and do not have a Harpoon Pet yet, so it is a good alternate DPS pet path."
            };
        }

        if (!account.hasPropellerCat && account.towerDamage >= 3500) {
            return {
                name: "Sky City",
                goal: "Clear Sky City and work toward a Propeller Cat.",
                difficulty: "Nightmare Hardcore",
                mode: "Campaign",
                risk: "High",
                reward: "Very High",
                reason: "You selected pets and do not have a Propeller Cat yet, so Sky City is a useful later pet goal."
            };
        }
    }

    if (goal === "achievements" || goal === "100%") {
        return {
            name: "Achievement Cleanup",
            goal: "Work on missing campaign clears, challenges, survival, pets, and checklist progress.",
            difficulty: "Varies",
            mode: "Achievement Cleanup",
            risk: "Medium",
            reward: "Completion Progress",
            reason: "You selected achievements or 100% completion, so the optimizer is prioritizing checklist progress."
        };
    }

    if (goal === "gear") {
        const mainRouteText = `${stepName} ${stepData.goal} ${stepData.mode}`.toLowerCase();

        if (
            mainRouteText.includes("gear") ||
            mainRouteText.includes("armor") ||
            mainRouteText.includes("survival") ||
            mainRouteText.includes("transcendent") ||
            mainRouteText.includes("mythical") ||
            mainRouteText.includes("accessories")
        ) {
            return {
                name: stepName,
                goal: stepData.goal,
                difficulty: stepData.difficulty,
                mode: stepData.mode,
                risk: stepData.risk,
                reward: stepData.reward,
                reason: "You selected gear, and the main route already focuses on gear or survival farming."
            };
        }
    }

    return {
        name: stepName,
        goal: stepData.goal,
        difficulty: stepData.difficulty,
        mode: stepData.mode,
        risk: stepData.risk,
        reward: stepData.reward,
        reason: "The optimizer is keeping you on the main progression route."
    };
}


/* =========================================================
   3. Other Recommended Options Logic
========================================================= */

function chooseOtherRecommendations(stepName, recommendation, account) {
    const options = [];
    const usedNames = [stepName, recommendation.name];

    function addOption(name, reason) {
        if (!progressionData[name]) {
            return;
        }

        if (usedNames.includes(name)) {
            return;
        }

        if (options.some((option) => option.name === name)) {
            return;
        }

        options.push({
            name: name,
            reason: reason,
            data: progressionData[name]
        });
    }

    if (account.mainGoal === "pets") {
        if (!account.hasFish && account.level >= 74) {
            addOption("Moonbase Insane for Fish", "Useful if you still need stronger Fish in a Bowl pets for builders.");
        }

        if ((!account.hasSeahorse || !account.hasHarpoonPet) && account.towerDamage >= 2500) {
            addOption("Aquanos or Sky City", "Useful for DPS pet progression. Seahorse is stronger single-target, while Harpoon Pet is easier earlier and better for wave clear.");
        }

        if (!account.hasPropellerCat && account.towerDamage >= 3500) {
            addOption("Aquanos or Sky City", "Good if you want another major DPS pet path after your first choice.");
        }
    }

    if (account.mainGoal === "gear") {
        if (account.towerDamage >= 1500 && account.towerDamage < 3000) {
            addOption("King's Game 78+", "Strong midgame survival option for pushing toward better armor.");
            addOption("Dread Dungeon", "Good backup option if King's Game survival feels too hard.");
        }

        if (account.towerDamage >= 3000 && account.towerDamage < 4000) {
            addOption("Arcane or Coastal", "Coastal is a strong gear map similar to King's Game, while Arcane is useful for accessories and support farming.");
            addOption("Aquanos or Sky City", "Good next step if you want pet progression while still improving gear.");
        }

        if (account.towerDamage >= 4000) {
            addOption("Moonbase NMHC or Deep Survival", "Useful for stronger late Nightmare farming and deeper survival progression.");
            addOption("Tavern Defense or Akatiti Jungle", "Good harder-map option once your roster feels ready.");
        }
    }

    if (account.mainGoal === "achievements" || account.mainGoal === "100%") {
        addOption(stepName, "Stay on your current progression route while cleaning up achievements.");
        addOption("Balanced Nightmare Progression", "Useful if you need stronger stats before harder achievement cleanup.");
        addOption("Moonbase NMHC or Deep Survival", "Good long-term farming path for survival and account strength.");
    }

    if (account.mainGoal === "leveling") {
        addOption(stepName, "Stay on your current main leveling route.");
        addOption("Tinkerer's Lab to 74", "Useful if you still need to push heroes into early Nightmare levels.");
        addOption("King's Game Pre-78", "Good transition route before stronger survival farming.");
    }

    if (options.length === 0) {
        addOption("Balanced Nightmare Progression", "Safe backup route if the main recommendation feels too hard.");
        addOption("Arcane or Coastal", "Good side route for accessories, pets, and general account progression.");
    }

    return options.slice(0, 3);
}


/* =========================================================
   4. Role Helper Functions
========================================================= */

function hasAnyRole(heroes, roleNames) {
    return heroes.some((hero) => {
        const role = hero.role.toLowerCase();

        return roleNames.some((roleName) => {
            return role === roleName.toLowerCase();
        });
    });
}


function getBestStat(heroes, statName, allowedRoles) {
    let bestValue = 0;

    heroes.forEach((hero) => {
        const role = hero.role.toLowerCase();

        if (allowedRoles.includes(role) && hero[statName] > bestValue) {
            bestValue = hero[statName];
        }
    });

    return bestValue;
}


function getHeroesByRole(heroes, roleNames) {
    return heroes.filter((hero) => {
        const role = hero.role.toLowerCase();

        return roleNames.some((roleName) => {
            return role === roleName.toLowerCase();
        });
    });
}


/* =========================================================
   5. Account Review Logic
========================================================= */

function escapeAccountReviewText(value) {
    const element = document.createElement("div");
    element.textContent = String(value);
    return element.innerHTML;
}


function getAccountReviewStat(hero, statName) {
    const value = Number(hero[statName]);

    if (!Number.isFinite(value)) {
        return 0;
    }

    return value;
}


function formatAccountReviewNumber(value) {
    return Number(value).toLocaleString();
}


function shouldReviewAccountStat(hero, value) {
    return hero.imported || value !== 0;
}


function getAccountReviewHeroHeading(hero, index) {
    const heroName = String(hero.name || "").trim() || `Hero ${index + 1}`;
    const className = hero.className || "Unknown Class";
    const role = hero.role || "No role";

    return `
        <strong>${escapeAccountReviewText(heroName)}</strong>
        —
        ${escapeAccountReviewText(className)},
        ${escapeAccountReviewText(role)}
    `;
}


function buildAccountReview(account) {
    const notes = [];

    const hasBuilder = hasAnyRole(account.heroes, [
        "Builder",
        "Hybrid",
        "Aura Monk",
        "Trap Huntress",
        "Beam EV",
        "Minion Summoner"
    ]);

    const hasWalls = hasAnyRole(account.heroes, [
        "Waller",
        "Waller Summoner"
    ]);

    const hasDps = hasAnyRole(account.heroes, [
        "DPS",
        "Hybrid"
    ]);

    const hasBeamEv = hasAnyRole(
        account.heroes,
        ["Beam EV"]
    );

    const hasWallerSummoner = hasAnyRole(
        account.heroes,
        ["Waller Summoner"]
    );

    const hasBoostMonk = hasAnyRole(
        account.heroes,
        ["Boost Monk"]
    );

    const hasMinionSummoner = hasAnyRole(
        account.heroes,
        ["Minion Summoner", "Waller Summoner"]
    );

    const hasUpgradeInitiate = hasAnyRole(
        account.heroes,
        ["Upgrade Initiate"]
    );

    if (!hasBuilder) {
        notes.push(
            "No clear builder role was detected. Add a Builder, Hybrid, Aura Monk, Trap Huntress, Beam EV, or Minion Summoner for better recommendations."
        );
    }

    if (!hasWalls) {
        notes.push(
            "No wall role was detected. A Waller or Waller Summoner becomes more important as you push harder Nightmare maps."
        );
    }

    if (!hasDps) {
        notes.push(
            "No hero is marked as DPS or Hybrid. Marking one helps the optimizer judge boss damage and survivability."
        );
    }

    account.heroes.forEach((hero, index) => {
        const role = String(hero.role || "").toLowerCase();
        const improvements = [];
        let explanation = "";

        if (
            account.towerDamage >= 1500 &&
            (
                role === "waller" ||
                role === "waller summoner"
            )
        ) {
            const towerHealth = getAccountReviewStat(
                hero,
                "towerHealth"
            );

            const wallHealthTarget = account.towerDamage >= 2500
                ? 1200
                : 1000;

            if (
                shouldReviewAccountStat(hero, towerHealth) &&
                towerHealth < wallHealthTarget
            ) {
                improvements.push(
                    `Tower Health ${formatAccountReviewNumber(towerHealth)} → ${formatAccountReviewNumber(wallHealthTarget)}+`
                );
            }

            if (role === "waller summoner") {
                const towerDamage = getAccountReviewStat(
                    hero,
                    "towerDamage"
                );

                const towerRange = getAccountReviewStat(
                    hero,
                    "towerRange"
                );

                const towerRate = getAccountReviewStat(
                    hero,
                    "towerRate"
                );

                if (
                    shouldReviewAccountStat(hero, towerDamage) &&
                    towerDamage < 800
                ) {
                    improvements.push(
                        `Tower Damage ${formatAccountReviewNumber(towerDamage)} → 800+`
                    );
                }

                if (
                    shouldReviewAccountStat(hero, towerRange) &&
                    towerRange < 600
                ) {
                    improvements.push(
                        `Tower Range ${formatAccountReviewNumber(towerRange)} → 600+`
                    );
                }

                if (
                    shouldReviewAccountStat(hero, towerRate) &&
                    towerRate < 600
                ) {
                    improvements.push(
                        `Tower Rate ${formatAccountReviewNumber(towerRate)} → 600+`
                    );
                }

                explanation =
                    "These upgrades will make the minion wall stronger and help the minions contribute more damage and coverage.";
            } else {
                explanation =
                    "More Tower Health will help this wall survive harder Nightmare and survival waves.";
            }
        }

        if (
            account.level >= 78 &&
            (
                role === "dps" ||
                role === "hybrid"
            )
        ) {
            const heroDamage = getAccountReviewStat(
                hero,
                "heroDamage"
            );

            const heroHealth = getAccountReviewStat(
                hero,
                "heroHealth"
            );

            const heroSpeed = getAccountReviewStat(
                hero,
                "heroSpeed"
            );

            const lowestResistance = getAccountReviewStat(
                hero,
                "lowestResistance"
            );

            if (
                shouldReviewAccountStat(hero, heroDamage) &&
                heroDamage < 1000
            ) {
                improvements.push(
                    `Hero Damage ${formatAccountReviewNumber(heroDamage)} → 1,000+`
                );
            }

            if (
                shouldReviewAccountStat(hero, heroHealth) &&
                heroHealth < 700
            ) {
                improvements.push(
                    `Hero Health ${formatAccountReviewNumber(heroHealth)} → 700+`
                );
            }

            if (
                shouldReviewAccountStat(hero, heroSpeed) &&
                heroSpeed < 500
            ) {
                improvements.push(
                    `Hero Speed ${formatAccountReviewNumber(heroSpeed)} → 500+`
                );
            }

            if (
                shouldReviewAccountStat(hero, lowestResistance) &&
                lowestResistance < 70
            ) {
                improvements.push(
                    `Lowest Resistance ${formatAccountReviewNumber(lowestResistance)}% → 70%+`
                );
            }

            explanation =
                "Improving these stats will make boss fights and harder Nightmare maps more manageable.";
        }

        if (improvements.length > 0) {
            notes.push(`
                ${getAccountReviewHeroHeading(hero, index)}:
                Improve ${improvements.join("; ")}.
                ${explanation}
            `);
        }
    });

    if (
        account.towerDamage >= 1500 &&
        !hasWallerSummoner
    ) {
        notes.push(
            "A Waller Summoner would help with safer Nightmare progression and survival layouts."
        );
    }

    if (
        account.towerDamage >= 1500 &&
        !hasBeamEv
    ) {
        notes.push(
            "A Beam EV is worth building because buff beams become very important for Nightmare setups."
        );
    }

    if (
        account.towerDamage >= 2500 &&
        !hasBoostMonk
    ) {
        notes.push(
            "A Boost Monk becomes useful for boss maps, harder survivals, and tougher progression."
        );
    }

    if (
        account.towerDamage >= 2500 &&
        !hasMinionSummoner
    ) {
        notes.push(
            "A Minion Summoner is useful for minion-based defenses and safer survival layouts."
        );
    }

    if (
        account.towerDamage >= 3500 &&
        !hasUpgradeInitiate
    ) {
        notes.push(
            "An Upgrade Initiate can help with faster upgrading during harder survival waves."
        );
    }

    if (notes.length === 0) {
        notes.push(
            "No major roster weaknesses were detected from the current inputs."
        );
    }

    return notes;
}
