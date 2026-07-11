import { Bird } from "./bird.js";

export function updateBird(
    bird: Bird,
    delta: number
) {
    bird.update(delta);
}

export function drawBird(
    bird: Bird,
    ctx: CanvasRenderingContext2D
) {
    bird.draw(ctx);
}