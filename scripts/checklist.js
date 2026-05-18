const checkboxes = document.querySelectorAll('input[type="checkbox"]');

function getGroupsFromCheckbox(checkbox) {
    const groupsToCheck = checkbox.dataset.checks;

    if (!groupsToCheck) {
        return [];
    }

    return groupsToCheck.split(" ");
}

function setItemsForGroup(group, checked) {
    const relatedItems = document.querySelectorAll(
        `input[data-achievement~="${group}"]`
    );

    relatedItems.forEach((item) => {
        item.checked = checked;
    });
}

function setPrerequisiteMasters(checkbox) {
    const prerequisites = checkbox.dataset.prerequisites;

    if (!prerequisites || !checkbox.checked) {
        return;
    }

    const prerequisiteGroups = prerequisites.split(" ");

    prerequisiteGroups.forEach((group) => {
        const prerequisiteMaster = document.querySelector(
            `input[data-master="${group}"]`
        );

        if (prerequisiteMaster) {
            prerequisiteMaster.checked = true;

            getGroupsFromCheckbox(prerequisiteMaster).forEach((relatedGroup) => {
                setItemsForGroup(relatedGroup, true);
            });
        }
    });
}

function updateSingleGroupMasters() {
    const masterCheckboxes = document.querySelectorAll("input[data-checks]");

    masterCheckboxes.forEach((masterCheckbox) => {
        const groups = getGroupsFromCheckbox(masterCheckbox);

        if (groups.length !== 1) {
            return;
        }

        const group = groups[0];
        const relatedItems = document.querySelectorAll(
            `input[data-achievement~="${group}"]`
        );

        if (relatedItems.length === 0) {
            return;
        }

        const allChecked = Array.from(relatedItems).every((item) => {
            return item.checked;
        });

        masterCheckbox.checked = allChecked;
    });
}

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        const groups = getGroupsFromCheckbox(checkbox);

        if (groups.length > 0) {
            groups.forEach((group) => {
                setItemsForGroup(group, checkbox.checked);
            });

            setPrerequisiteMasters(checkbox);
        }

        updateSingleGroupMasters();
    });
});