// Inject styles immediately
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.id = "submit-accident-prevention-style";  // Assign an ID
styleSheet.innerText = `
@keyframes moveUpwards {
    0% { transform: translateY(0%); }
    100% { transform: translateY(-200%); }  // Adjust this based on the height of textContainer. In this case, 400% height - 100% (full view) = 300%
}
`;
document.head.appendChild(styleSheet);

const overlayClassName = 'lsg-overlay';

function createOverlay(button) {
    // Capture button's styles
    const buttonStyles = window.getComputedStyle(button);
    const borderRadius = buttonStyles.borderRadius;
    const fontSize = buttonStyles.fontSize;
    const padding = buttonStyles.padding;
    const lineHeight = buttonStyles.lineHeight;
    const fontFamily = buttonStyles.fontFamily;
    const fontWeight = buttonStyles.fontWeight;

    // Create an overlay div
    const overlay = document.createElement('div');
    overlay.className = overlayClassName;  // Add a class for easier identification

    // Mimic the button's style
    overlay.style.width = button.offsetWidth + "px";
    overlay.style.height = button.offsetHeight + "px";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.zIndex = "10000";
    overlay.style.pointerEvents = "auto";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.borderRadius = borderRadius;
    overlay.style.fontSize = fontSize;
    overlay.style.lineHeight = lineHeight;
    overlay.style.fontFamily = fontFamily;
    overlay.style.fontWeight = fontWeight;
    overlay.style.padding = padding;
    overlay.style.overflow = 'hidden';

    // Set the overlay's background color to a slightly different shade of green
    overlay.style.background = "rgba(41, 111, 232, 0.8)";  // You can adjust this to your desired shade

    // Create a text container
    const textContainer = document.createElement('div');
    textContainer.style.position = 'absolute';
    textContainer.style.bottom = '-100px';  // Start 30 pixels below the button
    textContainer.style.width = '100%';
    textContainer.style.height = '300%';
    textContainer.style.display = 'flex';
    textContainer.style.justifyContent = 'center';
    textContainer.style.alignItems = 'flex-end';

    // Animation
    textContainer.style.animation = 'moveUpwards 6s linear infinite'
    textContainer.innerHTML = "Submit<br>prevention<br>is on.<br>Press Again<br>to submit<br>the solution";

    overlay.appendChild(textContainer);

    // Append the overlay to the button
    button.style.position = 'relative';
    button.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        overlay.remove();

        //reappear in 3 seconds if the overlay is pressed once
        restoreTimeout = setTimeout(() => {
            if (!document.querySelector('.' + overlayClassName)) {
                createOverlay(button);
            }
        }, 3000);
    });

    return overlay;
}

let overlayAdded = false;

function attachOverlayWhenButtonAppears() {
    const targetedSubmitButton = document.querySelector('button[data-e2e-locator="console-submit-button"]');
    if (targetedSubmitButton && !overlayAdded) { // Check the flag here
        overlayAdded = true;  // Set the flag as true

        createOverlayIfRequired();
        return true;
    }
    return false;
}

/**
*  creating overlay over submit button if required
*/
function createOverlayIfRequired() {
    const targetedSubmitButton = document.querySelector('button[data-e2e-locator="console-submit-button"]');
    if (targetedSubmitButton && !document.querySelector('.' + overlayClassName)) {
        overlay = createOverlay(targetedSubmitButton);
    }
}

chrome.storage.sync.get({ 'isPluginActive': true }, ({ isPluginActive }) => {
    if (isPluginActive) {
        if (!attachOverlayWhenButtonAppears()) {
            // If the button is not present immediately, use MutationObserver to wait for it
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        if (attachOverlayWhenButtonAppears()) {
                            observer.disconnect();  // Stop observing once the button is found and the overlay is attached
                        }
                    }
                }
            });

            // Start observing the document with the configured parameters
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
});

let overlay;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof message.isPluginActive !== 'undefined') {
        if (message.isPluginActive) {
            createOverlayIfRequired();
        } else {
            // Handle plugin deactivation, like removing overlay
            const existingOverlay = document.querySelector('.' + overlayClassName);
            if (existingOverlay) {
                existingOverlay.remove();
            }
        }
    } else if (message.action === 'restoreOverlay') {
        createOverlayIfRequired();
    }
});
