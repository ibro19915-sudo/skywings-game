
import { getSkyColor } from "./colors.js";
import type { Difficulty } from "./difficulty.js";

import {
    drawMenu,
    drawGameOver,
    drawResumeCountdown,
     drawHUD
} from "./ui.js";

import {
    drawAchievementPopup,
    drawMedalPopup,
    drawSkinUnlockPopup,
    drawScorePopup
} from "./ui.js";

import { drawPipes } from "./pipeManager.js";


export function renderGameOver(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    score: number,
    bestScore: number,
    newRecord: boolean,
    achievementText: string,
    bronze: HTMLImageElement,
    silver: HTMLImageElement,
    gold: HTMLImageElement,
    diamond: HTMLImageElement,
    medalText: string,
    skinUnlockText: string
): void {
    drawGameOver(
        ctx,
        canvas,
        score,
        bestScore,
        newRecord,
        achievementText,
        bronze,
        silver,
        gold,
        diamond,
        medalText,
        skinUnlockText
    );
}


export function renderMenu(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    clouds: any,
    bird: any,
    ground: any,
    menuBirdY: number,
    menuTime: number,
    countdownRunning: boolean,
    countdown: number,
    showGo: boolean,
    currentSkinIndex: number,
    skins: any[],
    score: number,
    difficulty: Difficulty
): void {
    drawMenu(
        ctx,
        canvas,
        clouds,
        bird,
        ground,
        menuBirdY,
        menuTime,
        countdownRunning,
        countdown,
        showGo,
        currentSkinIndex,
        skins,
        score,
        difficulty
    );
}
export function renderResumeCountdown(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    clouds: any,
    pipes: any[],
    ground: any,
    bird: any,
    resumeCountdown: number,
    score: number
): void {
    drawResumeCountdown(
        ctx,
        canvas,
        clouds,
        pipes,
        ground,
        bird,
        resumeCountdown,
        score
    );
}
export function renderHUD(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    score: number,
    bestScore: number,
    statistics: any,
    xpNeeded: any
): void {
    drawHUD(
        ctx,
        canvas,
        score,
        bestScore,
        statistics,
        xpNeeded
    );
}
export function renderGame(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    clouds: any,
    pipes: any[],
    ground: any,
    bird: any,
    score: number
): void {

    const skyColor = getSkyColor(score);

    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    clouds.draw(ctx);

    drawPipes(pipes, ctx);

    bird.draw(ctx);

    ground.draw(ctx);
}
export function renderPopups(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    bird: any,
    achievementTimer: number,
    achievementText: string,
    medalTimer: number,
    medalText: string,
    skinUnlockTimer: number,
    skinUnlockText: string,
    scorePopupTimer: number
): void {

    if (achievementTimer > 0) {
        drawAchievementPopup(ctx, canvas, achievementText);
    }

    if (medalTimer > 0) {
        drawMedalPopup(ctx, canvas, medalText);
    }

    if (skinUnlockTimer > 0) {
        drawSkinUnlockPopup(ctx, canvas, skinUnlockText);
    }

    if (scorePopupTimer > 0) {
        drawScorePopup(ctx, bird);
    }
}
