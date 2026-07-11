import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";
import { checkCollision } from "./collision.js";
import { saveStatistics } from "./statistics.js";
import { playHit, playDie } from "./audio.js";

export function checkPipeCollisions(
    bird: Bird,
    pipes: Pipe[],
    gameState: any
): void {

    for (const pipe of pipes) {

        if (
            !gameState.gameOver &&
            checkCollision(bird, pipe)
        ) {

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

            return;
        }
    }
}