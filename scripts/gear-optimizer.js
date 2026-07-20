/* =========================================================
   DD1 Gear Optimizer Page

   Hero-focused gear view, auto/manual archetypes, drag/drop,
   focused hero table, weak-piece review, and CSV export.
========================================================= */

(() => {
    "use strict";

    /* =========================================================
       1. Page State + Constants
    ========================================================= */

    const state = {
        fileName: "",
        heroes: [],
        items: [],
        scoredItems: [],
        defaultRole: "auto",
        focusedHero: "",
        heroRoleOverrides: {},
        typeFilter: "all",
        setFilter: "all",
        searchText: "",
        sortMode: "slot-asc",
        dataSource: "Pending"
    };

    const elements = {};

    const slotOrder = [
        "Weapon",
        "Helmet",
        "Chest",
        "Torso",
        "Gloves",
        "Gauntlet",
        "Boots",
        "Pet",
        "Accessory",
        "Mask",
        "Bracers",
        "Brooch",
        "Shield",
        "Secondary",
        "Equipment",
        "Unknown"
    ];

    const statLabels = {
        towerHealth: "Tower HP",
        towerDamage: "Tower DMG",
        towerRange: "Tower RNG",
        towerRate: "Tower Rate",
        heroHealth: "Hero HP",
        heroDamage: "Hero DMG",
        heroSpeed: "Hero SPD",
        heroCasting: "Casting",
        ability1: "Ability 1",
        ability2: "Ability 2",
        allResists: "All Resists"
    };

    /* =========================================================
       2. DOM Element Cache
    ========================================================= */

    function getElement(id) {
        return document.querySelector(`#${id}`);
    }

    function cacheElements() {
        elements.fileInput = getElement("gear-save-file-input");
        elements.dropZone = getElement("gear-drop-zone");
        elements.useSessionButton = getElement("gear-use-session-file");
        elements.clearButton = getElement("gear-clear-page");
        elements.status = getElement("gear-status");
        elements.summaryHeroes = getElement("gear-summary-heroes");
        elements.summaryItems = getElement("gear-summary-items");
        elements.summaryInventory = getElement("gear-summary-inventory");
        elements.summaryRole = getElement("gear-summary-role");
        elements.roleFilter = getElement("gear-role-filter");
        elements.heroFilter = getElement("gear-hero-filter");
        elements.typeFilter = getElement("gear-type-filter");
        elements.setFilter = getElement("gear-set-filter");
        elements.searchFilter = getElement("gear-search-filter");
        elements.sortFilter = getElement("gear-sort-filter");
        elements.heroList = getElement("gear-hero-list");
        elements.recommendations = getElement("gear-recommendations");
        elements.tableCount = getElement("gear-table-count");
        elements.tableBody = getElement("gear-item-table-body");
        elements.exportButton = getElement("gear-export-csv");
    }

    /* =========================================================
       3. Status + Formatting Helpers
    ========================================================= */

    function setStatus(message, type = "normal") {
        if (!elements.status) {
            return;
        }

        elements.status.textContent = message;
        elements.status.dataset.statusType = type;
    }

    function escapeText(value) {
        const span = document.createElement("span");

        span.textContent = value === null || value === undefined
            ? ""
            : String(value);

        return span.innerHTML;
    }

    function formatNumber(value) {
        return Number(value || 0).toLocaleString();
    }

    function getStatText(entries) {
        if (!entries || entries.length === 0) {
            return "No strong stat";
        }

        return entries.map((entry) => {
            const label = statLabels[entry.statName] || entry.statName;
            return `${label} ${formatNumber(entry.value)}`;
        }).join(" / ");
    }

    /* =========================================================
       4. Slot + Hero Role Helpers
    ========================================================= */

    function normalizeSlot(type) {
        const text = String(type || "Unknown").trim();

        if (!text) {
            return "Unknown";
        }

        const lowerText = text.toLowerCase();

        if (lowerText.includes("weapon")) {
            return "Weapon";
        }

        if (lowerText.includes("helmet") || lowerText.includes("helm") || lowerText.includes("hat")) {
            return "Helmet";
        }

        if (lowerText.includes("chest") || lowerText.includes("vest") || lowerText.includes("shirt") || lowerText.includes("torso")) {
            return "Chest";
        }

        if (lowerText.includes("glove") || lowerText.includes("gauntlet")) {
            return "Gloves";
        }

        if (lowerText.includes("boot") || lowerText.includes("greave")) {
            return "Boots";
        }

        if (lowerText.includes("pet")) {
            return "Pet";
        }

        if (lowerText.includes("mask")) {
            return "Mask";
        }

        if (lowerText.includes("bracer")) {
            return "Bracers";
        }

        if (lowerText.includes("brooch")) {
            return "Brooch";
        }

        if (lowerText.includes("shield")) {
            return "Shield";
        }

        if (lowerText.includes("accessory") || lowerText.includes("acc")) {
            return "Accessory";
        }

        if (lowerText.includes("secondary")) {
            return "Secondary";
        }

        if (slotOrder.includes(text)) {
            return text;
        }

        return text;
    }

    function getSlotSortValue(type) {
        const slot = normalizeSlot(type);
        const index = slotOrder.indexOf(slot);

        return index === -1
            ? slotOrder.length
            : index;
    }

    function getHeroByName(heroName) {
        return state.heroes.find((hero) => {
            return hero.name === heroName;
        }) || null;
    }

    function getHeroAutoRole(heroName) {
        const hero = getHeroByName(heroName);

        if (!hero) {
            return "builderDamage";
        }

        return window.dd1GearScoring.guessRoleForHero(hero);
    }

    function getHeroEffectiveRole(heroName) {
        if (state.heroRoleOverrides[heroName]) {
            return state.heroRoleOverrides[heroName];
        }

        if (state.defaultRole !== "auto") {
            return state.defaultRole;
        }

        return getHeroAutoRole(heroName);
    }

    function getHeroRoleSource(heroName) {
        if (state.heroRoleOverrides[heroName]) {
            return "Manual";
        }

        if (state.defaultRole !== "auto") {
            return "Global";
        }

        return "Auto";
    }

    function getHeroEffectiveRoleLabel(heroName) {
        return window.dd1GearScoring.getRole(getHeroEffectiveRole(heroName)).label;
    }

    function getDefaultRoleLabel() {
        return window.dd1GearScoring.getRole(state.defaultRole).label;
    }

    /* =========================================================
       5. Hero Item Grouping
    ========================================================= */

    function getHeroItems(heroName, sourceRows = state.scoredItems) {
        return sourceRows.filter((row) => {
            return row.equippedHero === heroName;
        }).sort((first, second) => {
            const slotDifference = getSlotSortValue(first.itemType) - getSlotSortValue(second.itemType);

            if (slotDifference !== 0) {
                return slotDifference;
            }

            return second.score - first.score;
        });
    }

    function groupItemsBySlot(items) {
        const groups = new Map();

        items.forEach((item) => {
            const slot = normalizeSlot(item.itemType);

            if (!groups.has(slot)) {
                groups.set(slot, []);
            }

            groups.get(slot).push(item);
        });

        return [...groups.entries()].sort((first, second) => {
            return getSlotSortValue(first[0]) - getSlotSortValue(second[0]);
        });
    }

    function getWeakestItems(items, limit = 3) {
        return [...items]
            .sort((first, second) => first.score - second.score)
            .slice(0, limit);
    }

    function getStrongestItems(items, limit = 3) {
        return [...items]
            .sort((first, second) => second.score - first.score)
            .slice(0, limit);
    }

    /* =========================================================
       6. Filter Option Builders
    ========================================================= */

    function populateRoleOptions() {
        const roleOptions = window.dd1GearScoring.getRoleOptions(true);

        elements.roleFilter.innerHTML = roleOptions.map((role) => {
            return `<option value="${escapeText(role.value)}">${escapeText(role.label)}</option>`;
        }).join("");

        elements.roleFilter.value = state.defaultRole;
    }

    function populateHeroOptions() {
        if (state.heroes.length === 0) {
            elements.heroFilter.innerHTML = `<option value="">Load a save file first</option>`;
            return;
        }

        elements.heroFilter.innerHTML = state.heroes.map((hero) => {
            return `<option value="${escapeText(hero.name)}">${escapeText(hero.name)} — ${escapeText(hero.className)}</option>`;
        }).join("");

        if (!state.focusedHero || !getHeroByName(state.focusedHero)) {
            state.focusedHero = state.heroes[0].name;
        }

        elements.heroFilter.value = state.focusedHero;
    }

    function populateDynamicFilter(selectElement, values, allLabel) {
        const currentValue = selectElement.value || "all";

        selectElement.innerHTML = [
            `<option value="all">${escapeText(allLabel)}</option>`,
            ...values.map((value) => `<option value="${escapeText(value)}">${escapeText(value)}</option>`)
        ].join("");

        selectElement.value = values.includes(currentValue)
            ? currentValue
            : "all";
    }

    function updateFocusedGearFilters() {
        const focusedItems = getHeroItems(state.focusedHero, state.scoredItems);

        populateDynamicFilter(
            elements.typeFilter,
            window.dd1GearItemModel.getUniqueSortedValues(focusedItems, "itemType"),
            "All focused hero types"
        );

        populateDynamicFilter(
            elements.setFilter,
            window.dd1GearItemModel.getUniqueSortedValues(focusedItems, "armorSet"),
            "All focused hero sets"
        );
    }

    function updateFilterOptions() {
        populateHeroOptions();
        updateFocusedGearFilters();
    }

    /* =========================================================
       7. Scoring + Filtering
    ========================================================= */

    function refreshScoredItems() {
        state.scoredItems = state.items.map((row) => {
            const roleKey = getHeroEffectiveRole(row.equippedHero);
            return window.dd1GearScoring.scoreRow(row, roleKey);
        });
    }

    function heroMatchesSearch(hero) {
        if (!state.searchText) {
            return true;
        }

        const heroItems = getHeroItems(hero.name);
        const roleLabel = getHeroEffectiveRoleLabel(hero.name);
        const haystack = [
            hero.name,
            hero.className,
            hero.suggestedRole,
            roleLabel,
            heroItems.map((item) => `${item.name} ${item.itemType} ${item.quality} ${item.armorSet}`).join(" ")
        ].join(" ").toLowerCase();

        return haystack.includes(state.searchText.toLowerCase());
    }

    function itemMatchesSearch(row) {
        if (!state.searchText) {
            return true;
        }

        const searchText = state.searchText.toLowerCase();
        const haystack = [
            row.name,
            row.template,
            row.quality,
            row.itemType,
            row.armorSet,
            row.equippedHero,
            row.equippedHeroClass,
            row.location,
            row.scoreRoleLabel,
            Object.values(row.stats || {}).join(" "),
            Object.values(row.resists || {}).join(" ")
        ].join(" ").toLowerCase();

        return haystack.includes(searchText);
    }

    function getFilteredFocusedItems() {
        if (!state.focusedHero) {
            return [];
        }

        const focusedItems = state.scoredItems.filter((row) => {
            const heroMatches = row.equippedHero === state.focusedHero;
            const typeMatches = state.typeFilter === "all" || row.itemType === state.typeFilter;
            const setMatches = state.setFilter === "all" || row.armorSet === state.setFilter;

            return heroMatches && typeMatches && setMatches && itemMatchesSearch(row);
        });

        switch (state.sortMode) {
            case "score-desc":
                return focusedItems.sort((first, second) => second.score - first.score);

            case "score-asc":
                return focusedItems.sort((first, second) => first.score - second.score);

            case "type-asc":
                return focusedItems.sort((first, second) => {
                    const slotDifference = getSlotSortValue(first.itemType) - getSlotSortValue(second.itemType);

                    if (slotDifference !== 0) {
                        return slotDifference;
                    }

                    return first.itemType.localeCompare(second.itemType);
                });

            case "level-desc":
                return focusedItems.sort((first, second) => second.maxLevel - first.maxLevel);

            case "slot-asc":
            default:
                return focusedItems.sort((first, second) => {
                    const slotDifference = getSlotSortValue(first.itemType) - getSlotSortValue(second.itemType);

                    if (slotDifference !== 0) {
                        return slotDifference;
                    }

                    return second.score - first.score;
                });
        }
    }

    /* =========================================================
       8. Summary Rendering
    ========================================================= */

    function renderSummary() {
        const focusedRoleLabel = state.focusedHero
            ? getHeroEffectiveRoleLabel(state.focusedHero)
            : getDefaultRoleLabel();

        elements.summaryHeroes.textContent = formatNumber(state.heroes.length);
        elements.summaryItems.textContent = formatNumber(state.items.length);
        elements.summaryInventory.textContent = state.dataSource || "Pending";
        elements.summaryRole.textContent = focusedRoleLabel;
    }

    /* =========================================================
       9. Hero Card Rendering
    ========================================================= */

    function renderHeroRoleSelect(hero) {
        const autoRoleKey = getHeroAutoRole(hero.name);
        const autoRoleLabel = window.dd1GearScoring.getRole(autoRoleKey).label;
        const currentValue = state.heroRoleOverrides[hero.name] || "auto";
        const manualOptions = window.dd1GearScoring.getRoleOptions(false);

        return `
            <label class="gear-hero-role-control">
                <span>Archetype</span>
                <select data-gear-role-hero="${escapeText(hero.name)}">
                    <option value="auto">Auto: ${escapeText(autoRoleLabel)}</option>
                    ${manualOptions.map((role) => `
                        <option value="${escapeText(role.value)}" ${currentValue === role.value ? "selected" : ""}>
                            Manual: ${escapeText(role.label)}
                        </option>
                    `).join("")}
                </select>
            </label>
        `;
    }

    function renderHeroSlotGroups(heroItems) {
        if (heroItems.length === 0) {
            return `<p class="gear-empty">No equipped gear rows found for this hero.</p>`;
        }

        const groups = groupItemsBySlot(heroItems);

        return `
            <div class="gear-slot-grid">
                ${groups.map(([slot, items]) => {
                    const strongest = getStrongestItems(items, 1)[0];
                    const itemCountText = items.length === 1 ? "1 item" : `${items.length} items`;

                    return `
                        <article class="gear-slot-pill">
                            <div class="gear-slot-pill-header">
                                <strong>${escapeText(slot)}</strong>
                                <span>${escapeText(itemCountText)}</span>
                            </div>
                            <p>${escapeText(strongest ? strongest.name : "No item")}</p>
                            <small>
                                Score ${formatNumber(strongest ? strongest.score : 0)}
                                ${strongest ? ` • ${escapeText(strongest.quality)}` : ""}
                            </small>
                        </article>
                    `;
                }).join("")}
            </div>
        `;
    }

    function renderWeakPiece(heroItems, heroName) {
        if (heroItems.length === 0) {
            return "";
        }

        const weakest = getWeakestItems(heroItems, 1)[0];

        if (!weakest) {
            return "";
        }

        return `
            <div class="gear-weak-piece">
                <strong>Weakest piece for ${escapeText(getHeroEffectiveRoleLabel(heroName))}:</strong>
                <span>${escapeText(weakest.itemType)} — ${escapeText(weakest.name)} (${formatNumber(weakest.score)})</span>
            </div>
        `;
    }

    function renderHeroList() {
        if (state.heroes.length === 0) {
            elements.heroList.innerHTML = `<p class="gear-empty">Load a save file to see heroes.</p>`;
            return;
        }

        const visibleHeroes = state.heroes.filter(heroMatchesSearch);

        if (visibleHeroes.length === 0) {
            elements.heroList.innerHTML = `<p class="gear-empty">No heroes match the current search.</p>`;
            return;
        }

        elements.heroList.innerHTML = visibleHeroes.map((hero) => {
            const stats = hero.totalStats || {};
            const resists = hero.resistances || {};
            const heroItems = getHeroItems(hero.name);
            const isActive = state.focusedHero === hero.name;
            const roleSource = getHeroRoleSource(hero.name);

            return `
                <article class="gear-hero-card ${isActive ? "is-active" : ""}">
                    <div class="gear-hero-card-top">
                        <div>
                            <h3>${escapeText(hero.name)}</h3>
                            <p>${escapeText(hero.className)} • Level ${formatNumber(hero.level)}</p>
                        </div>
                        <button class="gear-mini-button" type="button" data-gear-hero="${escapeText(hero.name)}">
                            ${isActive ? "Focused" : "Focus hero"}
                        </button>
                    </div>

                    ${renderHeroRoleSelect(hero)}

                    <dl>
                        <div><dt>Role source</dt><dd>${escapeText(roleSource)}</dd></div>
                        <div><dt>Scoring as</dt><dd>${escapeText(getHeroEffectiveRoleLabel(hero.name))}</dd></div>
                        <div><dt>Equipped rows</dt><dd>${formatNumber(heroItems.length || hero.equipmentCount)}</dd></div>
                        <div><dt>Tower</dt><dd>HP ${formatNumber(stats.towerHealth)} / DMG ${formatNumber(stats.towerDamage)} / Rate ${formatNumber(stats.towerRate)}</dd></div>
                        <div><dt>Hero</dt><dd>HP ${formatNumber(stats.heroHealth)} / DMG ${formatNumber(stats.heroDamage)} / Cast ${formatNumber(stats.heroCasting)}</dd></div>
                        <div><dt>Raw resists</dt><dd>${formatNumber(resists.generic)} / ${formatNumber(resists.poison)} / ${formatNumber(resists.fire)} / ${formatNumber(resists.lightning)}</dd></div>
                    </dl>

                    ${renderWeakPiece(heroItems, hero.name)}
                    ${renderHeroSlotGroups(heroItems)}
                </article>
            `;
        }).join("");
    }

    /* =========================================================
       10. Gear Notes Rendering
    ========================================================= */

    function buildRecommendationNotes(filteredItems) {
        const focusedHero = getHeroByName(state.focusedHero);

        if (!focusedHero) {
            return [
                {
                    type: "empty",
                    title: "No focused hero yet",
                    text: "Load a save file and choose a hero to see gear notes."
                }
            ];
        }

        const roleKey = getHeroEffectiveRole(focusedHero.name);
        const role = window.dd1GearScoring.getRole(roleKey);
        const roleSource = getHeroRoleSource(focusedHero.name);

        if (filteredItems.length === 0) {
            return [
                {
                    type: "empty",
                    title: `${focusedHero.name}: no matching gear`,
                    text: "This focused hero has no gear rows that match the current type, set, and search filters."
                }
            ];
        }

        const notes = [
            {
                type: "info",
                title: `${focusedHero.name} is scored as ${role.label}`,
                text: `${roleSource} archetype. ${role.description}`
            }
        ];

        getWeakestItems(filteredItems, 4).forEach((row) => {
            notes.push({
                type: "warning",
                title: `Review ${row.itemType}: ${row.name}`,
                text: `Score ${row.score}. Main useful stats for ${role.label}: ${getStatText(row.strongestStats)}.`
            });
        });

        const strongest = getStrongestItems(filteredItems, 3);

        if (strongest.length > 0) {
            notes.push({
                type: "success",
                title: "Strongest focused pieces",
                text: strongest.map((row) => `${row.itemType}: ${row.name} (${row.score})`).join(" | ")
            });
        }

        notes.push({
            type: "todo",
            title: "Next optimizer step",
            text: "This reviews equipped gear for the focused hero. The next update can compare weak pieces against item-box gear and recommend exact replacements."
        });

        return notes;
    }

    function renderRecommendations(filteredItems) {
        const notes = buildRecommendationNotes(filteredItems);

        elements.recommendations.innerHTML = notes.map((note) => `
            <article class="gear-note gear-note-${escapeText(note.type)}">
                <h3>${escapeText(note.title)}</h3>
                <p>${escapeText(note.text)}</p>
            </article>
        `).join("");
    }

    /* =========================================================
       11. Focused Item Table Rendering
    ========================================================= */

    function renderTable(filteredItems) {
        const focusedHeroName = state.focusedHero || "No hero";
        const roleLabel = state.focusedHero
            ? getHeroEffectiveRoleLabel(state.focusedHero)
            : getDefaultRoleLabel();

        elements.tableCount.textContent = `${focusedHeroName} gear • ${formatNumber(filteredItems.length)} item${filteredItems.length === 1 ? "" : "s"} shown • ${roleLabel}`;

        if (filteredItems.length === 0) {
            elements.tableBody.innerHTML = `
                <tr>
                    <td colspan="10">No focused hero items match the current filters.</td>
                </tr>
            `;
            return;
        }

        elements.tableBody.innerHTML = filteredItems.map((row) => `
            <tr>
                <td data-label="Score"><strong>${formatNumber(row.score)}</strong><br><small>${escapeText(row.scoreRoleLabel)}</small></td>
                <td data-label="Hero">${escapeText(row.equippedHero)}<br><small>${escapeText(row.equippedHeroClass)}</small></td>
                <td data-label="Type">${escapeText(row.itemType)}</td>
                <td data-label="Set">${escapeText(row.armorSet)}</td>
                <td data-label="Name">${escapeText(row.name)}<br><small>${escapeText(row.template)}</small></td>
                <td data-label="Quality">${escapeText(row.quality)}</td>
                <td data-label="Lvl">${formatNumber(row.currentLevel)} / ${formatNumber(row.maxLevel)}</td>
                <td data-label="Tower">HP ${formatNumber(row.stats.towerHealth)}<br>DMG ${formatNumber(row.stats.towerDamage)}<br>Rate ${formatNumber(row.stats.towerRate)}<br>Range ${formatNumber(row.stats.towerRange)}</td>
                <td data-label="Hero">HP ${formatNumber(row.stats.heroHealth)}<br>DMG ${formatNumber(row.stats.heroDamage)}<br>Cast ${formatNumber(row.stats.heroCasting)}</td>
                <td data-label="Resists">${formatNumber(row.resists.generic)} / ${formatNumber(row.resists.poison)} / ${formatNumber(row.resists.fire)} / ${formatNumber(row.resists.lightning)}</td>
            </tr>
        `).join("");
    }

    function renderAll() {
        refreshScoredItems();
        updateFocusedGearFilters();

        const filteredItems = getFilteredFocusedItems();

        renderSummary();
        renderHeroList();
        renderRecommendations(filteredItems);
        renderTable(filteredItems);
    }

    /* =========================================================
       12. File Loading + Clearing
    ========================================================= */

    async function loadFile(file) {
        try {
            setStatus(`Reading ${file.name}...`, "normal");

            const result = await window.dd1GearSaveReader.parseFile(file);

            state.fileName = result.fileName;
            state.heroes = result.heroes;
            state.items = result.items;
            state.dataSource = result.inventoryMessage || "Loaded file";
            state.heroRoleOverrides = {};
            state.focusedHero = state.heroes.length > 0 ? state.heroes[0].name : "";

            await window.dd1GearSaveReader.saveFileForSession(file);

            updateFilterOptions();
            renderAll();

            const nonEquippedCount = result.items.filter((item) => item.source !== "equipped").length;
            let fileNote = "Equipped save-file gear loaded.";

            if (result.fileType === "csv") {
                fileNote = "CSV gear rows are loaded.";
            } else if (result.fullInventoryReady) {
                fileNote = `Full save inventory loaded, including ${formatNumber(nonEquippedCount)} item-box, tavern, shop, or inventory rows.`;
            }

            if (result.warnings && result.warnings.length > 0) {
                fileNote += ` Warning: ${result.warnings[0]}`;
            }

            setStatus(
                `Loaded ${formatNumber(result.heroes.length)} heroes and ${formatNumber(result.items.length)} items from ${result.fileName}. ${fileNote}`,
                "success"
            );
        } catch (error) {
            setStatus(error.message || "Could not read this save file.", "error");
        }
    }

    function clearPage() {
        state.fileName = "";
        state.heroes = [];
        state.items = [];
        state.scoredItems = [];
        state.focusedHero = "";
        state.heroRoleOverrides = {};
        state.typeFilter = "all";
        state.setFilter = "all";
        state.searchText = "";
        state.sortMode = "slot-asc";
        state.dataSource = "Pending";

        if (elements.fileInput) {
            elements.fileInput.value = "";
        }

        populateHeroOptions();
        elements.typeFilter.innerHTML = `<option value="all">All types</option>`;
        elements.setFilter.innerHTML = `<option value="all">All sets</option>`;
        elements.searchFilter.value = "";
        elements.sortFilter.value = "slot-asc";

        renderAll();
        setStatus("Page cleared. Your session save file was kept unless you clear site data from the checklist or optimizer page.", "normal");
    }

    async function useSessionFile() {
        try {
            const file = window.dd1GearSaveReader.getSessionFile();

            if (!file) {
                setStatus("No session save file was found. Upload a .dun file first.", "warning");
                return;
            }

            await loadFile(file);
        } catch (error) {
            setStatus(error.message || "Could not load the session file.", "error");
        }
    }

    /* =========================================================
       13. CSV Export
    ========================================================= */

    function getCsvValue(value) {
        const text = value === null || value === undefined ? "" : String(value);
        return `"${text.replace(/"/g, '""')}"`;
    }

    function exportCsv() {
        const filteredItems = getFilteredFocusedItems();

        if (filteredItems.length === 0) {
            setStatus("There are no focused hero items to export yet.", "warning");
            return;
        }

        const headers = [
            "Score",
            "Hero",
            "Class",
            "Type",
            "Set",
            "Name",
            "Quality",
            "Current Level",
            "Max Level",
            "Tower Health",
            "Tower Damage",
            "Tower Range",
            "Tower Rate",
            "Hero Health",
            "Hero Damage",
            "Hero Casting",
            "Generic Resist",
            "Poison Resist",
            "Fire Resist",
            "Lightning Resist"
        ];

        const rows = filteredItems.map((row) => [
            row.score,
            row.equippedHero,
            row.equippedHeroClass,
            row.itemType,
            row.armorSet,
            row.name,
            row.quality,
            row.currentLevel,
            row.maxLevel,
            row.stats.towerHealth,
            row.stats.towerDamage,
            row.stats.towerRange,
            row.stats.towerRate,
            row.stats.heroHealth,
            row.stats.heroDamage,
            row.stats.heroCasting,
            row.resists.generic,
            row.resists.poison,
            row.resists.fire,
            row.resists.lightning
        ]);

        const csv = [headers, ...rows].map((row) => row.map(getCsvValue).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const heroName = state.focusedHero || "focused-hero";

        link.href = url;
        link.download = `${heroName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-gear-items.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        setStatus("Focused hero CSV exported.", "success");
    }

    /* =========================================================
       14. Drag and Drop
    ========================================================= */

    function isSupportedFile(file) {
        if (!file) {
            return false;
        }

        const name = file.name.toLowerCase();
        return name.endsWith(".dun") || name.endsWith(".csv");
    }

    function setFileInputFiles(file) {
        if (!elements.fileInput || typeof DataTransfer === "undefined") {
            return;
        }

        const transfer = new DataTransfer();
        transfer.items.add(file);
        elements.fileInput.files = transfer.files;
    }

    function setupDragAndDrop() {
        if (!elements.dropZone) {
            return;
        }

        ["dragenter", "dragover"].forEach((eventName) => {
            elements.dropZone.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();
                elements.dropZone.classList.add("drag-over");
            });
        });

        ["dragleave", "drop"].forEach((eventName) => {
            elements.dropZone.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();
                elements.dropZone.classList.remove("drag-over");
            });
        });

        elements.dropZone.addEventListener("drop", (event) => {
            const file = event.dataTransfer.files && event.dataTransfer.files[0];

            if (!file) {
                setStatus("No file was dropped.", "warning");
                return;
            }

            if (!isSupportedFile(file)) {
                setStatus("Please drop a .dun save file or a .csv gear export.", "error");
                return;
            }

            setFileInputFiles(file);
            loadFile(file);
        });
    }

    /* =========================================================
       15. Event Listeners
    ========================================================= */

    function setupHeroCardActions() {
        elements.heroList.addEventListener("click", (event) => {
            const button = event.target.closest("[data-gear-hero]");

            if (!button) {
                return;
            }

            const heroName = button.dataset.gearHero;

            if (!heroName) {
                return;
            }

            state.focusedHero = heroName;
            elements.heroFilter.value = heroName;
            state.typeFilter = "all";
            state.setFilter = "all";
            elements.typeFilter.value = "all";
            elements.setFilter.value = "all";
            renderAll();
        });

        elements.heroList.addEventListener("change", (event) => {
            const select = event.target.closest("[data-gear-role-hero]");

            if (!select) {
                return;
            }

            const heroName = select.dataset.gearRoleHero;

            if (!heroName) {
                return;
            }

            if (select.value === "auto") {
                delete state.heroRoleOverrides[heroName];
            } else {
                state.heroRoleOverrides[heroName] = select.value;
            }

            renderAll();
        });
    }

    function setupEvents() {
        elements.fileInput.addEventListener("change", () => {
            const file = elements.fileInput.files && elements.fileInput.files[0];

            if (file) {
                loadFile(file);
            }
        });

        elements.useSessionButton.addEventListener("click", useSessionFile);
        elements.clearButton.addEventListener("click", clearPage);
        elements.exportButton.addEventListener("click", exportCsv);

        setupDragAndDrop();
        setupHeroCardActions();

        elements.roleFilter.addEventListener("change", () => {
            state.defaultRole = elements.roleFilter.value;
            renderAll();
        });

        elements.heroFilter.addEventListener("change", () => {
            state.focusedHero = elements.heroFilter.value;
            state.typeFilter = "all";
            state.setFilter = "all";
            elements.typeFilter.value = "all";
            elements.setFilter.value = "all";
            renderAll();
        });

        elements.typeFilter.addEventListener("change", () => {
            state.typeFilter = elements.typeFilter.value;
            renderAll();
        });

        elements.setFilter.addEventListener("change", () => {
            state.setFilter = elements.setFilter.value;
            renderAll();
        });

        elements.searchFilter.addEventListener("input", () => {
            state.searchText = elements.searchFilter.value.trim();
            renderAll();
        });

        elements.sortFilter.addEventListener("change", () => {
            state.sortMode = elements.sortFilter.value;
            renderAll();
        });
    }

    /* =========================================================
       16. Page Init
    ========================================================= */

    function initializeGearOptimizer() {
        if (!document.querySelector(".gear-page")) {
            return;
        }

        cacheElements();
        populateRoleOptions();
        setupEvents();
        renderAll();

        const sessionFile = window.dd1GearSaveReader.getSessionFile();

        if (sessionFile) {
            setStatus(`Session save file found: ${sessionFile.name}. Click "Use Session Save File" to load it here.`, "success");
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeGearOptimizer);
    } else {
        initializeGearOptimizer();
    }
})();
