import { Pipe } from "./pipe.js";
import { resetAchievements } from "./achievements.js";
import { saveStatistics, Statistics } from "./statistics.js";
import type { Difficulty } from "./difficulty.js";

export function resetGame(
    bird: { x: number; y: number; velocityY: number; angle: number },
    ground: { x: number },
    clouds: { x: number },
    pipes: Pipe[],
    PipeClass: { new(difficulty: Difficulty): Pipe },
    statistics: Statistics,
    difficulty: Difficulty
): void {

    resetAchievements();

    // Reset bird
    bird.x = 120;
    bird.y = 350;
    bird.velocityY = 0;
    bird.angle = 0;

    // Reset world
    ground.x = 0;
    clouds.x = 0;

    // Remove old pipes
    pipes.length = 0;

    // Create fresh pipes using current difficulty
    for (let i = 0; i < 3; i++) {
        const pipe = new PipeClass(difficulty);

        pipe.x = 480 + i * 250;
        pipe.passed = false;

        pipes.push(pipe);
    }

    saveStatistics(statistics);
}