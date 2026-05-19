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
                goal: "Farm a Genie pet to help with mana generation and upgrading.",
                difficulty: "Nightmare",
                mode: "Campaign",
                risk: "High",
                reward: "High",
                reason: "You selected pets and do not have a Genie yet, so Coastal Bazaar is worth considering."
            };
        }

        if (!account.hasSeahorse && account.towerDamage >= 3500) {
            return {
                name: "Aquanos",
                goal: "Clear Aquanos and farm a Seahorse for strong DPS.",
                difficulty: "Nightmare",
                mode: "Campaign/Survival",
                risk: "High",
                reward: "Very High",
                reason: "You selected pets and do not have a Seahorse yet, so Aquanos is a good DPS pet goal."
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