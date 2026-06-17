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

function getUsableHeroes(heroes) {
    return heroes.filter((hero) => !hero.ignored);
}


function hasAnyRole(heroes, roleNames) {
    return getUsableHeroes(heroes).some((hero) => {
        const role = String(hero.role || "").toLowerCase();

        return roleNames.some((roleName) => {
            return role === roleName.toLowerCase();
        });
    });
}


function getBestStat(heroes, statName, allowedRoles) {
    let bestValue = 0;

    getUsableHeroes(heroes).forEach((hero) => {
        const role = String(hero.role || "").toLowerCase();

        if (
            allowedRoles.includes(role) &&
            hero[statName] > bestValue
        ) {
            bestValue = hero[statName];
        }
    });

    return bestValue;
}


function getHeroesByRole(heroes, roleNames) {
    return getUsableHeroes(heroes).filter((hero) => {
        const role = String(hero.role || "").toLowerCase();

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


function addReviewTarget(improvements, label, currentValue, targetValue, suffix = "") {
    if (currentValue < targetValue) {
        improvements.push(
            `${label} ${formatAccountReviewNumber(currentValue)}${suffix} → ${formatAccountReviewNumber(targetValue)}${suffix}+`
        );
    }
}


function addResistanceTarget(improvements, hero) {
    addReviewTarget(
        improvements,
        "Lowest Resistance",
        getAccountReviewStat(hero, "lowestResistance"),
        70,
        "%"
    );
}


function addHeroSpeedTarget(improvements, hero) {
    addReviewTarget(
        improvements,
        "Hero Speed",
        getAccountReviewStat(hero, "heroSpeed"),
        100
    );
}


function buildAccountReview(account) {
    const notes = [];
    const activeHeroes = getUsableHeroes(account.heroes);

    const hasBuilder = hasAnyRole(activeHeroes, [
        "Builder",
        "Hybrid",
        "Aura Monk",
        "Trap Huntress",
        "Beam EV",
        "Minion Summoner"
    ]);

    const hasWalls = hasAnyRole(activeHeroes, [
        "Waller",
        "Waller Summoner"
    ]);

    const hasDps = hasAnyRole(activeHeroes, [
        "DPS",
        "Ability DPS",
        "Damage Summoner",
        "Hybrid"
    ]);

    const hasBeamEv = hasAnyRole(activeHeroes, ["Beam EV"]);
    const hasWallerSummoner = hasAnyRole(activeHeroes, ["Waller Summoner"]);
    const hasBoostMonk = hasAnyRole(activeHeroes, ["Boost Monk"]);
    const hasMinionSummoner = hasAnyRole(activeHeroes, ["Minion Summoner", "Waller Summoner"]);
    const hasUpgradeInitiate = hasAnyRole(activeHeroes, ["Upgrade Initiate"]);

    if (!hasBuilder) {
        notes.push(
            "No clear builder role was detected among the heroes that are not ignored."
        );
    }

    if (!hasWalls) {
        notes.push(
            "No wall role was detected. A Waller or Waller Summoner becomes more important on harder Nightmare maps."
        );
    }

    if (!hasDps) {
        notes.push(
            "No active hero is marked as DPS, Ability DPS, Damage Summoner, or Hybrid."
        );
    }

    activeHeroes.forEach((hero, index) => {
        const role = String(hero.role || "").toLowerCase();
        const improvements = [];
        let explanation = "";
        let informationOnly = "";

        if (role === "builder") {
            addReviewTarget(improvements, "Tower Damage", getAccountReviewStat(hero, "towerDamage"), 1000);
            addReviewTarget(improvements, "Tower Rate", getAccountReviewStat(hero, "towerRate"), 600);
            addReviewTarget(improvements, "Tower Range", getAccountReviewStat(hero, "towerRange"), 600);
            addReviewTarget(improvements, "Tower Health", getAccountReviewStat(hero, "towerHealth"), 500);
            explanation = "These are general builder targets; the exact priority still depends on the class and defenses used.";
        }

        if (role === "waller") {
            addReviewTarget(improvements, "Tower Health", getAccountReviewStat(hero, "towerHealth"), 1200);
            explanation = "Tower Health is the main priority for a waller.";
        }

        if (role === "waller summoner") {
            addReviewTarget(improvements, "Tower Health", getAccountReviewStat(hero, "towerHealth"), 1200);
            addReviewTarget(improvements, "Tower Damage", getAccountReviewStat(hero, "towerDamage"), 600);
            addReviewTarget(improvements, "Tower Range", getAccountReviewStat(hero, "towerRange"), 500);
            addReviewTarget(improvements, "Tower Rate", getAccountReviewStat(hero, "towerRate"), 500);
            explanation = "Tower Health is the main wall stat; the other minion stats help the wall contribute damage and coverage.";
        }

        if (role === "minion summoner") {
            addReviewTarget(improvements, "Tower Damage", getAccountReviewStat(hero, "towerDamage"), 1000);
            addReviewTarget(improvements, "Tower Rate", getAccountReviewStat(hero, "towerRate"), 600);
            addReviewTarget(improvements, "Tower Range", getAccountReviewStat(hero, "towerRange"), 600);
            addReviewTarget(improvements, "Tower Health", getAccountReviewStat(hero, "towerHealth"), 600);
            explanation = "These stats improve minion damage, attack speed, coverage, and survivability.";
        }

        if (role === "guardian summoner") {
            addReviewTarget(improvements, "Hero Health", getAccountReviewStat(hero, "heroHealth"), 1000);
            addResistanceTarget(improvements, hero);
            explanation = "Guardian Summoners only need enough Hero Health and resistances to stay alive while supporting defenses.";
        }

        if (role === "damage summoner") {
            informationOnly = "Detailed Damage Summoner evaluation is not available yet because weapon and pet damage still need to be read and analyzed.";
        }

        if (role === "dps") {
            addReviewTarget(improvements, "Hero Damage", getAccountReviewStat(hero, "heroDamage"), 1000);
            addReviewTarget(improvements, "Hero Health", getAccountReviewStat(hero, "heroHealth"), 700);
            addResistanceTarget(improvements, hero);
            addHeroSpeedTarget(improvements, hero);
            explanation = "These stats improve normal hero damage and survivability. Hero Speed is capped at 100.";
        }

        if (role === "ability dps") {
            const primaryAbility = Math.max(
                getAccountReviewStat(hero, "ability1"),
                getAccountReviewStat(hero, "ability2")
            );

            addReviewTarget(improvements, "Primary Ability", primaryAbility, 1000);
            addReviewTarget(improvements, "Hero Health", getAccountReviewStat(hero, "heroHealth"), 700);
            addResistanceTarget(improvements, hero);
            addHeroSpeedTarget(improvements, hero);
            explanation = "Only the stronger of the two ability stats is used because some builds rely mainly on one ability.";
        }

        if (role === "boost monk") {
            addReviewTarget(improvements, "Ability 1", getAccountReviewStat(hero, "ability1"), 1000);
            addReviewTarget(improvements, "Ability 2", getAccountReviewStat(hero, "ability2"), 1000);
            addReviewTarget(improvements, "Hero Health", getAccountReviewStat(hero, "heroHealth"), 700);
            addResistanceTarget(improvements, hero);
            addHeroSpeedTarget(improvements, hero);
            explanation = "Boost Monk recommendations focus on boost abilities and staying alive, not Hero Damage.";
        }

        if (role === "upgrade initiate") {
            addReviewTarget(improvements, "Hero Casting", getAccountReviewStat(hero, "heroCasting"), 500);
            addReviewTarget(improvements, "Hero Health", getAccountReviewStat(hero, "heroHealth"), 700);
            addResistanceTarget(improvements, hero);
            addHeroSpeedTarget(improvements, hero);
            explanation = "Upgrade Initiates are judged on upgrading speed and survivability, not Hero Damage.";
        }

        if (role === "aura monk") {
            addReviewTarget(improvements, "Tower Range", getAccountReviewStat(hero, "towerRange"), 1000);
            addReviewTarget(improvements, "Tower Damage", getAccountReviewStat(hero, "towerDamage"), 1000);
            addReviewTarget(improvements, "Tower Rate", getAccountReviewStat(hero, "towerRate"), 600);
            addReviewTarget(improvements, "Tower Health", getAccountReviewStat(hero, "towerHealth"), 600);
            explanation = "Aura Range and Damage are the main priorities, followed by rate and health.";
        }

        if (role === "beam ev") {
            addReviewTarget(improvements, "Tower Damage", getAccountReviewStat(hero, "towerDamage"), 1000);
            addReviewTarget(improvements, "Tower Health", getAccountReviewStat(hero, "towerHealth"), 800);
            explanation = "Beam EV recommendations focus mainly on buff strength and beam durability.";
        }

        if (role === "trap huntress") {
            addReviewTarget(improvements, "Tower Damage", getAccountReviewStat(hero, "towerDamage"), 1000);
            addReviewTarget(improvements, "Tower Range", getAccountReviewStat(hero, "towerRange"), 600);
            addReviewTarget(improvements, "Tower Rate", getAccountReviewStat(hero, "towerRate"), 600);
            addReviewTarget(improvements, "Tower Health", getAccountReviewStat(hero, "towerHealth"), 600);
            explanation = "These stats improve trap damage, coverage, reset speed, and charge count.";
        }

        if (role === "hybrid") {
            addReviewTarget(improvements, "Tower Damage", getAccountReviewStat(hero, "towerDamage"), 800);
            addReviewTarget(improvements, "Hero Damage", getAccountReviewStat(hero, "heroDamage"), 800);
            addReviewTarget(improvements, "Hero Health", getAccountReviewStat(hero, "heroHealth"), 600);
            addResistanceTarget(improvements, hero);
            explanation = "Hybrid targets are intentionally moderate because the hero is splitting stats between two jobs.";
        }

        if (improvements.length > 0) {
            notes.push(`
                ${getAccountReviewHeroHeading(hero, index)}:
                Improve ${improvements.join("; ")}.
                ${explanation}
            `);
        } else if (informationOnly) {
            notes.push(`
                ${getAccountReviewHeroHeading(hero, index)}:
                ${informationOnly}
            `);
        }
    });

    if (account.towerDamage >= 1500 && !hasWallerSummoner) {
        notes.push(
            "A Waller Summoner can help with safer Nightmare progression and survival layouts."
        );
    }

    if (account.towerDamage >= 1500 && !hasBeamEv) {
        notes.push(
            "A Beam EV is worth building because buff beams become important for Nightmare setups."
        );
    }

    if (account.towerDamage >= 2500 && !hasBoostMonk) {
        notes.push(
            "A Boost Monk becomes useful for boss maps and harder survivals."
        );
    }

    if (account.towerDamage >= 2500 && !hasMinionSummoner) {
        notes.push(
            "A Minion Summoner is useful for minion defenses and safer survival layouts."
        );
    }

    if (account.towerDamage >= 3500 && !hasUpgradeInitiate) {
        notes.push(
            "An Upgrade Initiate can help with faster upgrading during harder survival waves."
        );
    }

    if (notes.length === 0) {
        notes.push(
            "No major roster weaknesses were detected from the active heroes."
        );
    }

    return notes;
}

