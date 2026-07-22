import { GS } from "./gameState.js";
import { bird, ground, clouds, pipes, initScene } from "./game.js";
import { saveUnlockedSkin, isSkinUnlocked, saveSelectedSkin, getSelectedSkin, SkinType } from "./skins.js";
import { Pipe } from "./pipe.js";
import { saveStatistics, loadStatistics } from "./statistics.js";
import { saveDifficulty, getDifficulty } from "./difficulty.js";
import { loadSettings, saveSettings } from "./settings.js";
import { createSettingsMenuState, updateSettingsMenu } from "./settingsMenu.js";
import { playWing, playScore, playHit, playDie, playMenuMusic, stopMenuMusic, setAudioSettings } from "./audio.js";
import { resetGame as resetGameInternal } from "./reset.js";
import { addXP } from "./xp.js";
import { setupInput } from "./input.js";
import { onScore } from "./achievements.js";
import {
    settingsYesButton,
    settingsNoButton
} from "./game.js";

export function setupHandlers() {
    // noop placeholder in case initialization needed later
}

export function onTogglePause(): void {
    if (GS.gameStarted && !GS.gameOver) {
        if (!GS.paused && !GS.resumeCountdownRunning) {
            GS.paused = true;
        } else if (GS.paused) {
            GS.paused = false;
            GS.resumeCountdownRunning = true;
            GS.resumeCountdown = 3;

            const timer = setInterval(() => {
                GS.resumeCountdown--;
                if (GS.resumeCountdown <= 0) {
                    clearInterval(timer);
                    GS.resumeCountdownRunning = false;
                }
            }, 1000);
        }
    }
}

export function onChangeSkinLeft(): void {
    if (GS.showShop) {
        GS.selectedShopSkin--;

        if (GS.selectedShopSkin < 0) GS.selectedShopSkin = GS.skins.length - 1;

        return;
    }

    if (!GS.gameStarted && !GS.countdownRunning && !GS.showStatistics && !GS.showSettingsMenu) {
        do {
            GS.currentSkinIndex--;
            if (GS.currentSkinIndex < 0) GS.currentSkinIndex = GS.skins.length - 1;
        } while (!isSkinUnlocked(GS.skins[GS.currentSkinIndex]));

        saveSelectedSkin(GS.skins[GS.currentSkinIndex]);
        bird.loadSkin();
    }
}

export function onChangeSkinRight(): void {
    if (GS.showShop) {
        GS.selectedShopSkin++;
        if (GS.selectedShopSkin >= GS.skins.length) GS.selectedShopSkin = 0;
        return;
    }

    if (!GS.gameStarted && !GS.countdownRunning && !GS.showStatistics && !GS.showSettingsMenu) {
        do {
            GS.currentSkinIndex++;
            if (GS.currentSkinIndex >= GS.skins.length) GS.currentSkinIndex = 0;
        } while (!isSkinUnlocked(GS.skins[GS.currentSkinIndex]));

        saveSelectedSkin(GS.skins[GS.currentSkinIndex]);
        bird.loadSkin();
    }
}

export function onChangeDifficultyPrev(): void {
    if (!GS.gameStarted && !GS.countdownRunning) {
        const currentIndex = GS.difficulties.indexOf(GS.currentDifficulty as any);
        const nextIndex = (currentIndex - 1 + GS.difficulties.length) % GS.difficulties.length;
        GS.currentDifficulty = GS.difficulties[nextIndex];
        saveDifficulty(GS.currentDifficulty);
    }
}

export function onChangeDifficultyNext(): void {
    if (!GS.gameStarted && !GS.countdownRunning) {
        const currentIndex = GS.difficulties.indexOf(GS.currentDifficulty as any);
        const nextIndex = (currentIndex + 1) % GS.difficulties.length;
        GS.currentDifficulty = GS.difficulties[nextIndex];
        saveDifficulty(GS.currentDifficulty);
    }
}

export function onSpace(): void {
    if (GS.showShop) {
        const shopSkins: SkinType[] = ["red", "blue", "gold", "diamond"];
        const requirements = [0, 50, 150, 300];

        const skin = shopSkins[GS.selectedShopSkin];
        const requiredPipes = requirements[GS.selectedShopSkin];

        const alreadyOwned = isSkinUnlocked(skin);

        const canUnlock = GS.statistics.totalPipes >= requiredPipes;

        const alreadySelected =
    GS.skins[GS.currentSkinIndex] === skin;

if (alreadySelected) {
    return;
}

if (alreadyOwned) {

    saveSelectedSkin(skin);

    GS.currentSkinIndex =
        GS.skins.indexOf(skin);

    bird.loadSkin();

    GS.showShop = false;

    return;
}

if (canUnlock) {

    const price =
        GS.skinPrices[GS.selectedShopSkin];

    if (GS.statistics.coins >= price) {

        GS.statistics.coins -= price;

        saveUnlockedSkin(skin);

        saveSelectedSkin(skin);

        GS.currentSkinIndex =
            GS.skins.indexOf(skin);

        saveStatistics(GS.statistics);

        bird.loadSkin();

        GS.showShop = false;
    }
}

return;
    }

    if (GS.showSettingsMenu || GS.showStatistics) return;

    if (!GS.gameStarted && !GS.countdownRunning && !GS.showStatistics && !GS.showSettingsMenu && !GS.showShop) {
        GS.ensureMenuMusic(playMenuMusic);
    }

    if (GS.countdownRunning || GS.showGo || GS.resumeCountdownRunning) return;

    if (!GS.gameStarted) {
        GS.countdownRunning = true;
        GS.countdown = 3;

        const timer = setInterval(() => {
            GS.countdown--;
            if (GS.countdown === 0) {
                clearInterval(timer);
                GS.countdownRunning = false;
                GS.showGo = true;
                stopMenuMusic();
                GS.menuMusicPlaying = false;

                setTimeout(() => {
                    GS.showGo = false;
                    GS.gameStarted = true;

                    GS.statistics.gamesPlayed++;
                    saveStatistics(GS.statistics);
                    bird.y = GS.menuBirdY;
                    bird.jump();
                    playWing();
                }, 700);
            }
        }, 1000);

    } else if (GS.gameOver) {
        GS.score = 0;
        GS.gameOver = false;
        GS.gameStarted = false;

        GS.newRecord = false;
        GS.paused = false;

        GS.menuTime = 0;
        GS.menuBirdY = 350;

        resetGameInternal(bird, ground, clouds, pipes, Pipe, GS.statistics);

        if (GS.settings.music && !GS.menuMusicPlaying) {
            playMenuMusic();
            GS.menuMusicPlaying = true;
        }

    } else {
        bird.jump();
        playWing();
    }
}

export function openSettingsMenu(): void {
    if (!GS.gameStarted && !GS.countdownRunning) {
        GS.settings = loadSettings();
        GS.currentDifficulty = GS.settings.difficulty;
        setAudioSettings(GS.settings);
        GS.settingsMenuState = createSettingsMenuState(GS.settings);
        GS.showSettingsMenu = true;
        GS.showResetConfirmation = false;
        GS.resetConfirmationChoice = "yes";
    }
}

export function resetAllProgress(): void {
    localStorage.removeItem("bestScore");
    localStorage.removeItem("skywings_statistics");
    localStorage.removeItem("skywings_difficulty");
    localStorage.removeItem("skywings_settings");
    localStorage.removeItem("selectedSkin");
    localStorage.removeItem("skin_blue");
    localStorage.removeItem("skin_gold");
    localStorage.removeItem("skin_diamond");
    localStorage.removeItem("skywings_achievements");
    localStorage.removeItem("skywings_medals");

    localStorage.removeItem("bird_blue_unlocked");
    localStorage.removeItem("bird_gold_unlocked");
    localStorage.removeItem("bird_diamond_unlocked");

    localStorage.setItem("bestScore", "0");

    GS.bestScore = 0;
    GS.score = 0;

    GS.statistics = loadStatistics();
    GS.currentDifficulty = getDifficulty();

    GS.settings = loadSettings();
    GS.settings.difficulty = GS.currentDifficulty;
    GS.settings.soundEffects = true;
    GS.settings.fpsCounter = false;

    saveSettings(GS.settings);
    setAudioSettings(GS.settings);
    stopMenuMusic();
    GS.menuMusicPlaying = false;

    saveSelectedSkin("red");
    GS.currentSkinIndex = 0;
    bird.loadSkin();
}

export function handleSettingsKey(key: string): void {
    if (!GS.showSettingsMenu || !GS.settingsMenuState) return;

    if (GS.showResetConfirmation) {

    if (key === "Escape") {
        GS.showResetConfirmation = false;
        return;
    }

    if (key === "ArrowLeft") {
        GS.resetConfirmationChoice = "yes";
        return;
    }

    if (key === "ArrowRight") {
        GS.resetConfirmationChoice = "no";
        return;
    }

    if (key === "Enter") {

        if (GS.resetConfirmationChoice === "yes") {
            resetAllProgress();

            GS.showResetSuccess = true;
            GS.resetSuccessTimer = 120;
        }

        GS.showResetConfirmation = false;

        settingsYesButton.setPressed(false);
        settingsNoButton.setPressed(false);

        settingsYesButton.setHoverState(false);
        settingsNoButton.setHoverState(false);

        return;
    }

    return;
}

    if (key === "Escape") {
        GS.showSettingsMenu = false;
        GS.settingsMenuState = null;
        return;
    }

    if (key === "Enter" && GS.settingsMenuState.selectedOption === "resetProgress") {
        GS.showResetConfirmation = true;
        return;
    }

    const updated = updateSettingsMenu(GS.settingsMenuState, key);
    GS.settingsMenuState = updated;
    GS.settings = updated.settings;
    GS.currentDifficulty = GS.settings.difficulty;
    setAudioSettings(GS.settings);
    saveSettings(GS.settings);

    if (GS.settings.music && !GS.gameStarted && !GS.menuMusicPlaying) {
        playMenuMusic();
        GS.menuMusicPlaying = true;
    }

    if (!GS.settings.music) {
        stopMenuMusic();
        GS.menuMusicPlaying = false;
    }

    if (GS.settings.music && !GS.menuMusicPlaying) {
        playMenuMusic();
        GS.menuMusicPlaying = true;
    }

    if (key === "Enter" && GS.settingsMenuState.selectedOption === "back") {
        GS.showSettingsMenu = false;
        GS.settingsMenuState = null;
    }
}

// Wire up keyboard/gamepad input
export function initializeInput() {
    setupInput({
        onTogglePause,
        onChangeSkinLeft,
        onChangeSkinRight,
        onChangeDifficultyPrev,
        onChangeDifficultyNext,
        onOpenShop: () => {
            if (
    !GS.gameStarted &&
    !GS.countdownRunning &&
    !GS.showGo &&
    !GS.showStatistics &&
    !GS.showSettingsMenu
) {
                GS.showShop = true;
                GS.selectedShopSkin = 0;
            }
        },
        onOpenSettings: () => {
            if (
    !GS.gameStarted &&
    !GS.countdownRunning &&
    !GS.showGo &&
    !GS.showStatistics &&
    !GS.showSettingsMenu
) {
                openSettingsMenu();
            }
        },
        onSettingsKey: (key: string) => {
            handleSettingsKey(key);
        },
        onSpace,
        onShowStatistics: () => {
    if (
        !GS.gameStarted &&
        !GS.countdownRunning &&
        !GS.showGo &&
        !GS.showStatistics &&
        !GS.showSettingsMenu
    ) {

        GS.statisticsPopupScale = 0.9;
        GS.statisticsPopupAlpha = 0;
        GS.statisticsPopupOpening = true;

        GS.showStatistics = true;
    }
},
        onHideStatistics: () => {
            if (GS.showShop) {
                GS.showShop = false;
            } else if (GS.showSettingsMenu) {
                GS.showSettingsMenu = false;
                GS.settingsMenuState = null;
            } else if (GS.showStatistics) {

    GS.statisticsClosing = true;
    GS.statisticsOpening = false;

}
        },
    });
}


