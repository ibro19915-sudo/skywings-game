
import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";
import { Ground } from "./ground.js";
import { Clouds } from "./clouds.js";

import { showSkinUnlock } from "./achievements.js";
import { Button } from "./button.js";
import { isPhone, isTouchDevice } from "./gameState.js";
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

export const bird = new Bird();
export let PLAYABLE_HEIGHT = 240;
export function initScene(currentSkinIndex: number) {
    
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
function layoutMenuButtons(): void {

    const buttonWidth = Math.min(canvas.width * 0.42, 260);
    const buttonHeight = Math.min(canvas.height * 0.085, 70);

    const spacing = buttonHeight + 18;

    const startY = canvas.height * 0.32;

    const centerX = (canvas.width - buttonWidth) / 2;

    const buttons = [
        playButton,
        shopButton,
        statsButton,
        settingsButton
    ];

    buttons.forEach((button, index) => {

        button.x = centerX;
        button.y = startY + index * spacing;
        button.width = buttonWidth;
        button.height = buttonHeight;
        if (!button.entrancePlayed) {
    button.delay = index * 8;
    button.currentOffsetY = 30;
}
   


    });
    const smallButtonWidth = 70;
const smallButtonHeight = 60;

shopPrevButton.x = canvas.width * 0.18;
shopPrevButton.y = canvas.height * 0.38;
shopPrevButton.width = smallButtonWidth;
shopPrevButton.height = smallButtonHeight;

shopNextButton.x = canvas.width * 0.68;
shopNextButton.y = canvas.height * 0.38;
shopNextButton.width = smallButtonWidth;
shopNextButton.height = smallButtonHeight;

shopActionButton.x = (canvas.width - 220) / 2;
shopActionButton.y = canvas.height * 0.68;
shopActionButton.width = 220;
shopActionButton.height = 60;

shopBackButton.x = (canvas.width - 220) / 2;
shopBackButton.y = canvas.height * 0.80;
shopBackButton.width = 220;
shopBackButton.height = 60;

//settings buttons 
const settingsWidth = 140;
const settingsHeight = 55;

const valueX = canvas.width * 0.57;



settingsMusicButton.x = valueX;
settingsMusicButton.y = canvas.height * 0.26;
settingsMusicButton.width = settingsWidth;
settingsMusicButton.height = settingsHeight;

settingsSoundButton.x = valueX;
settingsSoundButton.y = canvas.height * 0.37;
settingsSoundButton.width = settingsWidth;
settingsSoundButton.height = settingsHeight;

settingsFPSButton.x = valueX;
settingsFPSButton.y = canvas.height * 0.48;
settingsFPSButton.width = settingsWidth;
settingsFPSButton.height = settingsHeight;

settingsDifficultyButton.width = 150;
settingsDifficultyButton.height = 55;

settingsDifficultyButton.x = valueX ;
settingsDifficultyButton.y = canvas.height * 0.59;

difficultyLeftButton.width = 40;
difficultyLeftButton.height = 40;

difficultyLeftButton.x =
    settingsDifficultyButton.x - 48;

difficultyLeftButton.y =
    settingsDifficultyButton.y + 8;

difficultyRightButton.width = 40;
difficultyRightButton.height = 40;

difficultyRightButton.x =
    settingsDifficultyButton.x +
    settingsDifficultyButton.width + 8;

difficultyRightButton.y =
    settingsDifficultyButton.y + 8;







settingsResetButton.x = (canvas.width - 220) / 2;
settingsResetButton.y = canvas.height * 0.72;
settingsResetButton.width = 220;
settingsResetButton.height = 60;

settingsYesButton.x = canvas.width * 0.30;
settingsYesButton.y = canvas.height * 0.73;
settingsYesButton.width = 150;
settingsYesButton.height = 55;

settingsNoButton.x = canvas.width * 0.55;
settingsNoButton.y = canvas.height * 0.73;
settingsNoButton.width = 150;
settingsNoButton.height = 55;

settingsBackButton.x = (canvas.width - 220) / 2;
settingsBackButton.y = canvas.height * 0.88;
settingsBackButton.width = 220;
settingsBackButton.height = 60;

statisticsBackButton.x =
    (canvas.width - statisticsBackButton.width) / 2;

statisticsBackButton.y =
    canvas.height * 0.78;




pauseContinueButton.width = 240;
pauseContinueButton.height = 60;

pauseContinueButton.x =
    (canvas.width - pauseContinueButton.width) / 2;

pauseContinueButton.y =
    canvas.height * 0.46;


pauseMainMenuButton.width = 240;
pauseMainMenuButton.height = 60;

pauseMainMenuButton.x =
    (canvas.width - pauseMainMenuButton.width) / 2;

pauseMainMenuButton.y =
    canvas.height * 0.58;

if (!isTouchDevice) {

    pauseButton.width = 0;
    pauseButton.height = 0;

} else {

    pauseButton.width = 56;
    pauseButton.height = 56;

    // Top-right corner
    pauseButton.x = canvas.width - pauseButton.width - 20;
    pauseButton.y = 20;

}
if (isTouchDevice) {

    pauseButton.width = 60;
    pauseButton.height = 60;

    const topPadding = 24;
    const rightPadding = 24;

    pauseButton.x =
        canvas.width -
        pauseButton.width -
        rightPadding;

    pauseButton.y = topPadding;
}
restartButton.width = 240;
restartButton.height = 60;

restartButton.x =
    (canvas.width - restartButton.width) / 2;

restartButton.y =
    canvas.height * 0.78;

}


export function resizeCanvas(): void {
    if (isPhone) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
    }

    if (ground) {
        ground.width = canvas.width;
        ground.height = Math.max(60, Math.round(canvas.height * 0.09));
        ground.y = canvas.height - ground.height;
    }

    layoutMenuButtons();
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
const shopUnlockRequirements = [0, 25, 50, 100];