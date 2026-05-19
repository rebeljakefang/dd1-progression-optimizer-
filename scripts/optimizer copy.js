function getNumberValue(selector) {
    const value = Number(document.querySelector(selector).value);

    if (Number.isNaN(value)) {
        return 0;
    }

    return value;
}


function buildHeroRosterFromForm() {
    const heroes = [];

    for (let i = 1; i <= 3; i++) {
        const className = document.querySelector(`#hero-${i}-class`).value;
        const role = document.querySelector(`#hero-${i}-role`).value;
        const level = getNumberValue(`#hero-${i}-level`);
        const towerDamage = getNumberValue(`#hero-${i}-tower-damage`);
        const heroDamage = getNumberValue(`#hero-${i}-hero-damage`);

        if (className !== "" || role !== "" || level > 0 || towerDamage > 0 || heroDamage > 0) {
            heroes.push({
                className: className,
                role: role,
                level: level,
                towerDamage: towerDamage,
                heroDamage: heroDamage
            });
        }
    }

    return heroes;
}


function getHighestHeroLevel(heroes, fallbackLevel) {
    let highestLevel = fallbackLevel;

    heroes.forEach((hero) => {
        if (hero.level > highestLevel) {
            highestLevel = hero.level;
        }
    });

    return highestLevel;
}


function getBestBuilderDamage(heroes, fallbackTowerDamage) {
    let bestTowerDamage = fallbackTowerDamage;

    heroes.forEach((hero) => {
        const role = hero.role.toLowerCase();

        if (
            role === "builder" ||
            role === "waller" ||
            role === "hybrid" ||
            role === "support"
        ) {
            if (hero.towerDamage > bestTowerDamage) {
                bestTowerDamage = hero.towerDamage;
            }
        }
    });

    return bestTowerDamage;
}


function getBestDpsDamage(heroes) {
    let bestHeroDamage = 0;

    heroes.forEach((hero) => {
        const role = hero.role.toLowerCase();

        if (role === "dps" || role === "hybrid") {
            if (hero.heroDamage > bestHeroDamage) {
                bestHeroDamage = hero.heroDamage;
            }
        }
    });

    return bestHeroDamage;
}


function buildAccountFromForm() {
    const fallbackLevel = getNumberValue("#hero-level");
    const fallbackTowerDamage = getNumberValue("#tower-damage");
    const heroes = buildHeroRosterFromForm();

    const level = getHighestHeroLevel(heroes, fallbackLevel);
    const towerDamage = getBestBuilderDamage(heroes, fallbackTowerDamage);
    const bestDpsDamage = getBestDpsDamage(heroes);

    return {
        level: level,
        towerDamage: towerDamage,
        bestDpsDamage: bestDpsDamage,
        heroes: heroes,
        experiencedPlayer: determineExperience(level),
        mainGoal: document.querySelector("#main-goal").value,
        hasGenie: document.querySelector("#has-genie").checked,
        hasFish: document.querySelector("#has-fish").checked,
        hasSeahorse: document.querySelector("#has-seahorse").checked,
        hasPropellerCat: document.querySelector("#has-propeller-cat").checked
    };
}


function renderHeroSummary(account) {
    if (account.heroes.length === 0) {
        return `
            <div class="result-box">
                <h3>Hero Summary</h3>
                <p>No hero roster entries were added, so the optimizer used the fallback level and tower damage fields.</p>
            </div>
        `;
    }

    const heroRows = account.heroes.map((hero) => {
        return `
            <p>
                <strong>${hero.className || "Unknown Hero"}</strong>
                (${hero.role || "No role"}) —
                Level ${hero.level || 0},
                Tower Damage ${hero.towerDamage || 0},
                Hero Damage ${hero.heroDamage || 0}
            </p>
        `;
    }).join("");

    return `
        <div class="result-box">
            <h3>Hero Summary</h3>
            <p><strong>Highest Hero Level Used:</strong> ${account.level}</p>
            <p><strong>Best Builder Tower Damage Used:</strong> ${account.towerDamage}</p>
            <p><strong>Best DPS Hero Damage Found:</strong> ${account.bestDpsDamage}</p>
            ${heroRows}
        </div>
    `;
}


function renderResults(recommendation, stepName, stepData, account) {
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

                ${renderHeroSummary(account)}
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

    const recommendation = chooseGoalRecommendation(
        stepName,
        stepData,
        account
    );

    renderResults(recommendation, stepName, stepData, account);
}


const optimizerForm = document.querySelector("#optimizer-form");

if (optimizerForm) {
    optimizerForm.addEventListener("submit", handleOptimizerSubmit);
}