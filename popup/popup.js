const togglePluginIcon = document.getElementById('togglePluginIcon');
const restoreOverlayIcon = document.getElementById('restoreOverlayIcon');
const pathToActivatePluginImg = "images/active_lsg.png";
const pathToDeactivatePluginImg = "images/inactive_lsg.png"
const pathToReactivateImg = "images/reactivate.png"

// Initial state check
chrome.storage.sync.get({ 'isPluginActive': true }, ({ isPluginActive }) => {
     togglePluginIcon.src = isPluginActive ? pathToActivatePluginImg : pathToDeactivatePluginImg;

      if (isPluginActive) {
         restoreOverlayIcon.style.pointerEvents = 'auto';  // Icon is clickable
         restoreOverlayIcon.style.opacity = '1';           // Full opacity
     } else {
         restoreOverlayIcon.style.pointerEvents = 'none'; // Icon is non-clickable
         restoreOverlayIcon.style.opacity = '0.5';        // Reduced opacity for visual cue
     }
});

togglePluginIcon.addEventListener('click', () => {
    chrome.storage.sync.get({ 'isPluginActive': true }, ({ isPluginActive }) => {
        const newState = !isPluginActive;
        togglePluginIcon.src = newState ? pathToActivatePluginImg : pathToDeactivatePluginImg;
        chrome.storage.sync.set({ 'isPluginActive': newState });

        // Inform content script about the plugin's state
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { isPluginActive: newState });
        });

        if (newState) {
            restoreOverlayIcon.style.pointerEvents = 'auto';  // Icon is clickable
            restoreOverlayIcon.style.opacity = '1';           // Full opacity
        } else {
            restoreOverlayIcon.style.pointerEvents = 'none'; // Icon is non-clickable
            restoreOverlayIcon.style.opacity = '0.5';        // Reduced opacity for visual cue
        }
    });
});

restoreOverlayIcon.addEventListener('click', () => {
    // Inform content script to restore overlay
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'restoreOverlay' });
    });
});


