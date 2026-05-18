const progressionData = {
  "First Hero + Main Campaign": {
    goal: "Clear the main campaign and unlock maps.",
    difficulty: "Easy/Medium/Hard",
    mode: "Campaign",
    risk: "Low",
    reward: "Low",
    nextStep: "Raining Goblins"
  },

  "Raining Goblins": {
    goal: "Farm early gear and levels before moving into stronger progression steps.",
    difficulty: "Nightmare",
    mode: "Challenge",
    risk: "Low",
    reward: "Medium",
    nextStep: "Deeper Well Survival"
  },

  "Deeper Well Survival": {
    goal: "Get a Nessie pet to improve early progression.",
    difficulty: "Easy",
    mode: "Survival",
    risk: "Low",
    reward: "Medium",
    nextStep: "Insane Campaign"
  },

  "Insane Campaign": {
    goal: "Complete the campaign on Insane to learn maps and prepare for faster progression.",
    difficulty: "Insane",
    mode: "Campaign",
    risk: "Medium",
    reward: "Medium",
    nextStep: "Tinkerer's Lab to 72"
  },

  "Tinkerer's Lab to 72": {
    goal: "Use Tinkerer's Lab wave 1 to level quickly until level 72.",
    difficulty: "Nightmare Hardcore",
    mode: "Campaign",
    risk: "Medium",
    reward: "High",
    nextStep: "Tinkerer's Lab to 74"
  },

  "Tinkerer's Lab to 74": {
    goal: "Farm Tinkerer's Lab wave 1 for Mythical gear and experience until level 74.",
    difficulty: "Nightmare Hardcore",
    mode: "Campaign",
    risk: "Medium",
    reward: "High",
    nextStep: "Moonbase Insane for Fish"
  },

  "Moonbase Insane for Fish": {
    goal: "Get Fish in a Bowl pets for your builders.",
    difficulty: "Insane",
    mode: "Campaign",
    risk: "Medium",
    reward: "High",
    nextStep: "First Nightmare Campaign Clear"
  },

  "First Nightmare Campaign Clear": {
    goal: "Get your first stronger Nightmare campaign clear.",
    difficulty: "Nightmare",
    mode: "Campaign",
    risk: "Medium",
    reward: "High",
    nextStep: "King's Game Pre-78"
  },

  "King's Game Pre-78": {
    goal: "Farm King's Game as much as you can using armor you can actually equip.",
    difficulty: "Nightmare",
    mode: "Campaign/Survival",
    risk: "Medium",
    reward: "High",
    nextStep: "King's Game 78+"
  },

  "King's Game 78+": {
    goal: "Push higher King's Game survival waves so Transcendent gear can start appearing.",
    difficulty: "Nightmare",
    mode: "Survival",
    risk: "Medium",
    reward: "Very High",
    nextStep: "Balanced Nightmare Progression"
  },

  "Balanced Nightmare Progression": {
    goal: "Balance armor, DPS weapons, and support pets before harder maps.",
    difficulty: "Nightmare",
    mode: "Campaign/Survival",
    risk: "Medium",
    reward: "High",
    nextStep: "Arcane or Coastal"
  },

  "Arcane or Coastal": {
    goal: "Push into Arcane Library or Coastal Bazaar as your next harder campaign stage.",
    difficulty: "Nightmare",
    mode: "Campaign",
    risk: "High",
    reward: "High",
    nextStep: "Aquanos or Sky City"
  },

  "Aquanos or Sky City": {
    goal: "Pick your next major DPS pet milestone.",
    difficulty: "Nightmare",
    mode: "Campaign/Survival",
    risk: "High",
    reward: "Very High",
    nextStep: "Moonbase NMHC or Deep Survival"
  },

  "Moonbase NMHC or Deep Survival": {
    goal: "Refine your build with better Fish pets or stronger armor scaling.",
    difficulty: "Nightmare Hardcore",
    mode: "Campaign/Survival",
    risk: "High",
    reward: "Very High",
    nextStep: "Tavern Defense or Akatiti Jungle"
  },

  "Tavern Defense or Akatiti Jungle": {
    goal: "Choose whether you want to optimize armor or DPS next.",
    difficulty: "Nightmare",
    mode: "Campaign/Survival",
    risk: "High",
    reward: "Very High",
    nextStep: "Lab Assault or Harder Maps"
  },

  "Lab Assault or Harder Maps": {
    goal: "Fix what your build is still missing, usually accessories or raw stats.",
    difficulty: "Nightmare/Ruthless",
    mode: "Campaign/Challenge",
    risk: "High",
    reward: "Very High",
    nextStep: "Infested Ruins and Beyond"
  },

  "Infested Ruins and Beyond": {
    goal: "Begin pushing into Ruthless or start serious achievement cleanup.",
    difficulty: "Nightmare/Ruthless",
    mode: "Campaign/Survival",
    risk: "Very High",
    reward: "Very High",
    nextStep: "Ruthless Progression or Achievement Cleanup"
  }
};

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

function buildAccountFromForm() {
  const level = Number(document.querySelector("#hero-level").value);
  const towerDamage = Number(document.querySelector("#tower-damage").value);

  return {
    level: level,
    towerDamage: towerDamage,
    experiencedPlayer: determineExperience(level),
    mainGoal: document.querySelector("#main-goal").value,
    hasGenie: document.querySelector("#has-genie").checked,
    hasFish: document.querySelector("#has-fish").checked,
    hasSeahorse: document.querySelector("#has-seahorse").checked,
    hasPropellerCat: document.querySelector("#has-propeller-cat").checked
  };
}

function renderResults(recommendation, stepName, stepData) {
  const results = document.querySelector("#results");

  results.innerHTML = `
    <div class="card-content">
      <h2>Recommendation</h2>

      <div class="result-grid">
        <div class="result-box">
          <h3>Goal-Based Recommendation</h3>
          <p>${recommendation.reason}</p>
          <p><strong>Recommended Step:</strong> ${recommendation.name}</p>
          <p><strong>Goal:</strong> ${recommendation.goal}</p>
          <p><strong>Difficulty:</strong> ${recommendation.difficulty}</p>
          <p><strong>Mode:</strong> ${recommendation.mode}</p>
          <p><strong>Risk:</strong> ${recommendation.risk}</p>
          <p><strong>Reward:</strong> ${recommendation.reward}</p>
        </div>

        <div class="result-box">
          <h3>Main Route</h3>
          <p><strong>Map:</strong> ${stepName}</p>
          <p><strong>Goal:</strong> ${stepData.goal}</p>
          <p><strong>Difficulty:</strong> ${stepData.difficulty}</p>
          <p><strong>Mode:</strong> ${stepData.mode}</p>
          <p><strong>Risk:</strong> ${stepData.risk}</p>
          <p><strong>Reward:</strong> ${stepData.reward}</p>
          <p><strong>Next Step:</strong> ${stepData.nextStep}</p>
        </div>
      </div>
    </div>
  `;
}

function handleOptimizerSubmit(event) {
  event.preventDefault();

  const account = buildAccountFromForm();

  const stepName = determineProgression(
    account.level,
    account.towerDamage,
    account.experiencedPlayer
  );

  const stepData = progressionData[stepName];
  const recommendation = chooseGoalRecommendation(stepName, stepData, account);

  renderResults(recommendation, stepName, stepData);
}

const optimizerForm = document.querySelector("#optimizer-form");

if (optimizerForm) {
  optimizerForm.addEventListener("submit", handleOptimizerSubmit);
}