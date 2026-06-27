import { Pipe } from "./pipe.js";
import { resetAchievements } from "./achievements.js";
import { saveStatistics, Statistics } from "./statistics.js";

export function resetGame(
    bird: { x: number; y: number; velocityY: number; angle: number },
    ground: { x: number },
    clouds: { x: number },
    pipes: Pipe[],
    PipeClass: { new(): Pipe },
    statistics: Statistics
): void {
    resetAchievements();

    // reset core game state (caller should reset score, flags)

    bird.x = 120;
    bird.y = 350;
    bird.velocityY = 0;
    bird.angle = 0;

    ground.x = 0;
    clouds.x = 0;

    // Reset menu animation
    // menuTime and menuBirdY are managed by caller

    pipes.length = 0;

    for (let i = 0; i < 3; i++) {
        const pipe = new PipeClass();
        pipe.x = 480 + i * 250;
        pipe.passed = false;

        pipes.push(pipe);
    }

    saveStatistics(statistics);
}
