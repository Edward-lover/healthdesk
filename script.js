// ========================================
// HEALTHDESK PWA INSTALL
// WEBSITE ONLY
// ========================================

let deferredPrompt = null;

const installBtn =
    document.getElementById("installBtn");

const downloadOverlay =
    document.getElementById(
        "downloadOverlay"
    );

const downloadMessage =
    document.getElementById(
        "downloadMessage"
    );

const downloadCountdown =
    document.getElementById(
        "downloadCountdown"
    );

const downloadProgressBar =
    document.getElementById(
        "downloadProgressBar"
    );


// ========================================
// CHECK INSTALL MODE
// ========================================

const isStandalone =
    window.matchMedia(
        "(display-mode: standalone)"
    ).matches ||

    window.matchMedia(
        "(display-mode: fullscreen)"
    ).matches ||

    window.navigator.standalone === true;


// ========================================
// ONLY RUN IF BUTTON EXISTS
// ========================================

if (installBtn) {


    // ====================================
    // INSTALLED APP
    // ====================================

    if (isStandalone) {

        installBtn.style.display =
            "none";

    }


    // ====================================
    // WEBSITE
    // ====================================

    else {

        installBtn.style.display =
            "block";


        // ==================================
        // BROWSER INSTALL PROMPT
        // ==================================

        window.addEventListener(
            "beforeinstallprompt",
            function (event) {

                event.preventDefault();

                deferredPrompt = event;

                installBtn.style.display =
                    "block";

            }
        );


        // ==================================
        // DOWNLOAD BUTTON
        // ==================================

        installBtn.addEventListener(
            "click",
            function () {

                startHealthDeskDownload();

            }
        );

    }

}


// ========================================
// START DOWNLOAD
// ========================================

function startHealthDeskDownload() {


    // ====================================
    // SHOW LOADING SCREEN
    // ====================================

    if (downloadOverlay) {

        downloadOverlay.classList.add(
            "show"
        );

    }


    let secondsLeft = 15;

    let progress = 0;


    if (downloadCountdown) {

        downloadCountdown.textContent =
            "15 seconds";

    }


    if (downloadMessage) {

        downloadMessage.textContent =
            "Preparing HealthDesk for installation...";

    }


    if (downloadProgressBar) {

        downloadProgressBar.style.width =
            "0%";

    }


    // ====================================
    // COUNTDOWN
    // ====================================

    const downloadTimer =
        setInterval(
            async function () {

                secondsLeft--;

                progress =
                    ((15 - secondsLeft) / 15) *
                    100;


                if (downloadCountdown) {

                    downloadCountdown.textContent =
                        secondsLeft +
                        (
                            secondsLeft === 1
                                ? " second"
                                : " seconds"
                        );

                }


                if (downloadProgressBar) {

                    downloadProgressBar.style.width =
                        progress + "%";

                }


                // ==================================
                // FINISHED
                // ==================================

                if (secondsLeft <= 0) {

                    clearInterval(
                        downloadTimer
                    );


                    if (downloadProgressBar) {

                        downloadProgressBar.style.width =
                            "100%";

                    }


                    if (downloadMessage) {

                        downloadMessage.textContent =
                            "Opening installation...";

                    }


                    await finishHealthDeskInstall();

                }

            },
            1000
        );

}


// ========================================
// FINISH INSTALLATION
// ========================================

async function finishHealthDeskInstall() {


    // ====================================
    // ANDROID / CHROME / EDGE
    // ====================================

    if (deferredPrompt) {

        try {

            deferredPrompt.prompt();


            const result =
                await deferredPrompt.userChoice;


            console.log(
                "HealthDesk install result:",
                result.outcome
            );


            deferredPrompt = null;


            hideDownloadOverlay();


            // Keep button visible
            // because user is still
            // on the WEBSITE

            if (installBtn) {

                installBtn.style.display =
                    "block";

            }

            return;

        }

        catch (error) {

            console.error(
                "HealthDesk installation error:",
                error
            );

        }

    }


    // ====================================
    // iPHONE / iPAD
    // ====================================

    const isIOS =
        /iphone|ipad|ipod/i.test(
            navigator.userAgent
        );


    if (isIOS) {

        hideDownloadOverlay();


        alert(
            "To install HealthDesk on your iPhone or iPad:\n\n" +

            "1. Tap the Share button in Safari.\n" +

            "2. Select 'Add to Home Screen'.\n" +

            "3. Tap 'Add'.\n\n" +

            "HealthDesk will then appear on your Home Screen."
        );


        return;

    }


    // ====================================
    // OTHER BROWSERS
    // ====================================

    hideDownloadOverlay();


    alert(
        "Your browser does not provide the automatic installation prompt.\n\n" +

        "Open your browser menu and select " +

        "'Install App' or 'Add to Home Screen'."
    );

}


// ========================================
// HIDE LOADING SCREEN
// ========================================

function hideDownloadOverlay() {

    if (downloadOverlay) {

        downloadOverlay.classList.remove(
            "show"
        );

    }

}


// ========================================
// APP INSTALLED EVENT
// ========================================

window.addEventListener(
    "appinstalled",
    function () {

        console.log(
            "HealthDesk has been installed!"
        );


        // The user is still on the website.
        // Keep the button visible.

        if (installBtn && !isStandalone) {

            installBtn.style.display =
                "block";

        }

    }
);