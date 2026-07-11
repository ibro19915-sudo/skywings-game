import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";
import { Statistics, saveStatistics } from "./statistics.js";
import { addXP } from "./xp.js";
import { onScore } from "./achievements.js";
import { playScore } from "./audio.js";

export function updateScore(
    bird: Bird,
    pipes: Pipe[],
    statistics: Statistics,
    gameState: any,
    unlockBirdByPipes: (statistics: Statistics) => void
) {
    for (const pipe of pipes) {

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {

            pipe.passed = true;

            gameState.score++;

            statistics.totalPipes++;

            unlockBirdByPipes(statistics);

            const leveledUp = addXP(statistics, 2);

            statistics.coins++;

            if (leveledUp) {

                gameState.levelUpText =
                    `LEVEL ${statistics.level}!`;

                gameState.levelUpTimer = 180;

                statistics.coins += 1000;

                gameState.bonusText =
                    "+1000 COINS BONUS!";

                gameState.bonusTimer = 180;
            }

            saveStatistics(statistics);

            gameState.scorePopupTimer = 30;

            onScore(gameState.score);

            playScore();
        }
    }
}