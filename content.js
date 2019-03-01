// Retrieve the hidden units from the localStorage
var hiddenUnits = localStorage.getItem('mmgaHiddenUnits') ? JSON.parse(localStorage.getItem('mmgaHiddenUnits')) : []

function isVisible(innerText) {
    // Returns boolean value depending on existence of innerText in button
    if (document.evaluate(`//*[text()='${innerText}']`,
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue === null) {
        return false
    } else {
        return true
    }
}

function getUnitElement(unitName) {
    // This is really hardcoded but why not :)
    return document.evaluate(`//*[text()='${unitName}']`,
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).
        singleNodeValue.parentElement.parentElement.parentElement.
        parentElement.parentElement

}

// Hide all hidden units or render crosses on all units depending on existence
// of a button
var callback = function () {
    if (isVisible("Customise this page")) {
        // Hide all hidden units
        for (var unit of hiddenUnits) {
            console.log(unit)

            var element = getUnitElement(unit)
            element.style.cssText = "display: none;"
        }
    } else {
        // Unhide hidden units and render crosses
        for (var unit of hiddenUnits) {
            var element = getUnitElement(unit)
            element.style.cssText = "display: flex; opacity: 0.5;"
        }

        var units = [].slice.call(document.getElementsByClassName('card mb-3 courses-view-course-item'))
        for (var unit of units) {
            // Configure button
            var button = document.createElement("BUTTON")
            var text = document.createTextNode("Toggle")
            button.appendChild(text)
            button.unitId = unit.childNodes[1].childNodes[1].childNodes[3].childNodes[1].innerText
            // Special case with weird Moodle bug
            if (button.unitId === "MLC - Mathematics Learning Centre") {
                button.unitId = "MLC  - Mathematics Learning Centre"
            }
            button.addEventListener('click', function () {
                var index = hiddenUnits.indexOf(this.unitId)
                var element = getUnitElement(this.unitId)
                if (index > -1) {
                    // Unit exists in list, so let's remove it
                    hiddenUnits.splice(index, 1)
                    element.style.cssText = "opacity: 1;" // Also do a bit of styling
                } else {
                    // Unit doesn't exist yet, so let's add it
                    hiddenUnits.push(this.unitId)
                    element.style.cssText = "opacity: 0.5;" // Also do a bit of styling

                }
                // Save the modified hidden units list to local storage
                localStorage.setItem("magaHiddenUnits", JSON.stringify(hiddenUnits));
            })
            // Attach button to unit
            unit.childNodes[1].childNodes[1].appendChild(button)
        }

    }
    observer.disconnect()
};
// Handles the loading of the units
var targetNode = document.getElementById("container-courses")
var config = { attributes: false, childList: true, subtree: false };
var observer = new MutationObserver(callback)
observer.observe(targetNode, config)
