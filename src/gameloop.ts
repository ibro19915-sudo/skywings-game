import { GS } from "./gameState.js";
import { ctx, canvas, bird, ground, clouds, pipes, bronzeMedal, silverMedal, goldMedal, diamondMedal, PLAYABLE_HEIGHT } from "./game.js";

import {
    drawPauseScreen,
    drawMenu,
    drawShop
} from "./ui.js";
import {
    
    renderGameOver,
    renderResumeCountdown,
    renderHUD,
    renderGame,
    renderPopups
} from "./render.js";
import { drawStatisticsScreen } from "./statisticsScreen.js";
import { drawSettingsMenu } from "./settingsMenu.js";
import { achievementText, achievementTimer, medalText, medalTimer, skinUnlockText, skinUnlockTimer,  decrementTimers } from "./achievements.js";
import { saveStatistics } from "./statistics.js";
import {  xpNeeded } from "./xp.js";



import { checkDeath } from "./deathManager.js";
import {
    updateBird
} from "./birdManager.js";
import { updateGameplay } from "./gameplay.js";
import { updateGameTexts }  from "./gameStateUpdater.js";
import {  checkCeilingDeath } from "./deathManager.js";
import { drawFPS } from "./fpsRenderer.js";
export function startGameLoop() {
    GS.lastTime = performance.now();

    function gameLoop(): void {
        const now = performance.now();
        const delta = (now - GS.lastTime) / 1000;
        GS.delta = delta;
        GS.lastTime = now; 


       

        if (GS.gameStarted && !GS.paused && !GS.gameOver) {
            GS.statistics.playTime += delta;
            GS.statisticsSaveAccumulator += delta;
            if (GS.statisticsSaveAccumulator >= 5) {
                saveStatistics(GS.statistics);
               GS.statisticsSaveAccumulator = 0;
            }
        }

        if (GS.gameOver) {
            renderGameOver(
                ctx,
                canvas,
                GS.score,
                GS.bestScore,
                GS.newRecord,
                achievementText,
                bronzeMedal,
                silverMedal,
                goldMedal,
                diamondMedal,
                medalText,
                skinUnlockText
            );
            requestAnimationFrame(gameLoop);
            return;
        }

        if (GS.paused) {
            drawPauseScreen(ctx, canvas);
            requestAnimationFrame(gameLoop);
            return;
        }

        if (GS.resumeCountdownRunning) {
           renderResumeCountdown(ctx, canvas, clouds, pipes, ground, bird, GS.resumeCountdown, GS.score);
            requestAnimationFrame(gameLoop);
            return;
        }

        if (GS.showStatistics) {
            drawStatisticsScreen(ctx, canvas, GS.statistics, GS.bestScore);
            requestAnimationFrame(gameLoop);
            return;
        }
        if (GS.showShop) {
            drawShop(ctx, canvas, GS.statistics, GS.selectedShopSkin);
            requestAnimationFrame(gameLoop);
            return;
        }

        if (GS.showSettingsMenu && GS.settingsMenuState) {
            drawSettingsMenu(ctx, canvas, GS.settingsMenuState, GS.showResetConfirmation, GS.resetConfirmationChoice);
           if (GS.settings.fpsCounter) {
    drawFPS(
        ctx,
        canvas,
        GS.fpsCounter,
        30
    );
}
            requestAnimationFrame(gameLoop);
            return;
        }

        if (!GS.gameStarted) {
            GS.menuTime += 3 * delta;
            GS.menuBirdY = 350 + Math.sin(GS.menuTime) * 15;
            drawMenu(ctx, canvas, clouds, bird, ground, GS.menuBirdY, GS.menuTime, GS.countdownRunning, GS.countdown, GS.showGo, GS.currentSkinIndex, GS.skins, GS.score, GS.currentDifficulty);
            requestAnimationFrame(gameLoop);
            return;
        }

        renderGame(
    ctx,
    canvas,
    clouds,
    pipes,
    ground,
    bird,
    GS.score
);

       updateBird(bird, delta);
       clouds.update(delta);

       const playableHeight = PLAYABLE_HEIGHT; 

        // Ground Collision
        if (checkDeath(bird, ground, GS)) {
    requestAnimationFrame(gameLoop);
    return;
}

        // Ceiling Collision
      if (checkCeilingDeath(bird, GS)) {
    requestAnimationFrame(gameLoop);
    return;
} 

     updateGameplay(
    GS,
    bird,
    pipes,
    ground,
    playableHeight
);

updateGameTexts(
    GS,
    ctx,
    canvas,
    delta
);
renderHUD(
    ctx,
    canvas,
    GS.score,
    GS.bestScore,
    GS.statistics,
    xpNeeded
);
       if (GS.settings.fpsCounter) {
    drawFPS(
        ctx,
        canvas,
        GS.fpsCounter,
        60
    );
}

       if (GS.scorePopupTimer > 0) {
    GS.scorePopupTimer--;
}

renderPopups(
    ctx,
    canvas,
    bird,
    achievementTimer,
    achievementText,
    medalTimer,
    medalText,
    skinUnlockTimer,
    skinUnlockText,
    GS.scorePopupTimer
);


        decrementTimers();
        requestAnimationFrame(gameLoop);
}

    requestAnimationFrame(gameLoop);
}
