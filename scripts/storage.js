const storageKeys = {
    optimizer: "dd1OptimizerData",
    checklist: "dd1ChecklistProgress"
};


function safelyParseJson(savedData) {
    try {
        return JSON.parse(savedData);
    } catch {
        return null;
    }
}



/* =========================================================
   Optimizer Storage
========================================================= */

function getOptimizerHeroData() {
    const heroes = [];
    const heroSlots = document.querySelectorAll(".hero-slot");

    heroSlots.forEach((slot) => {
        const heroNumber = slot.dataset.heroNumber;

        heroes.push({
            name: (slot.dataset.heroName || "").trim(),
            imported: slot.dataset.imported === "true",
            ignored: document.querySelector(`#hero-${heroNumber}-ignore`)?.checked || false,
            className: document.querySelector(`#hero-${heroNumber}-class`)?.value || "",
            role: document.querySelector(`#hero-${heroNumber}-role`)?.value || "",
            level: document.querySelector(`#hero-${heroNumber}-level`)?.value || "",
            towerHealth: document.querySelector(`#hero-${heroNumber}-tower-health`)?.value || "",
            towerDamage: document.querySelector(`#hero-${heroNumber}-tower-damage`)?.value || "",
            towerRange: document.querySelector(`#hero-${heroNumber}-tower-range`)?.value || "",
            towerRate: document.querySelector(`#hero-${heroNumber}-tower-rate`)?.value || "",
            heroHealth: document.querySelector(`#hero-${heroNumber}-hero-health`)?.value || "",
            heroDamage: document.querySelector(`#hero-${heroNumber}-hero-damage`)?.value || "",
            heroSpeed: document.querySelector(`#hero-${heroNumber}-hero-speed`)?.value || "",
            heroCasting: document.querySelector(`#hero-${heroNumber}-hero-casting`)?.value || "",
            lowestResistance: document.querySelector(`#hero-${heroNumber}-lowest-resistance`)?.value || "",
            ability1: document.querySelector(`#hero-${heroNumber}-ability-1`)?.value || "",
            ability2: document.querySelector(`#hero-${heroNumber}-ability-2`)?.value || ""
        });
    });

    return heroes;
}


function saveOptimizerData() {
    const optimizerForm = document.querySelector("#optimizer-form");

    if (!optimizerForm) {
        return;
    }

    const optimizerData = {
        mainGoal: document.querySelector("#main-goal")?.value || "leveling",
        hasGenie: document.querySelector("#has-genie")?.checked || false,
        hasFish: document.querySelector("#has-fish")?.checked || false,
        hasSeahorse: document.querySelector("#has-seahorse")?.checked || false,
        hasHarpoonPet: document.querySelector("#has-harpoon-pet")?.checked || false,
        hasPropellerCat: document.querySelector("#has-propeller-cat")?.checked || false,
        heroes: getOptimizerHeroData()
    };

    localStorage.setItem(
        storageKeys.optimizer,
        JSON.stringify(optimizerData)
    );
}


function setHeroField(heroNumber, fieldId, value) {
    const field = document.querySelector(`#hero-${heroNumber}-${fieldId}`);

    if (field) {
        field.value = value;
    }
}


function loadOptimizerData() {
    const optimizerForm = document.querySelector("#optimizer-form");
    const heroRosterGrid = document.querySelector("#hero-roster-grid");

    if (!optimizerForm || !heroRosterGrid) {
        return;
    }

    const savedData = safelyParseJson(
        localStorage.getItem(storageKeys.optimizer)
    );

    if (!savedData) {
        return;
    }

    const mainGoal = document.querySelector("#main-goal");
    const hasGenie = document.querySelector("#has-genie");
    const hasFish = document.querySelector("#has-fish");
    const hasSeahorse = document.querySelector("#has-seahorse");
    const hasHarpoonPet = document.querySelector("#has-harpoon-pet");
    const hasPropellerCat = document.querySelector("#has-propeller-cat");

    if (mainGoal) {
        mainGoal.value = savedData.mainGoal || "leveling";
    }

    if (hasGenie) {
        hasGenie.checked = savedData.hasGenie || false;
    }

    if (hasFish) {
        hasFish.checked = savedData.hasFish || false;
    }

    if (hasSeahorse) {
        hasSeahorse.checked = savedData.hasSeahorse || false;
    }

    if (hasHarpoonPet) {
        hasHarpoonPet.checked = savedData.hasHarpoonPet || false;
    }

    if (hasPropellerCat) {
        hasPropellerCat.checked = savedData.hasPropellerCat || false;
    }

    if (!Array.isArray(savedData.heroes) || savedData.heroes.length === 0) {
        return;
    }

    heroRosterGrid.innerHTML = "";

    savedData.heroes.forEach(() => {
        addHeroSlot();
    });

    savedData.heroes.forEach((hero, index) => {
        const heroNumber = index + 1;
        const slot = heroRosterGrid.querySelector(`.hero-slot[data-hero-number="${heroNumber}"]`);

        if (slot) {
            slot.dataset.heroName = hero.name || "";
            slot.dataset.imported = hero.imported ? "true" : "false";

            const heading = slot.querySelector("h3");

            if (heading) {
                heading.textContent = hero.name
                    ? `Hero ${heroNumber}: ${hero.name}`
                    : `Hero ${heroNumber}`;
            }
        }

        setHeroField(heroNumber, "class", hero.className || "");
        updateRoleOptions(heroNumber);
        setHeroField(heroNumber, "role", hero.role || "");
        updateRoleHint(heroNumber);

        const ignoreField = document.querySelector(`#hero-${heroNumber}-ignore`);

        if (ignoreField) {
            ignoreField.checked = hero.ignored || false;
        }

        setHeroField(heroNumber, "level", hero.level || "");
        setHeroField(heroNumber, "tower-health", hero.towerHealth || "");
        setHeroField(heroNumber, "tower-damage", hero.towerDamage || "");
        setHeroField(heroNumber, "tower-range", hero.towerRange || "");
        setHeroField(heroNumber, "tower-rate", hero.towerRate || "");
        setHeroField(heroNumber, "hero-health", hero.heroHealth || "");
        setHeroField(heroNumber, "hero-damage", hero.heroDamage || "");
        setHeroField(heroNumber, "hero-speed", hero.heroSpeed || "");
        setHeroField(heroNumber, "hero-casting", hero.heroCasting || "");
        setHeroField(heroNumber, "lowest-resistance", hero.lowestResistance ?? "");
        setHeroField(heroNumber, "ability-1", hero.ability1 || "");
        setHeroField(heroNumber, "ability-2", hero.ability2 || "");
    });

    updateAddHeroButton();
}


function clearOptimizerData() {
    localStorage.removeItem(storageKeys.optimizer);

    const heroRosterGrid = document.querySelector("#hero-roster-grid");

    if (heroRosterGrid) {
        heroRosterGrid.innerHTML = "";
        addHeroSlot();
        addHeroSlot();
        addHeroSlot();
        updateAddHeroButton();
    }

    const optimizerForm = document.querySelector("#optimizer-form");

    if (optimizerForm) {
        optimizerForm.reset();
    }

    const results = document.querySelector("#results");

    if (results) {
        results.innerHTML = `
            <div class="card-content">
                <h2>Recommendation</h2>
                <p>
                    Fill out the form and click
                    “Get Recommendation.”
                </p>
            </div>
        `;
    }
}


function initializeOptimizerStorage() {
    const optimizerForm = document.querySelector("#optimizer-form");

    if (!optimizerForm) {
        return;
    }

    loadOptimizerData();

    optimizerForm.addEventListener("input", saveOptimizerData);
    optimizerForm.addEventListener("change", saveOptimizerData);

    optimizerForm.addEventListener("click", (event) => {
        if (
            event.target.id === "add-hero-button" ||
            event.target.classList.contains("remove-hero-button")
        ) {
            setTimeout(saveOptimizerData, 0);
        }
    });

    const clearButton = document.querySelector("#clear-optimizer-storage");

    if (clearButton) {
        clearButton.addEventListener("click", clearOptimizerData);
    }
}


/* =========================================================
   Checklist Storage
========================================================= */

function getChecklistKey(checkbox, index) {
    if (checkbox.id) {
        return checkbox.id;
    }

    if (checkbox.dataset.checks) {
        return `checks-${checkbox.dataset.checks}`;
    }

    if (checkbox.dataset.requirement) {
        return `requirement-${checkbox.dataset.requirement}`;
    }

    return `checkbox-${index}`;
}


function saveChecklistData() {
    const checklistPage = document.querySelector("#clear-checklist-storage");

    if (!checklistPage) {
        return;
    }

    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const checklistData = {};

    checkboxes.forEach((checkbox, index) => {
        const key = getChecklistKey(checkbox, index);
        checklistData[key] = checkbox.checked;
    });

    localStorage.setItem(storageKeys.checklist, JSON.stringify(checklistData));
}


function loadChecklistData() {
    const checklistPage = document.querySelector("#clear-checklist-storage");

    if (!checklistPage) {
        return;
    }

    const savedData = safelyParseJson(localStorage.getItem(storageKeys.checklist));

    if (!savedData) {
        return;
    }

    const checkboxes = document.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach((checkbox, index) => {
        const key = getChecklistKey(checkbox, index);

        if (savedData[key] !== undefined) {
            checkbox.checked = savedData[key];
        }
    });
}


function clearChecklistData() {
    localStorage.removeItem(storageKeys.checklist);

    const checkboxes = document.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
}


function initializeChecklistStorage() {
    const clearButton = document.querySelector("#clear-checklist-storage");

    if (!clearButton) {
        return;
    }

    loadChecklistData();

    const checkboxes = document.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", saveChecklistData);
    });

    clearButton.addEventListener("click", clearChecklistData);
}


/* =========================================================
   Start Storage Features
========================================================= */

initializeOptimizerStorage();
initializeChecklistStorage();