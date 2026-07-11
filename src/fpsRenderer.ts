export function drawFPS(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    fpsCounter: any,
    y: number
) {
    fpsCounter.update();

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "right";

    ctx.fillText(
        `FPS: ${fpsCounter.getValue()}`,
        canvas.width - 20,
        y
    );
}