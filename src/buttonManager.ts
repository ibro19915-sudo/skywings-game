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
    loginButton,

   

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
    settingsNoButton,

    initScene,
    bird,
    layoutActiveScreen
} from "./game.js";
import {
    openLoginScreen,
    closeLoginScreen,
    handleLoginKey,
    handleLoginFieldClick,
    loginActionButton,
    signupButton,
    loginBackButton
} from "./loginScreen.js";
//settings buttons
import {
    saveSettings
} from "./settings.js";

import {
    setAudioSettings,
    playMenuMusic,
    stopMenuMusic
} from "./audio.js";


import {
    onSpace,
    openSettingsMenu
} from "./inputHandlers.js";

import {
    playButtonClick
} from "./audio.js";

function flashButton(button: any) {

    button.setPressed(true);

    button.flash = 1;

    setTimeout(() => {

        button.setPressed(false);

    }, 100);
}

export function handleMenuClick(
    mouseX: number,
    mouseY: number
): boolean {

    

// =========================
// LOGIN SCREEN
// =========================

if (GS.showLoginScreen) {

    // Handle clicks inside email/password fields
    if (handleLoginFieldClick(mouseX, mouseY)) {
        return true;
    }

    if (loginActionButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(loginActionButton);

        setTimeout(() => {
            handleLoginKey("Enter");
            loginActionButton.setPressed(false);
        }, 100);

        return true;
    }

    if (signupButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(signupButton);

        setTimeout(() => {

            GS.loginMode =
                GS.loginMode === "login"
                    ? "signup"
                    : "login";

            GS.loginMessage = "";

            signupButton.setPressed(false);

        }, 120);

        return true;
    }

    if (loginBackButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(loginBackButton);

        setTimeout(() => {

            closeLoginScreen();

            loginBackButton.setPressed(false);

        }, 100);

        return true;
    }

    return true;
}

 if (GS.gameOver) {

    if (restartButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(restartButton);

        onSpace();
        restartButton.setPressed(false);

        return true;
    }

    return true;
}   


if (GS.paused) {

    if (pauseContinueButton.contains(mouseX, mouseY)) {

    playButtonClick();
    flashButton(pauseContinueButton);

    GS.paused = false;
    layoutActiveScreen();

GS.resumeCountdownRunning = true;
GS.resumeCountdown = 3;

const timer = setInterval(() => {
    GS.resumeCountdown--;

    if (GS.resumeCountdown <= 0) {
        clearInterval(timer);
        GS.resumeCountdownRunning = false;
    }
}, 1000);

return true;

    
}

    if (pauseMainMenuButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(pauseMainMenuButton);

       GS.paused = false;
       layoutActiveScreen();

GS.gameStarted = false;
GS.gameOver = false;
       layoutActiveScreen();

GS.score = 0;

GS.countdownRunning = false;
GS.showGo = false;

GS.resumeCountdownRunning = false;
GS.resumeCountdown = 3;

GS.newRecord = false;

GS.menuTime = 0;
GS.menuBirdY = 350;
initScene();

bird.y = GS.menuBirdY;
bird.velocityY = 0;
bird.angle = 0;

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
            layoutActiveScreen();

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

settingsYesButton.setPressed(false);
settingsNoButton.setPressed(false);

    return true;
}

    if (settingsNoButton.contains(mouseX, mouseY)) {

        playButtonClick();

      flashButton(settingsNoButton);

        GS.showResetConfirmation = false;

         

    settingsYesButton.setHoverState(false);
    settingsNoButton.setHoverState(false);
    settingsYesButton.setPressed(false);
settingsNoButton.setPressed(false);

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

if (GS.settings.music) {

    if (!GS.menuMusicPlaying) {
        playMenuMusic();
        GS.menuMusicPlaying = true;
    }

} else {

    stopMenuMusic();
    GS.menuMusicPlaying = false;

}

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
    GS.currentDifficulty = GS.settings.difficulty;

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
    GS.currentDifficulty = GS.settings.difficulty;

    return true;
}

  

    if (settingsBackButton.contains(mouseX, mouseY)) {

        playButtonClick();

        flashButton(settingsBackButton);

       GS.showSettingsMenu = false;
       layoutActiveScreen();

GS.settingsMenuState = null;

GS.showResetConfirmation = false;

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
        layoutActiveScreen();

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

       if (!GS.showShop) {
    GS.showShop = true;
    GS.selectedShopSkin = 0;
    layoutActiveScreen();
}

        return true;
    }

    if (
    !GS.countdownRunning &&
    !GS.showGo &&
    statsButton.contains(mouseX, mouseY)
) {

        playButtonClick();

        flashButton(statsButton);

        if (!GS.showStatistics) {

    GS.statisticsPopupScale = 0.9;
    GS.statisticsPopupAlpha = 0;
    GS.statisticsPopupOpening = true;

    GS.showStatistics = true;
    layoutActiveScreen();
}



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

if (
    !GS.countdownRunning &&
    !GS.showGo &&
    !GS.showShop &&
    !GS.showStatistics &&
    !GS.showSettingsMenu &&
    loginButton.contains(mouseX, mouseY)
) {
    playButtonClick();

    flashButton(loginButton);

    setTimeout(() => {
        openLoginScreen();
        loginButton.setPressed(false);
    }, 120);

    return true;
}
   
   return false;
    
}