/* =========================================================
   DD1 Gear Optimizer Page

   Page events, filters, rendering, and CSV export for the
   separate gear-optimizer.html page.
========================================================= */

(() => {
    const state = {
        fileName: "",
        heroes: [],
        items: [],
        scoredItems: [],
        role: "builderDamage",
        heroFilter: "all",
        typeFilter: "all",
        setFilter: "all",
        searchText: "",
        sortMode: "score-desc",
        dataSource: "Pending"
    };

    const elements = {};

    const slotOrder = [
        "Weapon",
        "Helmet",
        "Chest",
        "Gloves",
        "Boots",
        "Pet",
        "Accessory",
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
        ability2: "Ability 2"
    };

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

    function getRoleLabel() {
        return window.dd1GearScoring.getRole(state.role).label;
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

    function normalizeSlot(type) {
        const text = String(type || "Unknown").trim();

        if (!text) {
            return "Unknown";
        }

        const lowerText = text.toLowerCase();

        if (lowerText.includes("weapon")) {
            return "Weapon";
        }

        if (lowerText.includes("helmet") || lowerText.includes("helm")) {
            return "Helmet";
        }

        if (lowerText.includes("chest") || lowerText.includes("vest") || lowerText.includes("shirt")) {
            return "Chest";
        }

        if (lowerText.includes("glove")) {
            return "Gloves";
        }

        if (lowerText.includes("boot")) {
            return "Boots";
        }

        if (lowerText.includes("pet")) {
            return "Pet";
        }

        if (lowerText.includes("accessory") || lowerText.includes("acc")) {
            return "Accessory";
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

    function getHeroItems(heroName) {
        return state.scoredItems.filter((row) => {
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
            .sort((first, second) => {
                return first.score - second.score;
            })
            .slice(0, limit);
    }

    function getStrongestItems(items, limit = 3) {
        return [...items]
            .sort((first, second) => {
                return second.score - first.score;
            })
            .slice(0, limit);
    }

    function populateRoleOptions() {
        const roleOptions = window.dd1GearScoring.getRoleOptions();

        elements.roleFilter.innerHTML = roleOptions.map((role) => {
            return `<option value="${escapeText(role.value)}">${escapeText(role.label)}</option>`;
        }).join("");

        elements.roleFilter.value = state.role;
    }

    function populateDynamicFilter(selectElement, values, allLabel) {
        const currentValue = selectElement.value || "all";

        selectElement.innerHTML = [
            `<option value="all">${escapeText(allLabel)}</option>`,
            ...values.map((value) => {
                return `<option value="${escapeText(value)}">${escapeText(value)}</option>`;
            })
        ].join("");

        selectElement.value = values.includes(currentValue)
            ? currentValue
            : "all";
    }

    function updateFilterOptions() {
        const heroNames = state.heroes.map((hero) => {
            return hero.name;
        });

        populateDynamicFilter(elements.heroFilter, heroNames, "All heroes");

        populateDynamicFilter(
            elements.typeFilter,
            window.dd1GearItemModel.getUniqueSortedValues(state.items, "itemType"),
            "All types"
        );

        populateDynamicFilter(
            elements.setFilter,
            window.dd1GearItemModel.getUniqueSortedValues(state.items, "armorSet"),
            "All sets"
        );
    }

    function refreshScoredItems() {
        state.scoredItems = window.dd1GearScoring.scoreRows(state.items, state.role);
    }

    function matchesSearch(row) {
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
            Object.values(row.stats || {}).join(" "),
            Object.values(row.resists || {}).join(" ")
        ].join(" ").toLowerCase();

        return haystack.includes(searchText);
    }

    function getFilteredItems() {
        const filtered = state.scoredItems.filter((row) => {
            const heroMatches = state.heroFilter === "all" || row.equippedHero === state.heroFilter;
            const typeMatches = state.typeFilter === "all" || row.itemType === state.typeFilter;
            const setMatches = state.setFilter === "all" || row.armorSet === state.setFilter;

            return heroMatches && typeMatches && setMatches && matchesSearch(row);
        });

        switch (state.sortMode) {
            case "score-asc":
                return filtered.sort((first, second) => {
                    return first.score - second.score;
                });

            case "hero-asc":
                return filtered.sort((first, second) => {
                    return first.equippedHero.localeCompare(second.equippedHero);
                });

            case "type-asc":
                return filtered.sort((first, second) => {
                    const slotDifference = getSlotSortValue(first.itemType) - getSlotSortValue(second.itemType);

                    if (slotDifference !== 0) {
                        return slotDifference;
                    }

                    return first.itemType.localeCompare(second.itemType);
                });

            case "level-desc":
                return filtered.sort((first, second) => {
                    return second.maxLevel - first.maxLevel;
                });

            case "score-desc":
            default:
                return filtered.sort((first, second) => {
                    return second.score - first.score;
                });
        }
    }

    function renderSummary() {
        const role = window.dd1GearScoring.getRole(state.role);

        elements.summaryHeroes.textContent = formatNumber(state.heroes.length);
        elements.summaryItems.textContent = formatNumber(state.items.length);
        elements.summaryInventory.textContent = state.dataSource || "Pending";
        elements.summaryRole.textContent = role.label;
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
                    const itemCountText = items.length === 1
                        ? "1 item"
                        : `${items.length} items`;

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

    function renderWeakPiece(heroItems) {
        if (heroItems.length === 0) {
            return "";
        }

        const weakest = getWeakestItems(heroItems, 1)[0];

        if (!weakest) {
            return "";
        }

        return `
            <div class="gear-weak-piece">
                <strong>Weakest piece for ${escapeText(getRoleLabel())}:</strong>
                <span>${escapeText(weakest.itemType)} — ${escapeText(weakest.name)} (${formatNumber(weakest.score)})</span>
            </div>
        `;
    }

    function renderHeroList() {
        if (state.heroes.length === 0) {
            elements.heroList.innerHTML = `<p class="gear-empty">Load a save file to see heroes.</p>`;
            return;
        }

        elements.heroList.innerHTML = state.heroes.map((hero) => {
            const stats = hero.totalStats || {};
            const resists = hero.resistances || {};
            const heroItems = getHeroItems(hero.name);
            const isActive = state.heroFilter === hero.name;

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

                    <dl>
                        <div><dt>Role guess</dt><dd>${escapeText(hero.suggestedRole)}</dd></div>
                        <div><dt>Equipped rows</dt><dd>${formatNumber(heroItems.length || hero.equipmentCount)}</dd></div>
                        <div><dt>Tower</dt><dd>HP ${formatNumber(stats.towerHealth)} / DMG ${formatNumber(stats.towerDamage)} / Rate ${formatNumber(stats.towerRate)}</dd></div>
                        <div><dt>Hero</dt><dd>HP ${formatNumber(stats.heroHealth)} / DMG ${formatNumber(stats.heroDamage)} / Cast ${formatNumber(stats.heroCasting)}</dd></div>
                        <div><dt>Raw resists</dt><dd>${formatNumber(resists.generic)} / ${formatNumber(resists.poison)} / ${formatNumber(resists.fire)} / ${formatNumber(resists.lightning)}</dd></div>
                    </dl>

                    ${renderWeakPiece(heroItems)}
                    ${renderHeroSlotGroups(heroItems)}
                </article>
            `;
        }).join("");
    }

    function buildRecommendationNotes(filteredItems) {
        const role = window.dd1GearScoring.getRole(state.role);

        if (filteredItems.length === 0) {
            return [
                {
                    type: "empty",
                    title: "No matching gear yet",
                    text: "Load a save file or adjust the filters to see gear notes."
                }
            ];
        }

        const notes = [
            {
                type: "info",
                title: role.label,
                text: role.description
            }
        ];

        if (state.heroFilter !== "all") {
            const weakest = getWeakestItems(filteredItems, 5);

            weakest.forEach((row) => {
                notes.push({
                    type: "warning",
                    title: `${row.itemType}: ${row.name}`,
                    text: `${row.equippedHero}'s ${row.itemType} has a ${role.label} score of ${row.score}. Main useful stats: ${getStatText(row.strongestStats)}.`
                });
            });
        } else {
            const weakestByHero = state.heroes.map((hero) => {
                const heroItems = filteredItems.filter((row) => {
                    return row.equippedHero === hero.name;
                });

                return {
                    hero: hero,
                    item: getWeakestItems(heroItems, 1)[0]
                };
            }).filter((entry) => {
                return Boolean(entry.item);
            }).slice(0, 10);

            weakestByHero.forEach((entry) => {
                notes.push({
                    type: "warning",
                    title: `${entry.hero.name}: review ${entry.item.itemType}`,
                    text: `${entry.item.name} is this hero's weakest visible piece for ${role.label}. Score: ${entry.item.score}.`
                });
            });
        }

        const strongest = getStrongestItems(filteredItems, 3);

        if (strongest.length > 0) {
            notes.push({
                type: "success",
                title: "Strongest visible pieces",
                text: strongest.map((row) => {
                    return `${row.equippedHero} ${row.itemType}: ${row.name} (${row.score})`;
                }).join(" | ")
            });
        }

        notes.push({
            type: "todo",
            title: "Next optimizer step",
            text: "This currently reviews equipped gear. Once the item-box reader is ported, the site can compare weak equipped pieces against unequipped inventory gear and recommend specific replacements."
        });

        return notes;
    }

    function renderRecommendations(filteredItems) {
        const notes = buildRecommendationNotes(filteredItems);

        elements.recommendations.innerHTML = notes.map((note) => {
            return `
                <article class="gear-note gear-note-${escapeText(note.type)}">
                    <h3>${escapeText(note.title)}</h3>
                    <p>${escapeText(note.text)}</p>
                </article>
            `;
        }).join("");
    }

    function renderTable(filteredItems) {
        elements.tableCount.textContent = `${formatNumber(filteredItems.length)} item${filteredItems.length === 1 ? "" : "s"} shown`;

        if (filteredItems.length === 0) {
            elements.tableBody.innerHTML = `
                <tr>
                    <td colspan="10">No items match the current filters.</td>
                </tr>
            `;
            return;
        }

        elements.tableBody.innerHTML = filteredItems.map((row) => {
            return `
                <tr>
                    <td data-label="Score"><strong>${formatNumber(row.score)}</strong></td>
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
            `;
        }).join("");
    }

    function renderAll() {
        refreshScoredItems();

        const filteredItems = getFilteredItems();

        renderSummary();
        renderHeroList();
        renderRecommendations(filteredItems);
        renderTable(filteredItems);
    }

    async function loadFile(file) {
        try {
            setStatus(`Reading ${file.name}...`, "normal");

            const result = await window.dd1GearSaveReader.parseFile(file);

            state.fileName = result.fileName;
            state.heroes = result.heroes;
            state.items = result.items;
            state.dataSource = result.inventoryMessage || "Loaded file";

            await window.dd1GearSaveReader.saveFileForSession(file);

            updateFilterOptions();
            renderAll();

            const fileNote = result.fileType === "csv"
                ? "CSV gear rows are loaded."
                : "Equipped save-file gear loaded. Full item-box inventory is the next parser step.";

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
        state.heroFilter = "all";
        state.typeFilter = "all";
        state.setFilter = "all";
        state.searchText = "";
        state.sortMode = "score-desc";
        state.dataSource = "Pending";

        if (elements.fileInput) {
            elements.fileInput.value = "";
        }

        updateFilterOptions();

        elements.heroFilter.value = "all";
        elements.typeFilter.value = "all";
        elements.setFilter.value = "all";
        elements.searchFilter.value = "";
        elements.sortFilter.value = "score-desc";

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

    function getCsvValue(value) {
        const text = value === null || value === undefined
            ? ""
            : String(value);

        return `"${text.replace(/"/g, '""')}"`;
    }

    function exportCsv() {
        const filteredItems = getFilteredItems();

        if (filteredItems.length === 0) {
            setStatus("There are no items to export yet.", "warning");
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

        const rows = filteredItems.map((row) => {
            return [
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
            ];
        });

        const csv = [headers, ...rows].map((row) => {
            return row.map(getCsvValue).join(",");
        }).join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "dd1-gear-items.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        setStatus("CSV exported.", "success");
    }

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

    function setupHeroCardButtons() {
        elements.heroList.addEventListener("click", (event) => {
            const button = event.target.closest("[data-gear-hero]");

            if (!button) {
                return;
            }

            const heroName = button.dataset.gearHero;

            if (!heroName) {
                return;
            }

            state.heroFilter = state.heroFilter === heroName
                ? "all"
                : heroName;

            elements.heroFilter.value = state.heroFilter;
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
        setupHeroCardButtons();

        elements.roleFilter.addEventListener("change", () => {
            state.role = elements.roleFilter.value;
            renderAll();
        });

        elements.heroFilter.addEventListener("change", () => {
            state.heroFilter = elements.heroFilter.value;
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