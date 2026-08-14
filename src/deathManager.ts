import { Bird } from "./bird.js";
import { Ground } from "./ground.js";
import { saveStatistics } from "./statistics.js";
import { playHit, playDie } from "./audio.js";
import { layoutActiveScreen } from "./game.js";
import { stopMenuMusic } from "./audio.js";
export function checkDeath(
    bird: Bird,
    ground: Ground,
    gameState: any
): boolean {

    // Ground
    if (bird.y + bird.height >= ground.y) {

        bird.y = ground.y - bird.height;

        gameOver(gameState);

        return true;
    }

    // Ceiling
    if (bird.y <= 0) {

        bird.y = 0;

        gameOver(gameState);

        return true;
    }

    return false;
}

export function checkCeilingDeath(
    bird: any,
    GS: any
): boolean {

    if (bird.y > 0) {
        return false;
    }

    bird.y = 0;

    if (GS.score > GS.bestScore) {
        GS.bestScore = GS.score;
        localStorage.setItem(
            "bestScore",
            GS.bestScore.toString()
        );
        GS.newRecord = true;
    }

    GS.statistics.totalCrashes++;
    GS.statistics.totalScore += GS.score;

    GS.gameOver = true;
    stopMenuMusic();
GS.menuMusicPlaying = false;
    layoutActiveScreen();

    return true;
}

function gameOver(gameState: any) {

    if (gameState.score > gameState.bestScore) {

        gameState.bestScore = gameState.score;

        localStorage.setItem(
            "bestScore",
            gameState.bestScore.toString()
        );

        gameState.newRecord = true;
    }

    playHit();

    setTimeout(() => {
        playDie();
    }, 150);

    gameState.statistics.totalCrashes++;

    gameState.statistics.totalScore += gameState.score;

    saveStatistics(gameState.statistics);

    gameState.gameOver = true;
    layoutActiveScreen();
}