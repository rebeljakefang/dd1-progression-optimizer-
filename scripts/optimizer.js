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

    const recommendation = chooseGoalRecommendation(
        stepName,
        stepData,
        account
    );

    renderResults(recommendation, stepName, stepData);
}


const optimizerForm = document.querySelector("#optimizer-form");

if (optimizerForm) {
    optimizerForm.addEventListener("submit", handleOptimizerSubmit);
}