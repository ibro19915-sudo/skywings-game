import { GS } from "./gameState.js";

import { resetAllProgress } from "./inputHandlers.js";
import {
    playButton,
    shopButton,
    restartButton,
    pauseContinueButton,
pauseMainMenuButton,
    statsButton,
    settingsButton,

    shopPrevButton,
    shopNextButton,
    shopActionButton,
    shopBackButton,
    statisticsBackButton,

     settingsMusicButton,
    settingsSoundButton,
    settingsFPSButton,
    settingsDifficultyButton,
    difficultyLeftButton,
difficultyRightButton,
    settingsResetButton,
    settingsBackButton,
    settingsYesButton,
    settingsNoButton
} from "./game.js";
//settings buttons
import {
    saveSettings
} from "./settings.js";

import {
    setAudioSettings
} from "./audio.js";


import {
    onSpace,
    openSettingsMenu
} from "./inputHandlers.js";

import {
    playButtonClick
} from "./audio.js";

function flashButton(button: { setPressed(value: boolean): void }) {

    button.setPressed(true);

    setTimeout(() => {

        button.setPressed(false);

    }, 100);

}

export function handleMenuClick(
    mouseX: number,
    mouseY: number
): boolean {

 if (GS.gameOver) {

    if (restartButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(restartButton);

        onSpace();

        return true;
    }

    return true;
}   


if (GS.paused) {

    if (pauseContinueButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(pauseContinueButton);

        GS.paused = false;

        return true;
    }

    if (pauseMainMenuButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(pauseMainMenuButton);

        GS.paused = false;
GS.gameStarted = false;
GS.gameOver = false;
GS.score = 0;
GS.countdownRunning = false;
GS.showGo = false;

        return true;
    }

    

    return true;
}

    // =========================
    
    // SHOP BUTTONS
    // =========================

    if (GS.showShop) {

        if (shopPrevButton.contains(mouseX, mouseY)) {

            playButtonClick();

            flashButton(shopPrevButton);

            GS.selectedShopSkin--;

            if (GS.selectedShopSkin < 0) {
                GS.selectedShopSkin = GS.skins.length - 1;
            }

            return true;
        }

        if (shopNextButton.contains(mouseX, mouseY)) {

            playButtonClick();

            flashButton(shopNextButton);

            GS.selectedShopSkin++;

            if (GS.selectedShopSkin >= GS.skins.length) {
                GS.selectedShopSkin = 0;
            }

            return true;
        }

        if (shopActionButton.contains(mouseX, mouseY)) {

            playButtonClick();

            flashButton(shopActionButton);

            onSpace();

            return true;
        }

        if (shopBackButton.contains(mouseX, mouseY)) {

            playButtonClick();

            flashButton(shopBackButton);

            GS.showShop = false;

            return true;
        }

        return false;
    }

//settings button
    if (GS.showSettingsMenu && GS.settingsMenuState) {

        if (GS.showResetConfirmation) {

  if (settingsYesButton.contains(mouseX, mouseY)) {

    playButtonClick();

   flashButton(settingsYesButton);

    resetAllProgress();

   GS.showResetConfirmation = false;

GS.showResetSuccess = true;
GS.resetSuccessTimer = 120;



settingsYesButton.setHoverState(false);
settingsNoButton.setHoverState(false);

    return true;
}

    if (settingsNoButton.contains(mouseX, mouseY)) {

        playButtonClick();

      flashButton(settingsNoButton);

        GS.showResetConfirmation = false;

         

    settingsYesButton.setHoverState(false);
    settingsNoButton.setHoverState(false);

        return true;
    }

    return true;
}

   
    if (settingsMusicButton.contains(mouseX, mouseY)) {

        playButtonClick();

            flashButton(settingsMusicButton);

        GS.settings.music = !GS.settings.music;

        setAudioSettings(GS.settings);

        saveSettings(GS.settings);

        return true;
    }

    if (settingsSoundButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(settingsSoundButton);

        GS.settings.soundEffects =
            !GS.settings.soundEffects;

        setAudioSettings(GS.settings);

        saveSettings(GS.settings);

        return true;
    }

    if (settingsFPSButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(settingsFPSButton);

        GS.settings.fpsCounter =
            !GS.settings.fpsCounter;

        saveSettings(GS.settings);

        return true;
    }

    if (difficultyLeftButton.contains(mouseX, mouseY)) {

    playButtonClick();

    flashButton(difficultyLeftButton);

    const difficulties = [
        "easy",
        "normal",
        "hard",
        "insane"
    ];

    const current =
        difficulties.indexOf(GS.settings.difficulty);

    const previous =
        (current - 1 + difficulties.length) %
        difficulties.length;

    GS.settings.difficulty =
        difficulties[previous] as any;

    saveSettings(GS.settings);

    return true;
}

if (difficultyRightButton.contains(mouseX, mouseY)) {

    playButtonClick();

    flashButton(difficultyRightButton);

    const difficulties = [
        "easy",
        "normal",
        "hard",
        "insane"
    ];

    const current =
        difficulties.indexOf(GS.settings.difficulty);

    const next =
        (current + 1) %
        difficulties.length;

    GS.settings.difficulty =
        difficulties[next] as any;

    saveSettings(GS.settings);

    return true;
}

  

    if (settingsBackButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(settingsBackButton);

        GS.showSettingsMenu = false;

        GS.settingsMenuState = null;

        return true;
    }

    if (settingsResetButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(settingsResetButton);

        GS.showResetConfirmation = true;

        return true;
    }
      return false;
}
    // =========================
// STATISTICS
// =========================

if (GS.showStatistics) {

    if (
        statisticsBackButton.contains(
            mouseX,
            mouseY
        )
    ) {

        playButtonClick();

        flashButton(statisticsBackButton);

        GS.showStatistics = false;

        return true;
    }

    return false;
}

    // =========================
    // MAIN MENU BUTTONS
    // =========================

    if (
    !GS.countdownRunning &&
    !GS.showGo &&
    playButton.contains(mouseX, mouseY)
) {

        playButtonClick();

        flashButton(playButton);

        onSpace();

        return true;
    }

    if (
    !GS.countdownRunning &&
    !GS.showGo &&
    !GS.showShop &&
    !GS.showStatistics &&
    !GS.showSettingsMenu &&
    shopButton.contains(mouseX, mouseY)
)  {

        playButtonClick();

        flashButton(shopButton);

        GS.showShop = true;
        GS.selectedShopSkin = 0;

        return true;
    }

    if (
    !GS.countdownRunning &&
    !GS.showGo &&
    statsButton.contains(mouseX, mouseY)
) {

        playButtonClick();

        flashButton(statsButton);

        GS.showStatistics = true;

GS.statisticsPopupScale = 0.9;
GS.statisticsPopupAlpha = 0;
GS.statisticsPopupOpening = true;

        return true;
    }

    if (
    !GS.countdownRunning &&
    !GS.showGo &&
    !GS.showShop &&
    !GS.showStatistics &&
    !GS.showSettingsMenu &&
    settingsButton.contains(mouseX, mouseY)
) {

    playButtonClick();

    flashButton(settingsButton);

    openSettingsMenu();

    return true;
}

   
   return false;
    
}