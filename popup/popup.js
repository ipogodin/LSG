const switchElement = document.getElementById('doublePressSwitch');

const storageArea = chrome.storage.sync || chrome.storage.local;

storageArea.get({ 'isDoublePressActive': true }, ({ isDoublePressActive }) => {
    switchElement.checked = isDoublePressActive;
});

switchElement.addEventListener('change', (e) => {
    storageArea.set({ 'isDoublePressActive': e.target.checked });
});
