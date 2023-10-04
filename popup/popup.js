const togglePluginButton = document.getElementById('togglePlugin');
const restoreOverlayButton = document.getElementById('restoreOverlay');

// Initial state check
chrome.storage.sync.get({ 'isPluginActive': true }, ({ isPluginActive }) => {
    togglePluginButton.textContent = isPluginActive ? 'Deactivate Plugin' : 'Activate Plugin';
});

togglePluginButton.addEventListener('click', () => {
    chrome.storage.sync.get({ 'isPluginActive': true }, ({ isPluginActive }) => {
        const newState = !isPluginActive;
        togglePluginButton.textContent = newState ? 'Deactivate Plugin' : 'Activate Plugin';
        chrome.storage.sync.set({ 'isPluginActive': newState });

        // Inform content script about the plugin's state
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { isPluginActive: newState });
        });
    });
});

restoreOverlayButton.addEventListener('click', () => {
    // Inform content script to restore overlay
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'restoreOverlay' });
    });
});
