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

    ctx.font = "54px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2, 80);

    ctx.font = "30px Arial";
    ctx.fillText(
        "Score: " + score,
        canvas.width / 2,
        150
    );

    ctx.fillText(
        "Best Score: " + bestScore,
        canvas.width / 2,
       190
    );

    if (newRecord) {
        ctx.fillStyle = "#ffd700";
        ctx.font = "36px Arial";

        ctx.fillText(
            "NEW HIGH SCORE!",
            canvas.width /2,
          240
        );

    }

    if (achievementText !== "") {
        ctx.fillStyle = "#FFD700";
        ctx.font = "24px Arial";
        ctx.fillText(
            "NEW ACHIEVEMENT",
            canvas.width / 2,
            330
        );
        ctx.fillStyle = "white";
        ctx.font = "22px Arial";
        ctx.fillText(
            achievementText,
            canvas.width / 2,
            365
        );
    }

    let medal: HTMLImageElement | null = null;

    if (score >= 50) {
        medal = diamondMedal;
    }
    else if (score >= 30) {
        medal = goldMedal;
    }
    else if (score >= 20) {
        medal = silverMedal;
    }
    else if (score >= 10) {
        medal = bronzeMedal;
    }

    if (medal) {
       ctx.drawImage(
        medal,
        canvas.width / 2 - 32,
        475,
        64,
        64
    );
    }

    if (skinUnlockText !== "") {
        ctx.fillStyle = "#FFD700";
        ctx.font = "24px Arial";
        ctx.fillText(
            "NEW BIRD UNLOCKED",
            canvas.width / 2,
            430
        );
        ctx.fillStyle = "white";
        ctx.font = "22px Arial";
        ctx.fillText(
            skinUnlockText,
            canvas.width / 2,
            465
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

    bird.y = menuBirdY;
    bird.draw(ctx);
    ground.update(GS.delta);
    ground.draw(ctx);

    ctx.fillStyle = "white";
    ctx.font = "56px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SKY WINGS", canvas.width / 2, 70);

    

    playButton.draw(ctx);
shopButton.draw(ctx);
statsButton.draw(ctx);
settingsButton.draw(ctx);

    
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
    if (owned) {
    ctx.fillStyle = "#00FF00";
    ctx.fillText(
        "OWNED",
        canvas.width / 2,
        300
    );
}
else if (unlocked && statistics.coins >= price) {
  ctx.font = "30px Arial";
ctx.fillStyle = "#FFD700";
ctx.strokeStyle = "black";
ctx.lineWidth = 4;

ctx.strokeText("UNLOCKED", canvas.width / 2, 300);
ctx.fillText("UNLOCKED", canvas.width / 2, 300);

ctx.font = "26px Arial";

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
    ctx.fillStyle = "yellow";
    ctx.fillText(
        "UNLOCKED",
        canvas.width / 2,
        300
    );

   ctx.fillStyle = "#FFD700";
ctx.strokeStyle = "black";
ctx.lineWidth = 4;

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
   ctx.fillStyle = "#FF4444";
   ctx.fillStyle = "#FF4444";
ctx.font = "32px Arial";
ctx.fillText(
    "LOCKED",
    canvas.width / 2,
    300
);

ctx.fillStyle = "#FFD700";
ctx.font = "26px Arial";
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

  

    // Title
    ctx.fillStyle = "#FFD700";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SHOP", canvas.width / 2, 80);

    // Coins
    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText(
        `Coins: ${statistics.coins}`,
        canvas.width / 2,
        140
    );

    // Current skin
    ctx.fillStyle = "#FFD700";
    ctx.font = "40px Arial";
    ctx.fillText(
        skin.toUpperCase(),
        canvas.width / 2,
        240
    );

    ctx.font = "28px Arial";


}