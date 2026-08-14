import { GS } from "./gameState.js";
import { canvas, bird, ground, clouds, pipes } from "./game.js";
import {
    onChangeDifficultyNext,
    onChangeDifficultyPrev,
    onChangeSkinLeft,
    onChangeSkinRight,
    onSpace,
    openSettingsMenu,
    resetAllProgress
} from "./inputHandlers.js";
import {
playMenuMusic,
stopMenuMusic,
setAudioSettings

} from "./audio.js";

import { saveSettings, loadSettings } from "./settings.js";
//Buttons
import {
    shopButton,
    statsButton,
    settingsButton
} from "./game.js";

import {
    loginActionButton,
    loginBackButton
} from "./loginScreen.js";

import { handleMenuClick } from "./buttonManager.js";
import {
    shopBackButton,
    statisticsBackButton,
    pauseButton,
    pauseContinueButton,
    pauseMainMenuButton,
    restartButton,
    shopPrevButton,
    shopNextButton,
    shopActionButton,
    settingsBackButton,
    backButton
} from "./game.js";
import {
    settingsMusicButton,
    settingsSoundButton,
    settingsFPSButton,
    difficultyLeftButton,
    difficultyRightButton,
    settingsResetButton,
    settingsYesButton,
    settingsNoButton
} from "./game.js";
function getCanvasTouchCoordinates(clientX: number, clientY: number): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.width;
    const height = rect.height || canvas.height;

    return {
        x: (clientX - rect.left) * (canvas.width / width),
        y: (clientY - rect.top) * (canvas.height / height),
    };
}

let touchStartX = 0;
let touchStartY = 0;
let touchStartInDifficultyZone = false;

export function initTouchHandlers() {
    canvas.addEventListener(
    "touchstart",
    (event) => {
        event.preventDefault();

        if (!GS.audioUnlocked) {
            GS.audioUnlocked = true;

            if (GS.settings.music && !GS.menuMusicPlaying) {
                playMenuMusic();
                GS.menuMusicPlaying = true;
            }
        }

        if (!GS.isTouchDevice) return;

        const touch = event.touches[0];
        const { x, y } = getCanvasTouchCoordinates(touch.clientX, touch.clientY);

        touchStartX = x;
        touchStartY = y;
        touchStartInDifficultyZone = false;

        const isLeftEdge = x < canvas.width * 0.2;
        const isRightEdge = x > canvas.width * 0.8;
      
        const isBottomCenter = x >= canvas.width * 0.25 && x <= canvas.width * 0.75 && y > canvas.height * 0.8;
        const isCenterArea = x >= canvas.width * 0.25 && x <= canvas.width * 0.75;
        const difficultyTextY = canvas.height * 0.38;
        const difficultyTextBand = canvas.height * 0.06;
        const isDifficultyZone =
            GS.isIPhone &&
            !GS.gameStarted &&
            !GS.countdownRunning &&
            !GS.showStatistics &&
            !GS.showSettingsMenu &&
            !GS.showShop &&
            y >= difficultyTextY - difficultyTextBand &&
            y <= difficultyTextY + difficultyTextBand &&
            x >= canvas.width * 0.2 &&
            x <= canvas.width * 0.8;
        const isIPadDifficultyArea =
            GS.isIPad &&
            !GS.gameStarted &&
            !GS.countdownRunning &&
            !GS.showStatistics &&
            !GS.showSettingsMenu &&
            !GS.showShop &&
            x > canvas.width * 0.25 &&
            x < canvas.width * 0.75 &&
            y > 300 &&
            y < 380;

        if (isDifficultyZone) {
            touchStartInDifficultyZone = true;
            if (x < canvas.width / 2) {
                onChangeDifficultyPrev();
            } else {
                onChangeDifficultyNext();
            }
            return;
        }

        if (isIPadDifficultyArea) {

    if (x < canvas.width / 2) {
        onChangeDifficultyPrev();
    } else {
        onChangeDifficultyNext();
    }

    return;
}

// =========================
// LOGIN SCREEN
// =========================

if (GS.showLoginScreen) {
    if (loginActionButton.contains(x, y)) {
        handleMenuClick(x, y);
        return;
    }

    if (loginBackButton.contains(x, y)) {
        handleMenuClick(x, y);
        return;
    }

    return;
}

     

// Let buttonManager handle ALL menu buttons
if (!GS.gameStarted) {
    if (handleMenuClick(x, y)) {
        return;
    }
}

// PAUSED SCREEN
if (GS.paused) {
    if (handleMenuClick(x, y)) {
        return;
    }
}

// GAME OVER SCREEN
if (GS.gameOver) {
    if (handleMenuClick(x, y)) {
        return;
    }
}

// IN-GAME
if (!GS.paused && GS.gameStarted && !GS.gameOver) {
    if (pauseButton.contains(x, y)) {
        handleMenuClick(x, y);
        return;
    }

    // Tap anywhere else = flap
    onSpace();
}
     },
    { passive: false }
);

    canvas.addEventListener("touchend", (event) => {
        if (!GS.isTouchDevice) return;

        event.preventDefault();

        const touch = event.changedTouches[0];
        const { x, y } = getCanvasTouchCoordinates(touch.clientX, touch.clientY);
        const deltaX = x - touchStartX;
        const deltaY = y - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX < 0) onChangeDifficultyNext(); else onChangeDifficultyPrev();
        }
    },
{ passive: false }
);
}
