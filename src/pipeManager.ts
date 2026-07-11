import { Pipe } from "./pipe.js";
import type { Difficulty } from "./difficulty.js";

export function spawnPipe(
    pipes: Pipe[],
    playableHeight: number,
    difficulty: Difficulty
): void {

    const firstPipe = pipes[0];

    if (firstPipe.x + firstPipe.width >= 0) {
        return;
    }

    pipes.shift();

    const newPipe = new Pipe(difficulty);

    newPipe.playableHeight = playableHeight;

    const lastPipe = pipes[pipes.length - 1];

    newPipe.x = lastPipe.x + 250;

    newPipe.passed = false;

    const minHeight = 80;

    const maxHeight = Math.max(
        minHeight + 1,
        playableHeight - newPipe.gap - 70
    );

    newPipe.topHeight =
        minHeight +
        Math.random() * (maxHeight - minHeight);

    newPipe.topHeight = Math.min(
        newPipe.topHeight,
        playableHeight - newPipe.gap - 70
    );

    pipes.push(newPipe);
}

export function updatePipes(
    pipes: Pipe[],
    speed: number,
    delta: number
) {
    for (const pipe of pipes) {
        pipe.speed = speed;
        pipe.update(delta);
    }
}

export function drawPipes(
    pipes: Pipe[],
    ctx: CanvasRenderingContext2D
) {
    for (const pipe of pipes) {
        pipe.draw(ctx);
    }
}