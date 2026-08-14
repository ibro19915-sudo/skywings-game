import { DefaultLayout, PhoneLayout } from "./layout.js";
import { Bird } from "./bird.js";
import { Ground } from "./ground.js";
import { Clouds } from "./clouds.js";
import { Pipe } from "./pipe.js";
import type { Difficulty } from "./difficulty.js";
import { Statistics } from "./statistics.js";
import { isSkinUnlocked, SkinType } from "./skins.js";
import { drawPipes } from "./pipeManager.js";
import { GS } from "./gameState.js";
// Buttons 
import {
playButton,
shopButton,
statsButton,
settingsButton,
loginButton,
pauseButton,
pauseContinueButton,
restartButton,
pauseMainMenuButton
} from "./game.js";
const shopUnlockRequirements = [0, 50, 150, 300];

const IS_TOUCH =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

const IS_IPHONE =
    /iPhone/i.test(navigator.userAgent);

const IS_IPAD =
    /iPad/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" &&
     navigator.maxTouchPoints > 1);

function getSkyColor(score: number): string {
    if (score >= 30) return "#FFA500";
    if (score >= 20) return "#191970";
    if (score >= 10) return "#FF7F50";
    return "#87CEEB";
}

export function drawGameOver(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    score: number,
    bestScore: number,
    newRecord: boolean,
    achievementText: string,
    
    bronzeMedal: HTMLImageElement,
    silverMedal: HTMLImageElement,
    goldMedal: HTMLImageElement,
    diamondMedal: HTMLImageElement,
    medalText: string,
    skinUnlockText: string,
    shakeOffset: { x: number; y: number } = { x: 0, y: 0 }
): void {
    ctx.save();
    ctx.translate(shakeOffset.x, shakeOffset.y);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

   
const titleY = canvas.height * 0.08;

const scoreY = canvas.height * 0.16;
const bestScoreY = canvas.height * 0.21;

const highScoreY = canvas.height * 0.27;

const achievementTitleY = canvas.height * 0.36;
const achievementTextY = canvas.height * 0.41;

const unlockTitleY = canvas.height * 0.49;
const unlockTextY = canvas.height * 0.54;

ctx.font = "54px Arial";
ctx.fillStyle = "white";
ctx.fillText("GAME OVER", canvas.width / 2, titleY);

ctx.font = "30px Arial";
ctx.fillText(`Score: ${score}`, canvas.width / 2, scoreY);

ctx.fillText(`Best Score: ${bestScore}`, canvas.width / 2, bestScoreY);

if (newRecord) {
    ctx.fillStyle = "#FFD700";
    ctx.font = "36px Arial";
    ctx.fillText("NEW HIGH SCORE!", canvas.width / 2, highScoreY);
}

if (achievementText !== "") {
    ctx.fillStyle = "#FFD700";
    ctx.font = "24px Arial";
    ctx.fillText("NEW ACHIEVEMENT", canvas.width / 2, achievementTitleY);

    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.fillText(achievementText, canvas.width / 2, achievementTextY);
}

if (skinUnlockText !== "") {
    ctx.fillStyle = "#FFD700";
    ctx.font = "24px Arial";
    ctx.fillText("NEW BIRD UNLOCKED", canvas.width / 2, unlockTitleY);

    ctx.fillStyle = "white";
    ctx.font = "22px Arial";
    ctx.fillText(skinUnlockText, canvas.width / 2, unlockTextY);
}

let medal: HTMLImageElement | null = null;

if (score >= 50) medal = diamondMedal;
else if (score >= 30) medal = goldMedal;
else if (score >= 20) medal = silverMedal;
else if (score >= 10) medal = bronzeMedal;

if (medal) {
    const medalSize = 64;

    ctx.drawImage(
    medal,
    canvas.width / 2 - medalSize / 2,
    canvas.height * 0.63,
    medalSize,
    medalSize
);
}

restartButton.draw(ctx);


    ctx.restore();
}

export function drawPauseScreen(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
): void {

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "bold 60px Arial";

    ctx.fillText(
        "PAUSED",
        canvas.width / 2,
        canvas.height * 0.30
    );

    pauseContinueButton.draw(ctx);
pauseMainMenuButton.draw(ctx);
}

export function drawResumeCountdown(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    clouds: Clouds,
    pipes: Pipe[],
    ground: Ground,
    bird: Bird,
    resumeCountdown: number,
    score: number
): void {
   ctx.fillStyle = getSkyColor(score);
ctx.fillRect(0, 0, canvas.width, canvas.height);

    clouds.draw(ctx);
    // Draw pipes
   drawPipes(pipes, ctx);

    ground.draw(ctx);
    bird.draw(ctx);

    ctx.fillStyle = "white";
    ctx.font = "80px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        resumeCountdown.toString(),
        canvas.width / 2,
        canvas.height / 2
    );
}

export function drawMenu(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    clouds: Clouds,
    bird: Bird,
    ground: Ground,
    menuBirdY: number,
    menuTime: number,
    countdownRunning: boolean,
    countdown: number,
    showGo: boolean,
    currentSkinIndex: number,
    skins: string[],
    score: number,
    currentDifficulty: Difficulty
): void {

    const layout =
        GS.isPhone
            ? PhoneLayout
            : DefaultLayout;
   ctx.fillStyle = getSkyColor(score);
ctx.fillRect(0, 0, canvas.width, canvas.height);

   
    clouds.draw(ctx);

    if (countdownRunning || showGo) {
        // Keep background, clouds, bird, and ground visible during countdown/GO.
        bird.y = menuBirdY + Math.sin(menuTime) * 8;
        bird.draw(ctx);
        ground.update(GS.delta);
        ground.draw(ctx);

        ctx.fillStyle = "white";
        ctx.font = "80px Arial";
        ctx.textAlign = "center";

        if (countdownRunning) {
            ctx.fillText(
                countdown.toString(),
                canvas.width / 2,
                canvas.height / 2
            );
        } else {
            ctx.fillStyle = "#FFD700";
            ctx.font = "90px Arial";
            ctx.fillText(
                "GO!",
                canvas.width / 2,
                canvas.height / 2
            );
        }

        return;
    }

   ground.update(GS.delta);
ground.draw(ctx);

    ctx.fillStyle = "white";
    ctx.font = "56px Arial";
    ctx.textAlign = "center";
    const titleY = GS.isPhone
    ? canvas.height * 0.09
    : layout.menu.titleY;

ctx.fillText(
    "SKY WINGS",
    canvas.width / 2,
    titleY
);

// Online account ID
if (GS.onlineId) {
    ctx.fillStyle = "#FFD700";
    ctx.font = GS.isPhone ? "18px Arial" : "22px Arial";

    ctx.fillText(
        GS.onlineId,
        canvas.width / 2,
        titleY + (GS.isPhone ? 35 : 40)
    );
}

    

    playButton.draw(ctx);
shopButton.draw(ctx);
statsButton.draw(ctx);
settingsButton.draw(ctx);
loginButton.draw(ctx);

    
}


export function drawHUD(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    score: number,
    bestScore: number,
    statistics: Statistics,
    xpNeeded: (level: number) => number
): void {

    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
        "Score: " + score,
        20,
        40
    );

    ctx.fillText(
        "Best: " + bestScore,
        20,
        80
    );

    ctx.font = "24px Arial";

    ctx.fillStyle = "#FFd700"; 
    ctx.fillText(
        `Level: ${statistics.level}`,
        20,
        120
    );

    ctx.fillText(
        `XP: ${statistics.xp}/${xpNeeded(statistics.level)}`,
        20,
        155
    );

    ctx.fillText(
        `Coins: ${statistics.coins}`,
        20,
        190
    );

    ctx.font = "18px Arial";

if (IS_IPHONE || IS_IPAD) {

    pauseButton.draw(ctx);

} else {

    ctx.textAlign = "right";

    ctx.fillText(
        "P = Pause",
        canvas.width - 20,
        30
    );

}
}

export function drawAchievementPopup(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, achievementText: string): void {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(
         canvas.width / 2 - 170,
        120,
        340,
        70
    );
    ctx.fillStyle = "#ffd700";
    ctx.font = "28px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        achievementText,
        canvas.width / 2,
        165
    );
}

export function drawMedalPopup(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, medalText: string): void {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(
        canvas.width / 2 - 200,
        200,
        400,
        80
    );

    ctx.fillStyle = "#FFD700";
    ctx.font = "28px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        medalText,
        canvas.width / 2,
        250
    );
}

export function drawSkinUnlockPopup(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, skinUnlockText: string): void {
    ctx.fillStyle = "rgba(20,20,20,0.85)";
    ctx.fillRect(
        canvas.width / 2 - 220,
    355,
    440,
    90
    );

    ctx.strokeStyle = "#4FC3F7";
    ctx.lineWidth = 4;
    ctx.strokeRect(
        canvas.width / 2 - 220,
        355,
        440,
        90
    );
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
        "NEW SKIN UNLOCKED",
        canvas.width / 2,
        385
    );

    ctx.fillStyle = "#FFD700";
    ctx.font = "30px Arial";
    ctx.fillText(
        skinUnlockText,
        canvas.width / 2,
        420
    );
}

export function drawScorePopup(ctx: CanvasRenderingContext2D, bird: Bird): void {
    ctx.fillStyle = "#FFD700";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "+1 ✨",
        bird.x + 100,
        bird.y - 20
    );

    
}
export function drawShop(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    statistics: Statistics,
    selectedShopSkin: number
): void {

     ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const shopSkins = ["red", "blue", "gold", "diamond"];
    const prices = [0, 250, 1000, 2500];
    const requirements = [0, 50, 150, 300];

    const skin = shopSkins[selectedShopSkin];
    const price = prices[selectedShopSkin];
    const requiredPipes = requirements[selectedShopSkin];

    const owned =
    isSkinUnlocked(skin as SkinType);

    const unlocked =
        statistics.totalPipes >= requiredPipes;
    // Mobile/Desktop font sizes
const titleFont =
    GS.isPhone ? "22px Arial" : "32px Arial";

const infoFont =
    GS.isPhone ? "18px Arial" : "26px Arial";

if (owned) {

    ctx.font = titleFont;
    ctx.fillStyle = "#00FF00";

    ctx.fillText(
        "OWNED",
        canvas.width / 2,
        300
    );

}
else if (unlocked && statistics.coins >= price) {

    ctx.font = titleFont;
    ctx.fillStyle = "#FFD700";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;

    ctx.strokeText(
        "UNLOCKED",
        canvas.width / 2,
        300
    );

    ctx.fillText(
        "UNLOCKED",
        canvas.width / 2,
        300
    );

    ctx.font = infoFont;

    ctx.strokeText(
        `Price: ${price} Coins`,
        canvas.width / 2,
        340
    );

    ctx.fillText(
        `Price: ${price} Coins`,
        canvas.width / 2,
        340
    );

    ctx.strokeText(
        "Press SPACE to Buy",
        canvas.width / 2,
        380
    );

    ctx.fillText(
        "Press SPACE to Buy",
        canvas.width / 2,
        380
    );

}
else if (unlocked && statistics.coins < price) {

    ctx.font = titleFont;
    ctx.fillStyle = "#FFD700";

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;

    ctx.strokeText(
        "UNLOCKED",
        canvas.width / 2,
        300
    );

    ctx.fillText(
        "UNLOCKED",
        canvas.width / 2,
        300
    );

    ctx.font = infoFont;

    ctx.strokeText(
        `Need ${price} Coins`,
        canvas.width / 2,
        340
    );

    ctx.fillText(
        `Need ${price} Coins`,
        canvas.width / 2,
        340
    );

}
else {

    ctx.font = titleFont;
    ctx.fillStyle = "#FF4444";

    ctx.fillText(
        "LOCKED",
        canvas.width / 2,
        300
    );

    ctx.fillStyle = "#FFD700";
    ctx.font = infoFont;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;

    ctx.strokeText(
        `Pass ${requiredPipes} Pipes`,
        canvas.width / 2,
        340
    );

    ctx.fillText(
        `Pass ${requiredPipes} Pipes`,
        canvas.width / 2,
        340
    );

}

  

    // Responsive fonts
const shopTitleFont =
    GS.isPhone ? "34px Arial" : "50px Arial";

const shopCoinsFont =
    GS.isPhone ? "20px Arial" : "28px Arial";

const shopBirdFont =
    GS.isPhone ? "26px Arial" : "40px Arial";

// SHOP title
ctx.fillStyle = "#FFD700";
ctx.font = shopTitleFont;
ctx.textAlign = "center";
ctx.fillText(
    "SHOP",
    canvas.width / 2,
    GS.isPhone ? 70 : 80
);

// Coins
ctx.fillStyle = "white";
ctx.font = shopCoinsFont;
ctx.fillText(
    `Coins: ${statistics.coins}`,
    canvas.width / 2,
    GS.isPhone ? 125 : 140
);

// Bird name
ctx.fillStyle = "#FFD700";
ctx.font = shopBirdFont;
ctx.fillText(
    skin.toUpperCase(),
    canvas.width / 2,
    GS.isPhone ? 220 : 240
);

    


}

export function drawLoginScreen(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
): void {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "48px Arial";
    ctx.fillText(
        "LOGIN",
        canvas.width / 2,
        canvas.height * 0.25
    );

    ctx.font = "24px Arial";
    ctx.fillText(
        "Login system coming here",
        canvas.width / 2,
        canvas.height * 0.40
    );
}