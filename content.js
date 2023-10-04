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
    overlay.className = 'overlay';  // Add a class for easier identification

    // Mimic the button's style
    overlay.style.width = button.offsetWidth + "px";
    overlay.style.height = button.offsetHeight + "px";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.zIndex = "10000";
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
    overlay.style.background = "rgba(77, 193, 141, 0.8)";  // You can adjust this to your desired shade

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

    return overlay;
}

let overlayAdded = false;

function attachOverlayWhenButtonAppears() {
    const targetedSubmitButton = document.querySelector('button[data-e2e-locator="console-submit-button"]');
    if (targetedSubmitButton && !overlayAdded) { // Check the flag here
        overlayAdded = true;  // Set the flag as true
        const overlay = createOverlay(targetedSubmitButton);

        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            overlay.remove();
        });

        return true;
    }
    return false;
}


chrome.storage.sync.get({ 'isDoublePressActive': true }, ({ isDoublePressActive }) => {
    if (isDoublePressActive) {
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
