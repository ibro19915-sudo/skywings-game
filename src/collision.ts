import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";

export function checkCollision(bird: Bird, pipe: Pipe): boolean {

    // ================= Bird Hitbox =================
   const birdLeft = bird.x + 24;
const birdRight = bird.x + bird.width - 24;
const birdTop = bird.y + 18;
const birdBottom = bird.y + bird.height - 18;

    // ================= Pipe Hitbox =================
    const collisionMargin = 18;

    const pipeLeft = pipe.x + collisionMargin;
    const pipeRight = pipe.x + pipe.width - collisionMargin;

    // Pipe positions
    const topPipeTop = 0;
    const topPipeBottom = pipe.topHeight - 20;

    const bottomPipeTop = pipe.topHeight + pipe.gap + 24;
    const bottomPipeBottom = 640;

    // ================= Top Pipe Collision =================
   const hitTopPipe =
    birdRight > pipeLeft &&
    birdLeft < pipeRight &&
    birdTop < (pipe.topHeight - 22);

    // ================= Bottom Pipe Collision =================
    const hitBottomPipe =
        birdRight > pipeLeft &&
        birdLeft < pipeRight &&
        birdBottom > bottomPipeTop &&
        birdTop < bottomPipeBottom;

    return hitTopPipe || hitBottomPipe;
}