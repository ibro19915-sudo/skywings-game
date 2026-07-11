export function updateGameTexts(
    GS: any,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    delta: number
) {
    const dt = delta * 60;
    if (GS.levelUpTimer > 0) {
       GS.levelUpTimer -= dt;

        ctx.fillStyle = "#FFD700";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            GS.levelUpText,
            canvas.width / 2,
            80
        );
    }

    if (GS.bonusTimer > 0) {
        

        ctx.fillStyle = "#00FF00";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            GS.bonusText,
            canvas.width / 2,
            110
        );
    }
}