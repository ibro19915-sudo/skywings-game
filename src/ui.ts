import { Bird } from "./bird.js";
import { Ground } from "./ground.js";
import { Clouds } from "./clouds.js";
import { Pipe } from "./pipe.js";
import type { Difficulty } from "./difficulty.js";
import { Statistics } from "./statistics.js";





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

    ctx.font = "20px Arial";
    ctx.fillText(
        "Press SPACE to Restart",
        canvas.width / 2,
        560
    );
    ctx.restore();
}

export function drawPauseScreen(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "PAUSED",
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font = "24px Arial";

    ctx.fillText(
        "Press P to Continue",
        canvas.width / 2,
        canvas.height / 2 + 60
    );
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
    let skyColor = "#87CEEB";
    if (score >= 30) {
        skyColor = "#FFA500"; // Sunrise
    } else if (score >= 20) {
        skyColor = "#191970"; // Night
    } else if (score >= 10) {
        skyColor = "#FF7F50"; // Sunset
    }
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    clouds.draw(ctx);
    // Draw pipes
    for (const pipe of pipes) {
        pipe.draw(ctx);
    }

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
    let skyColor = "#87CEEB";
    if (score >= 30) {
        skyColor = "#FFA500"; // Sunrise
    } else if (score >= 20) {
        skyColor = "#191970"; // Night
    } else if (score >= 10) {
        skyColor = "#FF7F50"; // Sunset
    }
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    clouds.update();
    clouds.draw(ctx);

    if (countdownRunning || showGo) {
        // Keep background, clouds, bird, and ground visible during countdown/GO.
        bird.y = menuBirdY + Math.sin(menuTime) * 8;
        bird.draw(ctx);
        ground.update();
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

    ctx.fillStyle = "white";
ctx.font = "56px Arial";
ctx.textAlign = "center";
ctx.fillText("SKY WINGS", canvas.width / 2, 70);

    ctx.font = "24px Arial";
    ctx.fillText(
        "Current Skin:" +
        skins[currentSkinIndex].toUpperCase(),
        canvas.width / 2,
        165
    );

    ctx.fillText(
        "Difficulty: " + currentDifficulty.toUpperCase(),
        canvas.width / 2,
        200
    );

    ctx.fillText(
        "Q / E = Change Difficulty",
        canvas.width / 2,
        235
    );

    ctx.fillText("Press SPACE to Start", canvas.width / 2, 270);
    ctx.fillText(
        "Press S for Statistics",
        canvas.width / 2,
        305
    );
    ctx.fillText(
        "Press M for Settings",
        canvas.width / 2,
        340
    );
    bird.y = menuBirdY + Math.sin(menuTime) * 8;
bird.draw(ctx);

ctx.fillStyle = "white";
ctx.font = "24px Arial";
ctx.textAlign = "center";
ctx.fillText(
    "Press B for Shop",
    canvas.width / 2,
    bird.y + 90
);

ground.update();
ground.draw(ctx);
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

    ctx.textAlign = "right";
    ctx.font = "18px Arial";

    ctx.fillText(
        "P = Pause",
        canvas.width - 20,
        30
    );
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
