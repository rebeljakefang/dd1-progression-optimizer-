/* =========================================================
   DD1 Session Save File Storage + Drag and Drop

   Shared by completion-checklist.html and optimizer.html.
   Keeps the uploaded DunDefHeroes.dun file only for the
   current browser session so users can move between pages.
========================================================= */

(() => {
    "use strict";

    const sessionFileKey = "dd1-session-save-file-data-url";
    const sessionMetaKey = "dd1-session-save-file-meta";
    const autoImportDelay = 350;

    function getCurrentPageSettings() {
        const checklistInput = document.querySelector("#save-file-input");
        const optimizerInput = document.querySelector("#optimizer-save-file-input");

        if (checklistInput) {
            return {
                pageName: "Checklist",
                fileInput: checklistInput,
                output: document.querySelector("#save-file-output"),
                storagePrefixes: [
                    "dd1",
                    "dungeon",
                    "checklist",
                    "optimizer"
                ]
            };
        }

        if (optimizerInput) {
            return {
                pageName: "Optimizer",
                fileInput: optimizerInput,
                output: document.querySelector("#optimizer-save-file-output"),
                storagePrefixes: [
                    "dd1",
                    "dungeon",
                    "checklist",
                    "optimizer"
                ]
            };
        }

        return null;
    }


    function getStoredMeta() {
        const rawMeta = sessionStorage.getItem(sessionMetaKey);

        if (!rawMeta) {
            return null;
        }

        try {
            return JSON.parse(rawMeta);
        } catch {
            return null;
        }
    }


    function setStatus(panel, message, type = "normal") {
        const status = panel.querySelector("[data-session-save-status]");

        if (!status) {
            return;
        }

        status.textContent = message;
        status.dataset.statusType = type;
    }


    function isValidDunFile(file) {
        if (!file) {
            return false;
        }

        return file.name.toLowerCase().endsWith(".dun");
    }


    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener("load", () => {
                resolve(reader.result);
            });

            reader.addEventListener("error", () => {
                reject(reader.error || new Error("Could not read the save file."));
            });

            reader.readAsDataURL(file);
        });
    }


    function dataUrlToFile(dataUrl, meta) {
        const parts = String(dataUrl).split(",");

        if (parts.length < 2) {
            throw new Error("The saved session file data is not valid.");
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


    async function saveFileForSession(file) {
        if (!isValidDunFile(file)) {
            throw new Error("Please use a Dungeon Defenders .dun save file.");
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

        return meta;
    }


    function hasSessionSaveFile() {
        return Boolean(
            sessionStorage.getItem(sessionFileKey) &&
            sessionStorage.getItem(sessionMetaKey)
        );
    }


    function getSessionSaveFile() {
        const dataUrl = sessionStorage.getItem(sessionFileKey);
        const meta = getStoredMeta();

        if (!dataUrl || !meta) {
            return null;
        }

        return dataUrlToFile(dataUrl, meta);
    }


    function setFileInputFiles(fileInput, file) {
        const transfer = new DataTransfer();

        transfer.items.add(file);
        fileInput.files = transfer.files;

        fileInput.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );
    }


    function removeMatchingStorageKeys(storage, prefixes) {
        const keysToRemove = [];

        for (let index = 0; index < storage.length; index++) {
            const key = storage.key(index);

            if (!key) {
                continue;
            }

            const lowerKey = key.toLowerCase();

            if (
                prefixes.some((prefix) => {
                    return lowerKey.includes(prefix.toLowerCase());
                })
            ) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach((key) => {
            storage.removeItem(key);
        });
    }


    function clearVisibleChecklistState() {
        const checkboxes = document.querySelectorAll("input[type='checkbox']");

        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
    }


    function clearSavedSiteData(settings) {
        removeMatchingStorageKeys(
            sessionStorage,
            settings.storagePrefixes
        );

        removeMatchingStorageKeys(
            localStorage,
            settings.storagePrefixes
        );

        sessionStorage.removeItem(sessionFileKey);
        sessionStorage.removeItem(sessionMetaKey);

        clearVisibleChecklistState();

        if (settings.fileInput) {
            settings.fileInput.value = "";
        }

        if (settings.output) {
            settings.output.innerHTML = `
                <div class="session-save-message">
                    <h3>Saved Site Data Cleared</h3>
                    <p>The session save file, checklist progress, and optimizer data were cleared.</p>
                </div>
            `;
        }
    }


    function createSessionPanel(settings) {
        const panel = document.createElement("div");
        panel.className = "session-save-panel";

        const dropZone = document.createElement("div");
        dropZone.className = "session-save-drop-zone";
        dropZone.tabIndex = 0;

        const title = document.createElement("p");
        title.className = "session-save-title";
        title.textContent = "Choose or drag your DunDefHeroes.dun file here";

        const hint = document.createElement("p");
        hint.className = "session-save-hint";
        hint.textContent = "The file is saved for this browser session so the checklist and optimizer can reuse it.";

        const status = document.createElement("p");
        status.className = "session-save-status";
        status.dataset.sessionSaveStatus = "true";
        status.dataset.statusType = "normal";
        status.textContent = "No session save file loaded yet.";

        const buttonRow = document.createElement("div");
        buttonRow.className = "session-save-actions";

        const useSavedButton = document.createElement("button");
        useSavedButton.type = "button";
        useSavedButton.className = "session-save-button";
        useSavedButton.textContent = "Use Session Save File";

        const clearButton = document.createElement("button");
        clearButton.type = "button";
        clearButton.className = "session-save-button session-save-danger";
        clearButton.textContent = "Clear Saved File and Site Data";

        const originalParent = settings.fileInput.parentNode;

        originalParent.insertBefore(panel, settings.fileInput);

        dropZone.appendChild(title);
        dropZone.appendChild(settings.fileInput);
        dropZone.appendChild(hint);

        buttonRow.appendChild(useSavedButton);
        buttonRow.appendChild(clearButton);

        panel.appendChild(dropZone);
        panel.appendChild(status);
        panel.appendChild(buttonRow);

        return {
            panel: panel,
            dropZone: dropZone,
            useSavedButton: useSavedButton,
            clearButton: clearButton
        };
    }


    async function importStoredFile(settings, panel) {
        try {
            const file = getSessionSaveFile();

            if (!file) {
                setStatus(
                    panel,
                    "No session save file is available yet.",
                    "warning"
                );
                return;
            }

            setStatus(
                panel,
                `Loading session save file: ${file.name}`,
                "normal"
            );

            setFileInputFiles(settings.fileInput, file);

            setStatus(
                panel,
                `Session save file loaded on ${settings.pageName}: ${file.name}`,
                "success"
            );
        } catch (error) {
            setStatus(
                panel,
                error.message || "Could not load the session save file.",
                "error"
            );
        }
    }


    async function handleNewFile(settings, panel, file) {
        try {
            const meta = await saveFileForSession(file);

            setStatus(
                panel,
                `Saved for this session: ${meta.name}`,
                "success"
            );
        } catch (error) {
            setStatus(
                panel,
                error.message || "Could not save this file for the session.",
                "error"
            );
        }
    }


    function setupDragAndDrop(settings, controls) {
        const panel = controls.panel;
        const dropZone = controls.dropZone;

        ["dragenter", "dragover"].forEach((eventName) => {
            dropZone.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();
                dropZone.classList.add("drag-over");
            });
        });

        ["dragleave", "drop"].forEach((eventName) => {
            dropZone.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();
                dropZone.classList.remove("drag-over");
            });
        });

        dropZone.addEventListener("drop", async (event) => {
            const file = event.dataTransfer.files && event.dataTransfer.files[0];

            if (!file) {
                setStatus(panel, "No file was dropped.", "warning");
                return;
            }

            if (!isValidDunFile(file)) {
                setStatus(panel, "Please drop a .dun save file.", "error");
                return;
            }

            await handleNewFile(settings, panel, file);
            setFileInputFiles(settings.fileInput, file);
        });
    }


    function setupFileInput(settings, controls) {
        settings.fileInput.addEventListener("change", async () => {
            const file = settings.fileInput.files && settings.fileInput.files[0];

            if (!file) {
                return;
            }

            await handleNewFile(
                settings,
                controls.panel,
                file
            );
        });
    }


    function setupButtons(settings, controls) {
        controls.useSavedButton.addEventListener("click", () => {
            importStoredFile(settings, controls.panel);
        });

        controls.clearButton.addEventListener("click", () => {
            clearSavedSiteData(settings);
            setStatus(
                controls.panel,
                "Saved file and site data were cleared. Reloading the page...",
                "success"
            );

            window.setTimeout(() => {
                window.location.reload();
            }, 650);
        });
    }


    function updateInitialStatus(settings, panel) {
        const meta = getStoredMeta();

        if (!meta) {
            setStatus(
                panel,
                "No session save file loaded yet.",
                "normal"
            );
            return;
        }

        setStatus(
            panel,
            `Session save file found: ${meta.name}. Loading it now...`,
            "success"
        );

        window.setTimeout(() => {
            importStoredFile(settings, panel);
        }, autoImportDelay);
    }


    function initializeSessionSaveFileTools() {
        const settings = getCurrentPageSettings();

        if (!settings) {
            return;
        }

        const controls = createSessionPanel(settings);

        setupDragAndDrop(settings, controls);
        setupFileInput(settings, controls);
        setupButtons(settings, controls);
        updateInitialStatus(settings, controls.panel);
    }


    window.dd1SessionSaveFile = {
        hasSessionSaveFile: hasSessionSaveFile,
        getSessionSaveFile: getSessionSaveFile,
        saveFileForSession: saveFileForSession,
        clearSavedSiteData: clearSavedSiteData
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeSessionSaveFileTools);
    } else {
        initializeSessionSaveFileTools();
    }
})();
