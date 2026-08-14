
import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";
import { Ground } from "./ground.js";
import { Clouds } from "./clouds.js";

import { showSkinUnlock } from "./achievements.js";
import { Button } from "./button.js";
import {
    GS,
    isPhone,
    isTouchDevice,
    isIPad
} from "./gameState.js";
import { loadImage } from "./imageLoader.js";




export const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d")!;


export let ground: Ground;
export let clouds: Clouds;
export const pipes: Pipe[] = [];

export const bronzeMedal = loadImage("assets/images/bronze.png");
export const silverMedal = loadImage("assets/images/silver.png");
export const goldMedal = loadImage("assets/images/gold.png");
export const diamondMedal = loadImage("assets/images/diamond.png");

// buttons 
export const restartButton =
    new Button(
        0,
        0,
        240,
        60,
        "RESTART",
        "↻"
    );
// Buttons
export const playButton = new Button(0, 0, 0, 0, "PLAY", "▶");
export const shopButton = new Button(0, 0, 0, 0, "SHOP", "🛒");
export const pauseButton =
    new Button(
        0,
        0,
        56,
        56,
        "",
        "⏸"
    );
export const statsButton = new Button(0, 0, 0, 0, "STATS", "📊");
export const settingsButton = new Button(0, 0, 0, 0, "SETTINGS", "⚙");

// login button
export const loginButton = new Button(0, 0, 0, 0, "LOGIN", "👤");
// statistics Back button
export const statisticsBackButton =
    new Button(
        0,
        0,
        170,
        55,
        "BACK",
        "⬅"
    );

//shop 
export const shopPrevButton = new Button(0, 0, 0, 0, "", "◀");
export const shopNextButton = new Button(0, 0, 0, 0, "", "▶");

export const shopActionButton = new Button(
    0,
    0,
    0,
    0,
    "BUY",
    "🛒"
);

export const shopBackButton = new Button(
    0,
    0,
    0,
    0,
    "BACK",
    "⬅"
);
export const settingsMusicButton =
    new Button(0, 0, 0, 0, "ON", "");

export const settingsSoundButton =
    new Button(0, 0, 0, 0, "ON", "");

export const settingsFPSButton =
    new Button(0, 0, 0, 0, "OFF", "");

export const settingsDifficultyButton =
    new Button(0, 0, 0, 0, "NORMAL", "");

//ARROW 
export const difficultyLeftButton =
    new Button(0, 0, 42, 42, "", "◀");

export const difficultyRightButton =
    new Button(0, 0, 42, 42, "", "▶");

export const settingsResetButton =
    new Button(0, 0, 0, 0, "RESET", "🗑");

export const settingsBackButton =
    new Button(0, 0, 0, 0, "BACK", "⬅");



export const pauseContinueButton =
    new Button(0, 0, 0, 0, "CONTINUE", "▶");

export const pauseMainMenuButton =
    new Button(0, 0, 0, 0, "MAIN MENU", "🏠");

//reset buttons 
export const settingsYesButton =
    new Button(0, 0, 0, 0, "YES", "✔");

export const settingsNoButton =
    new Button(0, 0, 0, 0, "NO", "✖");


//login section back button 
export const backButton = new Button(
    canvas.width / 2 - 100,
    canvas.height - 100,
    200,
    60,
    "Back",
    "←"
);

export const bird = new Bird();
export let PLAYABLE_HEIGHT = 240;
export function initScene() {
    
    ground = new Ground();
    clouds = new Clouds();


    // initialize pipes
    pipes.length = 0;
    for (let i = 0; i < 3; i++) {
        const pipe = new Pipe((localStorage.getItem("skywings_difficulty") as any) || "normal");
        pipe.x = 480 + i * 250;
        pipes.push(pipe);
    }

    resizeCanvas();
    PLAYABLE_HEIGHT = Math.max(
    240,
    canvas.height - ground.height
);
    bird.loadSkin();

   
}
const DESKTOP_MENU_BUTTON_WIDTH = 260;
const DESKTOP_MENU_BUTTON_HEIGHT = 60;
const DESKTOP_MENU_BUTTON_SPACING = 18;
const DESKTOP_LAYOUT_PANEL_WIDTH = 220;
const DESKTOP_LAYOUT_PANEL_HEIGHT = 60;
const DESKTOP_SETTINGS_VALUE_WIDTH = 140;
const DESKTOP_SETTINGS_VALUE_HEIGHT = 55;
const DESKTOP_SETTINGS_DIFFICULTY_WIDTH = 150;
const DESKTOP_SETTINGS_DIFFICULTY_HEIGHT = 55;
const DESKTOP_SETTINGS_ARROW_SIZE = 40;
const DESKTOP_RESTART_WIDTH = 240;
const DESKTOP_RESTART_HEIGHT = 60;
const DESKTOP_PAUSE_BUTTON_TOUCH_WIDTH = 56;
const DESKTOP_PAUSE_BUTTON_TOUCH_HEIGHT = 56;
const DESKTOP_PAUSE_BUTTON_TOP_PADDING = 20;
const DESKTOP_PAUSE_BUTTON_RIGHT_PADDING = 20;
const DESKTOP_PAUSE_BUTTON_PHONE_WIDTH = 60;
const DESKTOP_PAUSE_BUTTON_PHONE_HEIGHT = 60;
const DESKTOP_PAUSE_BUTTON_PHONE_TOP_PADDING = 24;
const DESKTOP_PAUSE_BUTTON_PHONE_RIGHT_PADDING = 24;
const TABLET_MAIN_MENU_BUTTON_WIDTH = 320;
const TABLET_MAIN_MENU_BUTTON_HEIGHT = 72;
const TABLET_MAIN_MENU_BUTTON_SPACING = 22;
const TABLET_RESTART_WIDTH = 300;
const TABLET_RESTART_HEIGHT = 70;
const TABLET_PAUSE_BUTTON_WIDTH = 70;
const TABLET_PAUSE_BUTTON_HEIGHT = 70;
const TABLET_PAUSE_BUTTON_RIGHT_PADDING = 30;
const TABLET_PAUSE_BUTTON_TOP_PADDING = 30;
const PHONE_MAIN_MENU_BUTTON_WIDTH_RATIO = 0.55;
const PHONE_MAIN_MENU_BUTTON_HEIGHT = 60;
const PHONE_MAIN_MENU_BUTTON_SPACING = 18;

function setButtonBounds(button: Button, width: number, height: number, x: number, y: number): void {
    button.width = width;
    button.height = height;
    button.x = x;
    button.y = y;
}

function centerButton(button: Button, width: number, height: number, y: number): void {
    setButtonBounds(button, width, height, (canvas.width - width) / 2, y);
}

function layoutMainMenuButtons(
    buttons: Button[],
    width: number,
    height: number,
    spacing: number,
    startY: number,
    centerX: number
): void {
    buttons.forEach((button, index) => {
        button.x = centerX;
        button.y = startY + index * (height + spacing);
        button.width = width;
        button.height = height;

        if (!button.entrancePlayed && button.delay === 0) {
            button.delay = index * 8;
        }
    });
}

function layoutDesktopMainMenu(): void {
    const buttonWidth = Math.min(canvas.width * 0.42, DESKTOP_MENU_BUTTON_WIDTH);
    const buttonHeight = Math.min(canvas.height * 0.085, DESKTOP_MENU_BUTTON_HEIGHT);
    const spacing = DESKTOP_MENU_BUTTON_SPACING;
    const startY = 170;
    const centerX = (canvas.width - buttonWidth) / 2;

    layoutMainMenuButtons(
       [
    playButton,
    shopButton,
    statsButton,
    settingsButton,
    loginButton
],
        buttonWidth,
        buttonHeight,
        spacing,
        startY,
        centerX
    );
}

function layoutPhoneMainMenu(): void {
    const buttonWidth = canvas.width * PHONE_MAIN_MENU_BUTTON_WIDTH_RATIO;
    const startY = canvas.height * 0.42;
    const centerX = (canvas.width - buttonWidth) / 2;

    layoutMainMenuButtons(
       [
    playButton,
    shopButton,
    statsButton,
    settingsButton,
    loginButton
],
        buttonWidth,
        PHONE_MAIN_MENU_BUTTON_HEIGHT,
        PHONE_MAIN_MENU_BUTTON_SPACING,
        startY,
        centerX
    );
}

function layoutTabletMainMenu(): void {
    const centerX = (canvas.width - TABLET_MAIN_MENU_BUTTON_WIDTH) / 2;
    const startY = canvas.height * 0.28;

    layoutMainMenuButtons(
        [
    playButton,
    shopButton,
    statsButton,
    settingsButton,
    loginButton
],
        TABLET_MAIN_MENU_BUTTON_WIDTH,
        TABLET_MAIN_MENU_BUTTON_HEIGHT,
        TABLET_MAIN_MENU_BUTTON_SPACING,
        startY,
        centerX
    );
}

function layoutDesktopShop(): void {
    shopPrevButton.x = canvas.width * 0.18;
    shopPrevButton.y = canvas.height * 0.38;
    shopPrevButton.width = 70;
    shopPrevButton.height = 60;

    shopNextButton.x = canvas.width * 0.68;
    shopNextButton.y = canvas.height * 0.38;
    shopNextButton.width = 70;
    shopNextButton.height = 60;

    centerButton(shopActionButton, DESKTOP_LAYOUT_PANEL_WIDTH, DESKTOP_LAYOUT_PANEL_HEIGHT, canvas.height * 0.68);
    centerButton(shopBackButton, DESKTOP_LAYOUT_PANEL_WIDTH, DESKTOP_LAYOUT_PANEL_HEIGHT, canvas.height * 0.80);
}

function layoutPhoneShop(): void {
    layoutDesktopShop();
}

function layoutTabletShop(): void {
    layoutDesktopShop();
}

function layoutDesktopSettings(): void {
    const valueX = canvas.width * 0.57;

    setButtonBounds(settingsMusicButton, DESKTOP_SETTINGS_VALUE_WIDTH, DESKTOP_SETTINGS_VALUE_HEIGHT, valueX, canvas.height * 0.26);
    setButtonBounds(settingsSoundButton, DESKTOP_SETTINGS_VALUE_WIDTH, DESKTOP_SETTINGS_VALUE_HEIGHT, valueX, canvas.height * 0.37);
    setButtonBounds(settingsFPSButton, DESKTOP_SETTINGS_VALUE_WIDTH, DESKTOP_SETTINGS_VALUE_HEIGHT, valueX, canvas.height * 0.48);

    setButtonBounds(settingsDifficultyButton, DESKTOP_SETTINGS_DIFFICULTY_WIDTH, DESKTOP_SETTINGS_DIFFICULTY_HEIGHT, valueX, canvas.height * 0.59);

    setButtonBounds(difficultyLeftButton, DESKTOP_SETTINGS_ARROW_SIZE, DESKTOP_SETTINGS_ARROW_SIZE, settingsDifficultyButton.x - 48, settingsDifficultyButton.y + 8);
    setButtonBounds(difficultyRightButton, DESKTOP_SETTINGS_ARROW_SIZE, DESKTOP_SETTINGS_ARROW_SIZE, settingsDifficultyButton.x + settingsDifficultyButton.width + 8, settingsDifficultyButton.y + 8);

    centerButton(settingsResetButton, DESKTOP_LAYOUT_PANEL_WIDTH, DESKTOP_LAYOUT_PANEL_HEIGHT, canvas.height * 0.72);
    setButtonBounds(settingsYesButton, DESKTOP_SETTINGS_DIFFICULTY_WIDTH, DESKTOP_SETTINGS_DIFFICULTY_HEIGHT, canvas.width * 0.30, canvas.height * 0.73);
    setButtonBounds(settingsNoButton, DESKTOP_SETTINGS_DIFFICULTY_WIDTH, DESKTOP_SETTINGS_DIFFICULTY_HEIGHT, canvas.width * 0.55, canvas.height * 0.73);
    centerButton(settingsBackButton, DESKTOP_LAYOUT_PANEL_WIDTH, DESKTOP_LAYOUT_PANEL_HEIGHT, canvas.height * 0.88);
}

function layoutPhoneSettings(): void {

    const labelX = canvas.width * 0.60;

    const buttonWidth = canvas.width * 0.36;
    const buttonHeight = 58;

    setButtonBounds(
        settingsMusicButton,
        buttonWidth,
        buttonHeight,
        labelX,
        canvas.height * 0.24
    );

    setButtonBounds(
        settingsSoundButton,
        buttonWidth,
        buttonHeight,
        labelX,
        canvas.height * 0.36
    );

    setButtonBounds(
        settingsFPSButton,
        buttonWidth,
        buttonHeight,
        labelX,
        canvas.height * 0.48
    );

    const arrowSize = 48;
const gap = 8;

const totalWidth =
    arrowSize +
    gap +
    buttonWidth +
    gap +
    arrowSize;

const groupX = settingsMusicButton.x - 102;
const groupY = canvas.height * 0.60;

setButtonBounds(
    difficultyLeftButton,
    arrowSize,
    arrowSize,
    groupX,
    groupY + 5
);

setButtonBounds(
    settingsDifficultyButton,
    buttonWidth,
    buttonHeight,
    groupX + arrowSize + gap,
    groupY
);

setButtonBounds(
    difficultyRightButton,
    arrowSize,
    arrowSize,
    groupX + arrowSize + gap + buttonWidth + gap,
    groupY + 5
);

   

    centerButton(
        settingsResetButton,
        canvas.width * 0.55,
        60,
        canvas.height * 0.74
    );

    centerButton(
        settingsBackButton,
        canvas.width * 0.55,
        60,
        canvas.height * 0.87
    );
}

function layoutTabletSettings(): void {
    layoutDesktopSettings();
}

function layoutDesktopStatistics(): void {
    statisticsBackButton.x = (canvas.width - statisticsBackButton.width) / 2;
    statisticsBackButton.y = canvas.height * 0.78;
}

function layoutPhoneStatistics(): void {
   layoutDesktopStatistics();
}

function layoutTabletStatistics(): void {
    layoutDesktopStatistics();
}

function layoutDesktopPause(): void {
    centerButton(pauseContinueButton, DESKTOP_RESTART_WIDTH, DESKTOP_RESTART_HEIGHT, canvas.height * 0.46);
    centerButton(pauseMainMenuButton, DESKTOP_RESTART_WIDTH, DESKTOP_RESTART_HEIGHT, canvas.height * 0.58);

    if (!isTouchDevice) {
        pauseButton.width = 0;
        pauseButton.height = 0;
    } else {
        pauseButton.width = DESKTOP_PAUSE_BUTTON_TOUCH_WIDTH;
        pauseButton.height = DESKTOP_PAUSE_BUTTON_TOUCH_HEIGHT;
        pauseButton.x = canvas.width - pauseButton.width - DESKTOP_PAUSE_BUTTON_RIGHT_PADDING;
        pauseButton.y = DESKTOP_PAUSE_BUTTON_TOP_PADDING;
    }

    if (isTouchDevice) {
        pauseButton.width = DESKTOP_PAUSE_BUTTON_PHONE_WIDTH;
        pauseButton.height = DESKTOP_PAUSE_BUTTON_PHONE_HEIGHT;
        pauseButton.x = canvas.width - pauseButton.width - DESKTOP_PAUSE_BUTTON_PHONE_RIGHT_PADDING;
        pauseButton.y = DESKTOP_PAUSE_BUTTON_PHONE_TOP_PADDING;
    }

    centerButton(restartButton, DESKTOP_RESTART_WIDTH, DESKTOP_RESTART_HEIGHT, canvas.height * 0.84);
}

function layoutPhonePause(): void {
    layoutDesktopPause();
    const centerX = (canvas.width - canvas.width * PHONE_MAIN_MENU_BUTTON_WIDTH_RATIO) / 2;
    setButtonBounds(restartButton, canvas.width * PHONE_MAIN_MENU_BUTTON_WIDTH_RATIO, DESKTOP_RESTART_HEIGHT, centerX, canvas.height * 0.80);
}

function layoutTabletPause(): void {
    layoutDesktopPause();
    centerButton(restartButton, TABLET_RESTART_WIDTH, TABLET_RESTART_HEIGHT, canvas.height * 0.82);
    setButtonBounds(pauseButton, TABLET_PAUSE_BUTTON_WIDTH, TABLET_PAUSE_BUTTON_HEIGHT, canvas.width - TABLET_PAUSE_BUTTON_WIDTH - TABLET_PAUSE_BUTTON_RIGHT_PADDING, TABLET_PAUSE_BUTTON_TOP_PADDING);
}

function layoutGameplay(): void {
    if (isIPad) {
        setButtonBounds(
            pauseButton,
            TABLET_PAUSE_BUTTON_WIDTH,
            TABLET_PAUSE_BUTTON_HEIGHT,
            canvas.width - TABLET_PAUSE_BUTTON_WIDTH - TABLET_PAUSE_BUTTON_RIGHT_PADDING,
            TABLET_PAUSE_BUTTON_TOP_PADDING
        );
    } else if (isTouchDevice) {
        setButtonBounds(
            pauseButton,
            DESKTOP_PAUSE_BUTTON_PHONE_WIDTH,
            DESKTOP_PAUSE_BUTTON_PHONE_HEIGHT,
            canvas.width - DESKTOP_PAUSE_BUTTON_PHONE_WIDTH - DESKTOP_PAUSE_BUTTON_PHONE_RIGHT_PADDING,
            DESKTOP_PAUSE_BUTTON_PHONE_TOP_PADDING
        );
    } else {
        // Hide pause button on laptop/desktop
        pauseButton.width = 0;
        pauseButton.height = 0;
    }
}

export function layoutActiveScreen(): void {
    if (GS.showShop) {
        if (isIPad) {
            layoutTabletShop();
        } else if (isTouchDevice) {
            layoutPhoneShop();
        } else {
            layoutDesktopShop();
        }

        return;
    }

    if (GS.showSettingsMenu) {
        if (isIPad) {
            layoutTabletSettings();
        } else if (isTouchDevice) {
            layoutPhoneSettings();
        } else {
            layoutDesktopSettings();
        }

        return;
    }

    if (GS.showStatistics) {
        if (isIPad) {
            layoutTabletStatistics();
        } else if (isTouchDevice) {
            layoutPhoneStatistics();
        } else {
            layoutDesktopStatistics();
        }

        return;
    }

    // PAUSED / GAME OVER
    if (GS.paused || GS.gameOver) {
        if (isIPad) {
            layoutTabletPause();
        } else if (isTouchDevice) {
            layoutPhonePause();
        } else {
            layoutDesktopPause();
        }

        return;
    }

    // ACTIVE GAMEPLAY
    if (GS.gameStarted) {
        layoutGameplay();
        return;
    }

    // MAIN MENU
    if (isIPad) {
        layoutTabletMainMenu();
    } else if (isTouchDevice) {
        layoutPhoneMainMenu();
    } else {
        layoutDesktopMainMenu();
    }
}

export function resizeCanvas(): void {
    if (isTouchDevice && !isIPad) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
    } else {
        canvas.width = 480;
        canvas.height = 640;

        canvas.style.width = "480px";
        canvas.style.height = "640px";
    }

    if (ground) {
        ground.width = canvas.width;
        ground.height = Math.max(60, Math.round(canvas.height * 0.09));
        ground.y = canvas.height - ground.height;
    }

    layoutActiveScreen();
}

export function unlockBirdByPipes(statistics: any) {
    if (statistics.totalPipes >= 50 && localStorage.getItem("bird_blue_unlocked") !== "true") {
        localStorage.setItem("bird_blue_unlocked", "true");
        showSkinUnlock("BLUE");
    }

    if (statistics.totalPipes >= 150 && localStorage.getItem("bird_gold_unlocked") !== "true") {
        localStorage.setItem("bird_gold_unlocked", "true");
        showSkinUnlock("GOLD");
    }

    if (statistics.totalPipes >= 300 && localStorage.getItem("bird_diamond_unlocked") !== "true") {
        localStorage.setItem("bird_diamond_unlocked", "true");
        showSkinUnlock("DIAMOND");
    }
}
