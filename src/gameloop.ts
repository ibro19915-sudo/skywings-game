import { GS } from "./gameState.js";
import { ctx, canvas, bird, ground, clouds, pipes, bronzeMedal, silverMedal, goldMedal, diamondMedal, PLAYABLE_HEIGHT } from "./game.js";
import { playMenuMusic } from "./audio.js";
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

import {
    shopPrevButton,
    shopNextButton,
    shopActionButton,
    shopBackButton
} from "./game.js";

import { checkDeath } from "./deathManager.js";
import {
    updateBird
} from "./birdManager.js";
import { updateGameplay } from "./gameplay.js";
import { updateGameTexts }  from "./gameStateUpdater.js";
import {  checkCeilingDeath } from "./deathManager.js";
import { drawFPS } from "./fpsRenderer.js";
import { isSkinUnlocked } from "./skins.js";
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
            if (GS.statisticsPopupOpening) {

    GS.statisticsPopupScale += 0.02;
    GS.statisticsPopupAlpha += 0.08;

    if (GS.statisticsPopupScale >= 1) {
        GS.statisticsPopupScale = 1;
    }

    if (GS.statisticsPopupAlpha >= 1) {
        GS.statisticsPopupAlpha = 1;
        GS.statisticsPopupOpening = false;
    }
}
            drawStatisticsScreen(ctx, canvas, GS.statistics, GS.bestScore);
            requestAnimationFrame(gameLoop);
            return;
        }
        
      if (GS.showShop) {
    drawShop(ctx, canvas, GS.statistics, GS.selectedShopSkin);
    shopPrevButton.draw(ctx);
    shopNextButton.draw(ctx);

    const shopSkins = ["red", "blue", "gold", "diamond"];

    const skin =
        shopSkins[GS.selectedShopSkin] as any;

    const owned = isSkinUnlocked(skin);

    const selected =
        GS.skins[GS.currentSkinIndex] === skin;

    const canUnlock =
        GS.statistics.totalPipes >=
        [0, 50, 150, 300][GS.selectedShopSkin];

    if (selected) {
        shopActionButton.text = "SELECTED";
    }
    else if (owned) {
        shopActionButton.text = "SELECT";
    }
    else if (canUnlock) {
        shopActionButton.text = "BUY";
    }
    else {
        shopActionButton.text = "LOCKED";
    }

    shopActionButton.draw(ctx);
    shopBackButton.draw(ctx);

    requestAnimationFrame(gameLoop);
    return;
}

        if (GS.showResetSuccess) {

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff66";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
    "✔ Progress Reset",
    canvas.width / 2,
    canvas.height / 2 - 20
);

ctx.fillText(
    "Successfully!",
    canvas.width / 2,
    canvas.height / 2 + 20
);

    GS.resetSuccessTimer--;

    if (GS.resetSuccessTimer <= 0) {

        GS.showResetSuccess = false;
        GS.showSettingsMenu = false;
        GS.settingsMenuState = null;
    }

    requestAnimationFrame(gameLoop);
    return;
}

        if (GS.showSettingsMenu && GS.settingsMenuState) {
            drawSettingsMenu(ctx, canvas, GS.settingsMenuState, GS.showResetConfirmation, GS.resetConfirmationChoice);
         if (GS.showResetSuccess) {

    GS.resetSuccessTimer--;

    if (GS.resetSuccessTimer <= 0) {

        GS.showResetSuccess = false;

        GS.showSettingsMenu = false;
        GS.settingsMenuState = null;

    }

}
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

            GS.ensureMenuMusic(playMenuMusic);
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
