const maxHeroSlots = 20;

const heroClasses = [
    "Apprentice",
    "Squire",
    "Huntress",
    "Monk",
    "Series EV",
    "Summoner",
    "Jester",
    "Barbarian",
    "Adept",
    "Countess",
    "Ranger",
    "Initiate"
];

const heroRoles = [
    "Builder",
    "Waller",
    "Waller Summoner",
    "DPS",
    "Boost Monk",
    "Aura Monk",
    "Beam EV",
    "Minion Summoner",
    "Trap Huntress",
    "Upgrade Initiate",
    "Hybrid"
];


function getNumberValue(selector) {
    const input = document.querySelector(selector);

    if (!input) {
        return 0;
    }

    const value = Number(input.value);

    if (Number.isNaN(value)) {
        return 0;
    }

    return value;
}


function buildOptions(items, emptyLabel) {
    let options = `<option value="">${emptyLabel}</option>`;

    items.forEach((item) => {
        options += `<option value="${item}">${item}</option>`;
    });

    return options;
}


function updateAddHeroButton() {
    const heroRosterGrid = document.querySelector("#hero-roster-grid");
    const addHeroButton = document.querySelector("#add-hero-button");

    if (!heroRosterGrid || !addHeroButton) {
        return;
    }

    const currentHeroCount = heroRosterGrid.querySelectorAll(".hero-slot").length;

    if (currentHeroCount >= maxHeroSlots) {
        addHeroButton.disabled = true;
        addHeroButton.textContent = "Maximum Heroes Added";
    } else {
        addHeroButton.disabled = false;
        addHeroButton.textContent = "Add Hero";
    }
}


function renumberHeroSlots() {
    const heroSlots = document.querySelectorAll(".hero-slot");

    heroSlots.forEach((slot, index) => {
        const newHeroNumber = index + 1;
        const oldHeroNumber = slot.dataset.heroNumber;

        slot.dataset.heroNumber = newHeroNumber;

        const heading = slot.querySelector("h3");

        if (heading) {
            heading.textContent = `Hero ${newHeroNumber}`;
        }

        const fields = [
            "class",
            "role",
            "level",
            "tower-health",
            "tower-damage",
            "tower-range",
            "tower-rate",
            "hero-health",
            "hero-damage",
            "ability-1",
            "ability-2"
        ];

        fields.forEach((field) => {
            const oldId = `hero-${oldHeroNumber}-${field}`;
            const newId = `hero-${newHeroNumber}-${field}`;

            const input = slot.querySelector(`#${CSS.escape(oldId)}`);
            const label = slot.querySelector(`label[for="${oldId}"]`);

            if (input) {
                input.id = newId;
            }

            if (label) {
                label.setAttribute("for", newId);
            }
        });
    });
}


function removeHeroSlot(event) {
    const heroSlot = event.target.closest(".hero-slot");

    if (heroSlot) {
        heroSlot.remove();
    }

    renumberHeroSlots();
    updateAddHeroButton();
}


function createHeroSlot(heroNumber) {
    const heroSlot = document.createElement("div");
    heroSlot.classList.add("hero-slot");
    heroSlot.dataset.heroNumber = heroNumber;

    heroSlot.innerHTML = `
        <div class="hero-slot-header">
            <h3>Hero ${heroNumber}</h3>
            <button class="remove-hero-button" type="button">Remove</button>
        </div>

        <label for="hero-${heroNumber}-class">Class</label>
        <select id="hero-${heroNumber}-class" class="hero-class">
            ${buildOptions(heroClasses, "None")}
        </select>

        <label for="hero-${heroNumber}-role">Role</label>
        <select id="hero-${heroNumber}-role" class="hero-role">
            ${buildOptions(heroRoles, "None")}
        </select>

        <label for="hero-${heroNumber}-level">Level</label>
        <input id="hero-${heroNumber}-level" class="hero-level" type="number" min="0" max="100">

        <label for="hero-${heroNumber}-tower-health">Tower Health</label>
        <input id="hero-${heroNumber}-tower-health" class="hero-tower-health" type="number" min="0" max="10000">

        <label for="hero-${heroNumber}-tower-damage">Tower Damage</label>
        <input id="hero-${heroNumber}-tower-damage" class="hero-tower-damage" type="number" min="0" max="10000">

        <label for="hero-${heroNumber}-tower-range">Tower Range</label>
        <input id="hero-${heroNumber}-tower-range" class="hero-tower-range" type="number" min="0" max="10000">

        <label for="hero-${heroNumber}-tower-rate">Tower Rate</label>
        <input id="hero-${heroNumber}-tower-rate" class="hero-tower-rate" type="number" min="0" max="10000">

        <label for="hero-${heroNumber}-hero-health">Hero Health</label>
        <input id="hero-${heroNumber}-hero-health" class="hero-hero-health" type="number" min="0" max="10000">

        <label for="hero-${heroNumber}-hero-damage">Hero Damage</label>
        <input id="hero-${heroNumber}-hero-damage" class="hero-hero-damage" type="number" min="0" max="10000">

        <label for="hero-${heroNumber}-ability-1">Ability 1</label>
        <input id="hero-${heroNumber}-ability-1" class="hero-ability-1" type="number" min="0" max="10000">

        <label for="hero-${heroNumber}-ability-2">Ability 2</label>
        <input id="hero-${heroNumber}-ability-2" class="hero-ability-2" type="number" min="0" max="10000">
    `;

    const removeButton = heroSlot.querySelector(".remove-hero-button");
    removeButton.addEventListener("click", removeHeroSlot);

    return heroSlot;
}


function addHeroSlot() {
    const heroRosterGrid = document.querySelector("#hero-roster-grid");

    if (!heroRosterGrid) {
        return;
    }

    const currentHeroCount = heroRosterGrid.querySelectorAll(".hero-slot").length;

    if (currentHeroCount >= maxHeroSlots) {
        updateAddHeroButton();
        return;
    }

    const nextHeroNumber = currentHeroCount + 1;
    const heroSlot = createHeroSlot(nextHeroNumber);

    heroRosterGrid.appendChild(heroSlot);
    updateAddHeroButton();
}


function initializeHeroRoster() {
    const addHeroButton = document.querySelector("#add-hero-button");

    addHeroSlot();
    addHeroSlot();
    addHeroSlot();

    if (addHeroButton) {
        addHeroButton.addEventListener("click", addHeroSlot);
    }

    updateAddHeroButton();
}


function buildHeroRosterFromForm() {
    const heroes = [];
    const heroSlots = document.querySelectorAll(".hero-slot");

    heroSlots.forEach((slot) => {
        const heroNumber = slot.dataset.heroNumber;

        const className = document.querySelector(`#hero-${heroNumber}-class`).value;
        const role = document.querySelector(`#hero-${heroNumber}-role`).value;
        const level = getNumberValue(`#hero-${heroNumber}-level`);
        const towerHealth = getNumberValue(`#hero-${heroNumber}-tower-health`);
        const towerDamage = getNumberValue(`#hero-${heroNumber}-tower-damage`);
        const towerRange = getNumberValue(`#hero-${heroNumber}-tower-range`);
        const towerRate = getNumberValue(`#hero-${heroNumber}-tower-rate`);
        const heroHealth = getNumberValue(`#hero-${heroNumber}-hero-health`);
        const heroDamage = getNumberValue(`#hero-${heroNumber}-hero-damage`);
        const ability1 = getNumberValue(`#hero-${heroNumber}-ability-1`);
        const ability2 = getNumberValue(`#hero-${heroNumber}-ability-2`);

        if (
            className !== "" ||
            role !== "" ||
            level > 0 ||
            towerHealth > 0 ||
            towerDamage > 0 ||
            towerRange > 0 ||
            towerRate > 0 ||
            heroHealth > 0 ||
            heroDamage > 0 ||
            ability1 > 0 ||
            ability2 > 0
        ) {
            heroes.push({
                className: className,
                role: role,
                level: level,
                towerHealth: towerHealth,
                towerDamage: towerDamage,
                towerRange: towerRange,
                towerRate: towerRate,
                heroHealth: heroHealth,
                heroDamage: heroDamage,
                ability1: ability1,
                ability2: ability2
            });
        }
    });

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
            role === "waller summoner" ||
            role === "hybrid" ||
            role === "aura monk" ||
            role === "beam ev" ||
            role === "minion summoner" ||
            role === "trap huntress"
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
    const heroes = buildHeroRosterFromForm();

    const level = getHighestHeroLevel(heroes, 0);
    const towerDamage = getBestBuilderDamage(heroes, 0);
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
                <p>No hero roster entries were added, so the optimizer could not calculate a real roster summary.</p>
            </div>
        `;
    }

    const heroRows = account.heroes.map((hero) => {
        return `
            <p>
                <strong>${hero.className || "Unknown Hero"}</strong>
                (${hero.role || "No role"}) —
                Level ${hero.level || 0}
            </p>
            <p>
                Tower HP ${hero.towerHealth || 0},
                Tower Damage ${hero.towerDamage || 0},
                Tower Range ${hero.towerRange || 0},
                Tower Rate ${hero.towerRate || 0}
            </p>
            <p>
                Hero HP ${hero.heroHealth || 0},
                Hero Damage ${hero.heroDamage || 0},
                Ability 1 ${hero.ability1 || 0},
                Ability 2 ${hero.ability2 || 0}
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


function renderAccountReview(account) {
    const notes = buildAccountReview(account);

    const noteItems = notes.map((note) => {
        return `<li>${note}</li>`;
    }).join("");

    return `
        <div class="result-box">
            <h3>Account Review</h3>
            <ul>
                ${noteItems}
            </ul>
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
                ${renderAccountReview(account)}
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


initializeHeroRoster();

const optimizerForm = document.querySelector("#optimizer-form");

if (optimizerForm) {
    optimizerForm.addEventListener("submit", handleOptimizerSubmit);
}