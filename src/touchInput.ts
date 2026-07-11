import { GS } from "./gameState.js";
import { canvas, bird, ground, clouds, pipes } from "./game.js";
import { onChangeDifficultyNext, onChangeDifficultyPrev, onChangeSkinLeft, onChangeSkinRight, onSpace, onTogglePause, openSettingsMenu, resetAllProgress } from "./inputHandlers.js";
import { playMenuMusic, stopMenuMusic, setAudioSettings } from "./audio.js";
import { saveSettings, loadSettings } from "./settings.js";

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
    canvas.addEventListener("touchstart", (event) => {
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
        const isTopLeftCorner = x < canvas.width * 0.25 && y < canvas.height * 0.2;
        const isTopRightCorner = x > canvas.width * 0.75 && y < canvas.height * 0.2;
        const isBottomLeftCorner = x < canvas.width * 0.25 && y > canvas.height * 0.8;
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
            onChangeDifficultyNext();
            return;
        }

        if (GS.showSettingsMenu && GS.settingsMenuState) {
            if (isBottomLeftCorner) {
                GS.showSettingsMenu = false;
                GS.settingsMenuState = null;
                GS.showResetConfirmation = false;
                return;
            }

            const optionRowHeight = 54;
            const optionStartY = 180;
            const optionIndex = Math.floor((y - optionStartY + optionRowHeight / 2) / optionRowHeight);

            if (GS.showResetConfirmation) {
                if (x < canvas.width / 2) {
                    GS.resetConfirmationChoice = "yes";
                    resetAllProgress();
                    GS.showSettingsMenu = false;
                    GS.settingsMenuState = null;
                    GS.showResetConfirmation = false;
                } else {
                    GS.resetConfirmationChoice = "no";
                    GS.showResetConfirmation = false;
                }
                return;
            }

            if (optionIndex === 0) {
                const currentIndex = GS.difficulties.indexOf(GS.settingsMenuState.settings.difficulty);
                const nextIndex = (currentIndex + 1) % GS.difficulties.length;
                GS.settingsMenuState.settings.difficulty = GS.difficulties[nextIndex];
                GS.settings = GS.settingsMenuState.settings;
                GS.currentDifficulty = GS.settings.difficulty;
                saveSettings(GS.settings);
                setAudioSettings(GS.settings);
                return;
            }

            if (optionIndex === 1) {
                GS.settingsMenuState.settings.soundEffects = !GS.settingsMenuState.settings.soundEffects;
                GS.settings = GS.settingsMenuState.settings;
                saveSettings(GS.settings);
                setAudioSettings(GS.settings);
                if (GS.settings.music && !GS.gameStarted && !GS.menuMusicPlaying) {
                    playMenuMusic();
                    GS.menuMusicPlaying = true;
                }
                return;
            }

            if (optionIndex === 2) {
                GS.settingsMenuState.settings.music = !GS.settingsMenuState.settings.music;
                GS.settings = GS.settingsMenuState.settings;
                saveSettings(GS.settings);
                setAudioSettings(GS.settings);
                if (GS.settings.music && !GS.gameStarted && !GS.menuMusicPlaying) {
                    playMenuMusic();
                    GS.menuMusicPlaying = true;
                }
                if (!GS.settings.music) {
                    stopMenuMusic();
                    GS.menuMusicPlaying = false;
                }
                return;
            }

            if (optionIndex === 3) {
                GS.settingsMenuState.settings.fpsCounter = !GS.settingsMenuState.settings.fpsCounter;
                GS.settings = GS.settingsMenuState.settings;
                saveSettings(GS.settings);
                return;
            }

            if (optionIndex === 4) {
                GS.showResetConfirmation = true;
                GS.resetConfirmationChoice = "yes";
                return;
            }

            if (optionIndex === 5) {
                GS.showSettingsMenu = false;
                GS.settingsMenuState = null;
                return;
            }

            return;
        }

        if (GS.showStatistics) {
            if (isBottomLeftCorner) GS.showStatistics = false;
            return;
        }

        if (GS.showShop) {
            if (isBottomLeftCorner) {
                GS.showShop = false;
                return;
            }

            if (isLeftEdge) { onChangeSkinLeft(); return; }
            if (isRightEdge) { onChangeSkinRight(); return; }
            if (isCenterArea) { onSpace(); return; }
            return;
        }

        if (GS.gameOver) { onSpace(); return; }

        if (GS.gameStarted && GS.paused && !GS.gameOver) { onTogglePause(); return; }

        if (GS.gameStarted && !GS.paused && !GS.gameOver && isTopRightCorner) { onTogglePause(); return; }

        if (!GS.gameStarted && !GS.countdownRunning && !GS.showStatistics && !GS.showSettingsMenu) {
            if (isTopLeftCorner) { GS.showStatistics = true; return; }
            if (isTopRightCorner) { openSettingsMenu(); return; }
            if (isBottomCenter) { GS.showShop = true; GS.selectedShopSkin = 0; return; }

            if (GS.isIPhone) {
                if (isLeftEdge) { onChangeSkinLeft(); return; }
                if (isRightEdge) { onChangeSkinRight(); return; }
                if (isCenterArea) { onSpace(); return; }
                return;
            }

            if (isLeftEdge) { onChangeSkinLeft(); return; }
            if (isRightEdge) { onChangeSkinRight(); return; }

            onSpace();
            return;
        }

        if (GS.gameStarted && !GS.paused && !GS.gameOver) { onSpace(); }
    });

    canvas.addEventListener("touchend", (event) => {
        if (!GS.isTouchDevice || !GS.isIPhone || !touchStartInDifficultyZone) return;

        event.preventDefault();

        const touch = event.changedTouches[0];
        const { x, y } = getCanvasTouchCoordinates(touch.clientX, touch.clientY);
        const deltaX = x - touchStartX;
        const deltaY = y - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX < 0) onChangeDifficultyNext(); else onChangeDifficultyPrev();
        }
    });
}
