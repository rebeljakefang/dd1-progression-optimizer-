/* =========================================================

Hero Class + Role Data
========================================================= */

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

const rolesByClass = {
"Apprentice": ["Builder", "DPS", "Hybrid"],
"Adept": ["Builder", "DPS", "Hybrid"],

"Squire": ["Builder", "Waller", "DPS", "Hybrid"],
"Countess": ["Builder", "Waller", "DPS", "Hybrid"],

"Huntress": ["Trap Huntress", "DPS", "Hybrid"],
"Ranger": ["Trap Huntress", "DPS", "Hybrid"],

"Monk": ["Aura Monk", "Boost Monk", "DPS", "Hybrid"],
"Initiate": ["Aura Monk", "Upgrade Initiate", "DPS", "Hybrid"],

"Series EV": ["Beam EV", "Waller", "DPS", "Hybrid"],

"Summoner": ["Minion Summoner", "Waller Summoner", "Hybrid"],

"Jester": ["DPS", "Hybrid"],

"Barbarian": ["DPS"]

};

const roleStatHints = {
"Builder": "Stat priority: Tower Damage > Tower Rate > Tower Range > Tower Health.",
"Waller": "Stat priority: Tower Health > Tower Damage > Tower Rate > Tower Range.",
"Waller Summoner": "Stat priority: Tower Health > Tower Damage > Tower Range > Tower Rate.",
"DPS": "Stat priority: Hero Damage > Lowest Resistance > Hero Health > Hero Speed.",
"Boost Monk": "Stat priority: Boost abilities > Lowest Resistance > Hero Health > Hero Speed.",
"Aura Monk": "Stat priority: Tower Range > Tower Damage > Tower Rate > Tower Health.",
"Beam EV": "Stat priority: Tower Damage > Tower Health > Tower Range > Tower Rate.",
"Minion Summoner": "Stat priority: Tower Damage > Tower Health > Tower Range > Tower Rate.",
"Trap Huntress": "Stat priority: Tower Damage > Tower Range > Tower Rate > Tower Health.",
"Upgrade Initiate": "Stat priority: Hero Speed > Lowest Resistance > Hero Health > Ability stats.",
"Hybrid": "Stat priority: Depends on the job. Usually Tower Damage or Hero Damage first, then survivability."
};

/* =========================================================
   2. Basic Form Helper Functions
========================================================= */

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


function setHeroField(heroNumber, fieldId, value) {
    const field = document.querySelector(`#hero-${heroNumber}-${fieldId}`);

    if (field) {
        field.value = value;
    }
}


function buildOptions(items, emptyLabel) {
    let options = `<option value="">${emptyLabel}</option>`;

    items.forEach((item) => {
        options += `<option value="${item}">${item}</option>`;
    });

    return options;
}


/* =========================================================
   3. Role Dropdown + Stat Priority Logic
========================================================= */

function updateRoleOptions(heroNumber) {
    const classSelect = document.querySelector(`#hero-${heroNumber}-class`);
    const roleSelect = document.querySelector(`#hero-${heroNumber}-role`);
    const roleHintText = document.querySelector(`#hero-${heroNumber}-role-hint-text`);

    if (!classSelect || !roleSelect || !roleHintText) {
        return;
    }

    const selectedClass = classSelect.value;
    const allowedRoles = rolesByClass[selectedClass] || [];

    roleSelect.innerHTML = "";

    if (allowedRoles.length === 0) {
        roleSelect.innerHTML = `<option value="">Choose a class first</option>`;
        roleHintText.textContent = "Choose a role to see stat priority.";
        return;
    }

    roleSelect.innerHTML = `<option value="">None</option>`;

    allowedRoles.forEach((role) => {
        roleSelect.innerHTML += `<option value="${role}">${role}</option>`;
    });

    roleHintText.textContent = "Choose a role to see stat priority.";
}


function updateRoleHint(heroNumber) {
    const roleSelect = document.querySelector(`#hero-${heroNumber}-role`);
    const roleHintText = document.querySelector(`#hero-${heroNumber}-role-hint-text`);

    if (!roleSelect || !roleHintText) {
        return;
    }

    const selectedRole = roleSelect.value;

    if (roleStatHints[selectedRole]) {
        roleHintText.textContent = roleStatHints[selectedRole];
    } else {
        roleHintText.textContent = "Choose a role to see stat priority.";
    }
}



/* =========================================================
4. Hero Slot Buttons + Renumbering
========================================================= */

function updateAddHeroButton() {
const addHeroButton = document.querySelector("#add-hero-button");

if (!addHeroButton) {
    return;
}

addHeroButton.disabled = false;
addHeroButton.textContent = "Add Hero";

}

function renumberHeroSlots() {
const heroSlots = document.querySelectorAll(".hero-slot");

heroSlots.forEach((slot, index) => {
    const newHeroNumber = index + 1;
    const oldHeroNumber = slot.dataset.heroNumber;
    const heroName = (slot.dataset.heroName || "").trim();

    slot.dataset.heroNumber = newHeroNumber;

    const heading = slot.querySelector("h3");

    if (heading) {
        heading.textContent = heroName
            ? `Hero ${newHeroNumber}: ${heroName}`
            : `Hero ${newHeroNumber}`;
    }

    const fields = [
        "class",
        "role",
        "role-hint",
        "role-hint-text",
        "level",
        "tower-health",
        "tower-damage",
        "tower-range",
        "tower-rate",
        "hero-health",
        "hero-damage",
        "hero-speed",
        "hero-casting",
        "lowest-resistance",
        "ability-1",
        "ability-2"
    ];

    fields.forEach((field) => {
        const oldId = `hero-${oldHeroNumber}-${field}`;
        const newId = `hero-${newHeroNumber}-${field}`;

        const element = slot.querySelector(`#${CSS.escape(oldId)}`);
        const label = slot.querySelector(`label[for="${oldId}"]`);

        if (element) {
            element.id = newId;
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

if (typeof saveOptimizerData === "function") {
    saveOptimizerData();
}

}

/* =========================================================
5. Hero Slot Creation
========================================================= */

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
        <option value="">Choose a class first</option>
    </select>

    <details id="hero-${heroNumber}-role-hint" class="role-stat-hint">
        <summary>Show Stat Priority</summary>
        <p id="hero-${heroNumber}-role-hint-text">
            Choose a role to see stat priority.
        </p>
    </details>

    <details class="hero-stat-details">
        <summary>Show / Hide Hero Stats</summary>

        <div class="hero-stat-grid">
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

            <label for="hero-${heroNumber}-hero-speed">Hero Speed</label>
            <input id="hero-${heroNumber}-hero-speed" class="hero-speed" type="number" min="0" max="10000">

            <label for="hero-${heroNumber}-hero-casting">Hero Casting Rate</label>
            <input id="hero-${heroNumber}-hero-casting" class="hero-casting" type="number" min="0" max="10000">

            <label for="hero-${heroNumber}-lowest-resistance">Lowest Resistance</label>
            <input id="hero-${heroNumber}-lowest-resistance" class="hero-lowest-resistance" type="number" max="90">

            <label for="hero-${heroNumber}-ability-1">Ability 1</label>
            <input id="hero-${heroNumber}-ability-1" class="hero-ability-1" type="number" min="0" max="10000">

            <label for="hero-${heroNumber}-ability-2">Ability 2</label>
            <input id="hero-${heroNumber}-ability-2" class="hero-ability-2" type="number" min="0" max="10000">
        </div>
    </details>
`;

const removeButton = heroSlot.querySelector(".remove-hero-button");
removeButton.addEventListener("click", removeHeroSlot);

const classSelect = heroSlot.querySelector(".hero-class");
const roleSelect = heroSlot.querySelector(".hero-role");

classSelect.addEventListener("change", () => {
    const currentHeroNumber = heroSlot.dataset.heroNumber;
    updateRoleOptions(currentHeroNumber);
});

roleSelect.addEventListener("change", () => {
    const currentHeroNumber = heroSlot.dataset.heroNumber;
    updateRoleHint(currentHeroNumber);
});

return heroSlot;

}

function addHeroSlot() {
const heroRosterGrid = document.querySelector("#hero-roster-grid");

if (!heroRosterGrid) {
    return;
}

const currentHeroCount = heroRosterGrid.querySelectorAll(".hero-slot").length;
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

/* =========================================================
6. Build Account Object From Form
========================================================= */

function buildHeroRosterFromForm() {
const heroes = [];
const heroSlots = document.querySelectorAll(".hero-slot");

heroSlots.forEach((slot) => {
    const heroNumber = slot.dataset.heroNumber;
    const name = (slot.dataset.heroName || "").trim();
    const imported = slot.dataset.imported === "true";

    const className = document.querySelector(
        `#hero-${heroNumber}-class`
    ).value;

    const role = document.querySelector(
        `#hero-${heroNumber}-role`
    ).value;

    const level = getNumberValue(
        `#hero-${heroNumber}-level`
    );

    const towerHealth = getNumberValue(
        `#hero-${heroNumber}-tower-health`
    );

    const towerDamage = getNumberValue(
        `#hero-${heroNumber}-tower-damage`
    );

    const towerRange = getNumberValue(
        `#hero-${heroNumber}-tower-range`
    );

    const towerRate = getNumberValue(
        `#hero-${heroNumber}-tower-rate`
    );

    const heroHealth = getNumberValue(
        `#hero-${heroNumber}-hero-health`
    );

    const heroDamage = getNumberValue(
        `#hero-${heroNumber}-hero-damage`
    );

    const heroSpeed = getNumberValue(
        `#hero-${heroNumber}-hero-speed`
    );

    const heroCasting = getNumberValue(
        `#hero-${heroNumber}-hero-casting`
    );

    const lowestResistance = getNumberValue(
        `#hero-${heroNumber}-lowest-resistance`
    );

    const ability1 = getNumberValue(
        `#hero-${heroNumber}-ability-1`
    );

    const ability2 = getNumberValue(
        `#hero-${heroNumber}-ability-2`
    );

    if (
        name !== "" ||
        className !== "" ||
        role !== "" ||
        level > 0 ||
        towerHealth > 0 ||
        towerDamage > 0 ||
        towerRange > 0 ||
        towerRate > 0 ||
        heroHealth > 0 ||
        heroDamage > 0 ||
        heroSpeed > 0 ||
        heroCasting !== 0 ||
        lowestResistance !== 0 ||
        ability1 > 0 ||
        ability2 > 0
    ) {
        heroes.push({
            number: Number(heroNumber),
            name: name,
            imported: imported,
            className: className,
            role: role,
            level: level,
            towerHealth: towerHealth,
            towerDamage: towerDamage,
            towerRange: towerRange,
            towerRate: towerRate,
            heroHealth: heroHealth,
            heroDamage: heroDamage,
            heroSpeed: heroSpeed,
            heroCasting: heroCasting,
            lowestResistance: lowestResistance,
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
    hasHarpoonPet: document.querySelector("#has-harpoon-pet").checked,
    hasPropellerCat: document.querySelector("#has-propeller-cat").checked
};

}

/* =========================================================
   7. Temporary Demo Fill Tools
========================================================= */

function setDemoHero(heroNumber, hero) {
    setHeroField(heroNumber, "class", hero.className);
    updateRoleOptions(heroNumber);

    setHeroField(heroNumber, "role", hero.role);
    updateRoleHint(heroNumber);

    setHeroField(heroNumber, "level", hero.level);
    setHeroField(heroNumber, "tower-health", hero.towerHealth);
    setHeroField(heroNumber, "tower-damage", hero.towerDamage);
    setHeroField(heroNumber, "tower-range", hero.towerRange);
    setHeroField(heroNumber, "tower-rate", hero.towerRate);
    setHeroField(heroNumber, "hero-health", hero.heroHealth);
    setHeroField(heroNumber, "hero-damage", hero.heroDamage);
    setHeroField(heroNumber, "hero-speed", hero.heroSpeed);
    setHeroField(heroNumber, "hero-casting", hero.heroCasting ?? 0);
    setHeroField(heroNumber, "lowest-resistance", hero.lowestResistance);
    setHeroField(heroNumber, "ability-1", hero.ability1);
    setHeroField(heroNumber, "ability-2", hero.ability2);
}


function fillDemoOptimizerData() {
    const heroRosterGrid = document.querySelector("#hero-roster-grid");

    if (!heroRosterGrid) {
        return;
    }

    const demoHeroes = [
        {
            className: "Monk",
            role: "Aura Monk",
            level: 83,
            towerHealth: 1600,
            towerDamage: 3600,
            towerRange: 2800,
            towerRate: 2200,
            heroHealth: 500,
            heroDamage: 100,
            heroSpeed: 600,
            heroCasting: 0,
            lowestResistance: 50,
            ability1: 0,
            ability2: 0
        },
        {
            className: "Summoner",
            role: "Waller Summoner",
            level: 83,
            towerHealth: 2200,
            towerDamage: 2400,
            towerRange: 1800,
            towerRate: 1600,
            heroHealth: 400,
            heroDamage: 100,
            heroSpeed: 400,
            heroCasting: 0,
            lowestResistance: 40,
            ability1: 0,
            ability2: 0
        },
        {
            className: "Series EV",
            role: "Beam EV",
            level: 83,
            towerHealth: 1400,
            towerDamage: 1800,
            towerRange: 900,
            towerRate: 0,
            heroHealth: 500,
            heroDamage: 100,
            heroSpeed: 500,
            heroCasting: 0,
            lowestResistance: 45,
            ability1: 0,
            ability2: 0
        },
        {
            className: "Monk",
            role: "Boost Monk",
            level: 83,
            towerHealth: 200,
            towerDamage: 100,
            towerRange: 100,
            towerRate: 100,
            heroHealth: 1400,
            heroDamage: 700,
            heroSpeed: 900,
            heroCasting: 0,
            lowestResistance: 78,
            ability1: 1500,
            ability2: 1500
        },
        {
            className: "Jester",
            role: "DPS",
            level: 83,
            towerHealth: 100,
            towerDamage: 100,
            towerRange: 100,
            towerRate: 100,
            heroHealth: 1300,
            heroDamage: 2500,
            heroSpeed: 900,
            heroCasting: 0,
            lowestResistance: 76,
            ability1: 600,
            ability2: 600
        }
    ];

    heroRosterGrid.innerHTML = "";

    demoHeroes.forEach(() => {
        addHeroSlot();
    });

    demoHeroes.forEach((hero, index) => {
        setDemoHero(index + 1, hero);
    });

    const mainGoal = document.querySelector("#main-goal");
    const hasGenie = document.querySelector("#has-genie");
    const hasFish = document.querySelector("#has-fish");
    const hasSeahorse = document.querySelector("#has-seahorse");
    const hasHarpoonPet = document.querySelector("#has-harpoon-pet");
    const hasPropellerCat = document.querySelector("#has-propeller-cat");

    if (mainGoal) {
        mainGoal.value = "pets";
    }

    if (hasGenie) {
        hasGenie.checked = true;
    }

    if (hasFish) {
        hasFish.checked = true;
    }

    if (hasSeahorse) {
        hasSeahorse.checked = false;
    }

    if (hasHarpoonPet) {
        hasHarpoonPet.checked = false;
    }

    if (hasPropellerCat) {
        hasPropellerCat.checked = false;
    }

    updateAddHeroButton();

    if (typeof saveOptimizerData === "function") {
        saveOptimizerData();
    }
}


/* =========================================================
   8. Results: Roster Summary
========================================================= */

function escapeOptimizerDisplayText(value) {
    const element = document.createElement("div");
    element.textContent = String(value);
    return element.innerHTML;
}


function renderHeroSummary(account) {
    if (account.heroes.length === 0) {
        return `
            <div class="result-box">
                <h3>Roster Summary</h3>
                <p>No hero roster entries were added.</p>
            </div>
        `;
    }

    const heroRows = account.heroes.map((hero, index) => {
        const heroName = hero.name
            ? escapeOptimizerDisplayText(hero.name)
            : `Hero ${index + 1}`;

        const className = escapeOptimizerDisplayText(
            hero.className || "Unknown Class"
        );

        const role = escapeOptimizerDisplayText(
            hero.role || "No role"
        );

        return `
            <div class="hero-result-detail">
                <h4>
                    ${heroName}
                    —
                    ${className}
                    —
                    ${role}
                </h4>

                <p>
                    Level ${hero.level || 0},
                    Tower HP ${hero.towerHealth || 0},
                    Tower Damage ${hero.towerDamage || 0},
                    Tower Range ${hero.towerRange || 0},
                    Tower Rate ${hero.towerRate || 0}
                </p>

                <p>
                    Hero HP ${hero.heroHealth || 0},
                    Hero Damage ${hero.heroDamage || 0},
                    Hero Speed ${hero.heroSpeed || 0},
                    Hero Casting ${hero.heroCasting ?? 0},
                    Lowest Resistance ${hero.lowestResistance ?? 0},
                    Ability 1 ${hero.ability1 || 0},
                    Ability 2 ${hero.ability2 || 0}
                </p>
            </div>
        `;
    }).join("");

    return `
        <div class="result-box">
            <h3>Roster Summary</h3>

            <p>
                <strong>Heroes Added:</strong>
                ${account.heroes.length}
            </p>

            <p>
                <strong>Highest Hero Level Used:</strong>
                ${account.level}
            </p>

            <p>
                <strong>Best Builder Tower Damage Used:</strong>
                ${account.towerDamage}
            </p>

            <p>
                <strong>Best DPS Hero Damage Found:</strong>
                ${account.bestDpsDamage}
            </p>

            <details class="result-details">
                <summary>Show Full Hero Details</summary>
                ${heroRows}
            </details>
        </div>
    `;
}


/* =========================================================
   9. Results: Account Review + Other Options
========================================================= */

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


function renderOtherRecommendations(otherRecommendations) {
    if (!otherRecommendations || otherRecommendations.length === 0) {
        return "";
    }

    const optionCards = otherRecommendations.map((option) => {
        return `
            <div class="other-option-box">
                <h4>${option.name}</h4>
                <p>${option.reason}</p>
                <p><strong>Goal:</strong> ${option.data.goal}</p>
                <p><strong>Difficulty:</strong> ${option.data.difficulty}</p>
                <p><strong>Mode:</strong> ${option.data.mode}</p>
                <p><strong>Risk:</strong> ${option.data.risk}</p>
                <p><strong>Reward:</strong> ${option.data.reward}</p>
            </div>
        `;
    }).join("");

    return `
        <div class="result-box">
            <h3>Other Recommended Options</h3>
            <div class="other-options-grid">
                ${optionCards}
            </div>
        </div>
    `;
}


/* =========================================================
   10. Results: Main Render Function
========================================================= */

function renderResults(recommendation, stepName, stepData, account, otherRecommendations) {
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
                ${renderOtherRecommendations(otherRecommendations)}
            </div>
        </div>
    `;
}


/* =========================================================
   11. Form Submit Logic
========================================================= */

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

    const otherRecommendations = chooseOtherRecommendations(
        stepName,
        recommendation,
        account
    );

    renderResults(recommendation, stepName, stepData, account, otherRecommendations);

    const results = document.querySelector("#results");

    if (results) {
        results.scrollIntoView({
            behavior: "instant",
            block: "start"
        });
    }
}


/* =========================================================
   12. Page Startup + Event Listeners
========================================================= */

initializeHeroRoster();

const optimizerForm = document.querySelector("#optimizer-form");

if (optimizerForm) {
    optimizerForm.addEventListener("submit", handleOptimizerSubmit);
}

const demoFillButton = document.querySelector("#demo-fill-button");

if (demoFillButton) {
    demoFillButton.addEventListener("click", fillDemoOptimizerData);
}