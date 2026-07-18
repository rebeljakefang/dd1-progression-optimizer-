/* =========================================================
   DD1 Gear Save Reader

   Reads DunDefHeroes.dun through the existing save parser and
   also supports CSV gear exports for testing the new gear page.
   The full item-box inventory parser is still the next DDGO port.
========================================================= */

(() => {
    "use strict";

    const sessionFileKey = "dd1-session-save-file-data-url";
    const sessionMetaKey = "dd1-session-save-file-meta";

    function requireParser() {
        if (typeof window.parseDd1OptimizerSave !== "function") {
            throw new Error("The DD1 save parser is not loaded. Check that pako and optimizer-save-import.js are linked before the gear optimizer scripts.");
        }
    }

    function cleanText(value) {
        return window.dd1GearItemModel.cleanText(value);
    }

    function toNumber(value) {
        const number = Number(String(value || "0").replace(/,/g, ""));
        return Number.isFinite(number) ? number : 0;
    }

    function getCsvCell(row, name) {
        return row[name] === null || row[name] === undefined
            ? ""
            : String(row[name]).trim();
    }

    function parseCsvText(text) {
        const rows = [];
        let currentRow = [];
        let currentCell = "";
        let insideQuotes = false;

        for (let index = 0; index < text.length; index++) {
            const char = text[index];
            const nextChar = text[index + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    currentCell += '"';
                    index++;
                } else {
                    insideQuotes = !insideQuotes;
                }
                continue;
            }

            if (char === "," && !insideQuotes) {
                currentRow.push(currentCell);
                currentCell = "";
                continue;
            }

            if ((char === "\n" || char === "\r") && !insideQuotes) {
                if (char === "\r" && nextChar === "\n") {
                    index++;
                }

                currentRow.push(currentCell);
                rows.push(currentRow);
                currentRow = [];
                currentCell = "";
                continue;
            }

            currentCell += char;
        }

        if (currentCell.length > 0 || currentRow.length > 0) {
            currentRow.push(currentCell);
            rows.push(currentRow);
        }

        const nonEmptyRows = rows.filter((row) => {
            return row.some((cell) => String(cell).trim() !== "");
        });

        if (nonEmptyRows.length < 2) {
            return [];
        }

        const headers = nonEmptyRows[0].map((header) => {
            return String(header || "").trim();
        });

        return nonEmptyRows.slice(1).map((row) => {
            const result = {};

            headers.forEach((header, index) => {
                result[header] = row[index] || "";
            });

            return result;
        });
    }

    function buildHeroSummariesFromCsv(rows) {
        const heroMap = new Map();

        rows.forEach((row) => {
            const heroName = cleanText(getCsvCell(row, "Hero")) || "Unassigned";
            const className = cleanText(getCsvCell(row, "Class")) || "Unknown";
            const key = `${heroName}|${className}`;

            if (!heroMap.has(key)) {
                heroMap.set(key, {
                    number: heroMap.size + 1,
                    name: heroName,
                    className: className,
                    level: 0,
                    suggestedRole: "CSV Import",
                    equipmentCount: 0,
                    totalStats: {
                        heroHealth: 0,
                        heroDamage: 0,
                        heroSpeed: 0,
                        heroCasting: 0,
                        ability1: 0,
                        ability2: 0,
                        towerHealth: 0,
                        towerDamage: 0,
                        towerRange: 0,
                        towerRate: 0
                    },
                    resistances: {
                        generic: 0,
                        poison: 0,
                        fire: 0,
                        lightning: 0
                    }
                });
            }

            const hero = heroMap.get(key);
            hero.equipmentCount++;
            hero.totalStats.towerHealth += toNumber(getCsvCell(row, "Tower Health"));
            hero.totalStats.towerDamage += toNumber(getCsvCell(row, "Tower Damage"));
            hero.totalStats.towerRange += toNumber(getCsvCell(row, "Tower Range"));
            hero.totalStats.towerRate += toNumber(getCsvCell(row, "Tower Rate"));
            hero.totalStats.heroHealth += toNumber(getCsvCell(row, "Hero Health"));
            hero.totalStats.heroDamage += toNumber(getCsvCell(row, "Hero Damage"));
            hero.totalStats.heroCasting += toNumber(getCsvCell(row, "Hero Casting"));
            hero.resistances.generic += toNumber(getCsvCell(row, "Generic Resist"));
            hero.resistances.poison += toNumber(getCsvCell(row, "Poison Resist"));
            hero.resistances.fire += toNumber(getCsvCell(row, "Fire Resist"));
            hero.resistances.lightning += toNumber(getCsvCell(row, "Lightning Resist"));
        });

        return [...heroMap.values()];
    }

    function buildItemsFromCsv(rows) {
        return rows.map((row, index) => {
            const heroName = cleanText(getCsvCell(row, "Hero")) || "Unassigned";
            const className = cleanText(getCsvCell(row, "Class")) || "Unknown";
            const itemType = cleanText(getCsvCell(row, "Type")) || "Equipment";
            const armorSet = cleanText(getCsvCell(row, "Set")) || "Unknown";
            const quality = cleanText(getCsvCell(row, "Quality")) || "Unknown";
            const name = cleanText(getCsvCell(row, "Name")) || "Unnamed Equipment";

            const stats = {
                heroHealth: toNumber(getCsvCell(row, "Hero Health")),
                heroSpeed: toNumber(getCsvCell(row, "Hero Speed")),
                heroDamage: toNumber(getCsvCell(row, "Hero Damage")),
                heroCasting: toNumber(getCsvCell(row, "Hero Casting")),
                ability1: toNumber(getCsvCell(row, "Ability 1")),
                ability2: toNumber(getCsvCell(row, "Ability 2")),
                towerHealth: toNumber(getCsvCell(row, "Tower Health")),
                towerDamage: toNumber(getCsvCell(row, "Tower Damage")),
                towerRange: toNumber(getCsvCell(row, "Tower Range")),
                towerRate: toNumber(getCsvCell(row, "Tower Rate"))
            };

            const resists = {
                generic: toNumber(getCsvCell(row, "Generic Resist")),
                poison: toNumber(getCsvCell(row, "Poison Resist")),
                fire: toNumber(getCsvCell(row, "Fire Resist")),
                lightning: toNumber(getCsvCell(row, "Lightning Resist"))
            };

            return {
                id: `csv-${index + 1}-${heroName}-${itemType}-${name}`,
                source: "csv",
                location: `CSV row ${index + 1}`,
                equippedHero: heroName,
                equippedHeroClass: className,
                heroNumber: 0,
                itemNumber: index + 1,
                itemType: itemType,
                armorSet: armorSet,
                quality: quality,
                name: name,
                template: "CSV Import",
                currentLevel: toNumber(getCsvCell(row, "Current Level")),
                maxLevel: toNumber(getCsvCell(row, "Max Level")),
                stats: stats,
                resists: resists,
                towerTotal: window.dd1GearItemModel.sumStats(stats, ["towerHealth", "towerDamage", "towerRange", "towerRate"]),
                heroTotal: window.dd1GearItemModel.sumStats(stats, ["heroHealth", "heroDamage", "heroSpeed", "heroCasting", "ability1", "ability2"]),
                resistTotal: window.dd1GearItemModel.sumResists(resists),
                importedScore: toNumber(getCsvCell(row, "Score")),
                isLocked: false,
                isSecondary: false,
                rawCsvRow: row
            };
        });
    }

    async function parseDunFile(file) {
        requireParser();

        const arrayBuffer = await file.arrayBuffer();
        const saveData = window.parseDd1OptimizerSave(arrayBuffer, file.name);
        const heroes = window.dd1GearItemModel.buildHeroSummary(saveData);
        const items = window.dd1GearItemModel.buildRowsFromSaveData(saveData);

        return {
            fileName: file.name,
            fileType: "dun",
            saveData: saveData,
            heroes: heroes,
            items: items,
            fullInventoryReady: false,
            inventoryMessage: "Equipped gear from save file"
        };
    }

    async function parseCsvFile(file) {
        const text = await file.text();
        const csvRows = parseCsvText(text);

        if (csvRows.length === 0) {
            throw new Error("The CSV did not contain any gear rows.");
        }

        const heroes = buildHeroSummariesFromCsv(csvRows);
        const items = buildItemsFromCsv(csvRows);

        return {
            fileName: file.name,
            fileType: "csv",
            saveData: null,
            heroes: heroes,
            items: items,
            fullInventoryReady: true,
            inventoryMessage: "CSV gear rows"
        };
    }

    async function parseFile(file) {
        if (!file) {
            throw new Error("Choose a DunDefHeroes.dun file or gear CSV first.");
        }

        const fileName = file.name.toLowerCase();

        if (fileName.endsWith(".csv")) {
            return parseCsvFile(file);
        }

        if (fileName.endsWith(".dun")) {
            return parseDunFile(file);
        }

        throw new Error("Please choose a .dun save file or a .csv gear export.");
    }

    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener("load", () => {
                resolve(reader.result);
            });

            reader.addEventListener("error", () => {
                reject(reader.error || new Error("Could not read the selected file."));
            });

            reader.readAsDataURL(file);
        });
    }

    async function saveFileForSession(file) {
        if (!file || !file.name.toLowerCase().endsWith(".dun")) {
            return;
        }

        const dataUrl = await fileToDataUrl(file);
        const meta = {
            name: file.name,
            size: file.size,
            type: file.type || "application/octet-stream",
            lastModified: file.lastModified || Date.now(),
            savedAt: new Date().toISOString()
        };

        sessionStorage.setItem(sessionFileKey, dataUrl);
        sessionStorage.setItem(sessionMetaKey, JSON.stringify(meta));
    }

    function dataUrlToFile(dataUrl, meta) {
        const parts = String(dataUrl).split(",");

        if (parts.length < 2) {
            return null;
        }

        const base64 = parts[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);

        for (let index = 0; index < binary.length; index++) {
            bytes[index] = binary.charCodeAt(index);
        }

        return new File(
            [bytes],
            meta.name || "DunDefHeroes.dun",
            {
                type: meta.type || "application/octet-stream",
                lastModified: meta.lastModified || Date.now()
            }
        );
    }

    function getSessionFile() {
        const dataUrl = sessionStorage.getItem(sessionFileKey);
        const rawMeta = sessionStorage.getItem(sessionMetaKey);

        if (!dataUrl || !rawMeta) {
            return null;
        }

        try {
            return dataUrlToFile(dataUrl, JSON.parse(rawMeta));
        } catch {
            return null;
        }
    }

    window.dd1GearSaveReader = {
        getSessionFile: getSessionFile,
        parseFile: parseFile,
        saveFileForSession: saveFileForSession
    };
})();
