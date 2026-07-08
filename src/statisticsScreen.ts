import {
  Statistics,
  averageScore,
  formattedPlayTime
} from "./statistics.js";


export function drawStatisticsScreen(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    statistics: Statistics,
    bestScore: number
): void {

    ctx.fillStyle = "#87ceeb";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
    ctx.textAlign = "center";

    ctx.font = "48px Arial"
    ctx.fillText(
        "Statistics",
        canvas.width / 2,
        80
    );

    ctx.font = "28px Arial";

   let y = 150;

ctx.fillText(
    "Games Played: " + statistics.gamesPlayed,
    canvas.width / 2,
    y
);

y += 45;

ctx.fillText(
    "Total Pipes: " + statistics.totalPipes,
    canvas.width / 2,
    y
);

y += 45;

ctx.fillText(
    "Total Crashes: " + statistics.totalCrashes,
    canvas.width / 2,
    y
);

y += 45;

ctx.fillText(
    "Best Score: " + bestScore,
    canvas.width / 2,
    y
);

y += 45;

ctx.fillText(
    "Play Time: " + formattedPlayTime(statistics),
    canvas.width / 2,
    y
);

y += 45;

ctx.fillText(
    "Average Score: " +
    averageScore(statistics).toFixed(1),
    canvas.width / 2,
    y
);



   if (isTouchDevice) {
    ctx.fillText(
        "Touch bottom-left to return",
        canvas.width / 2,
        canvas.height - 40
    );
} else {
    ctx.fillText(
        "Press ESC to Return",
        canvas.width / 2,
        canvas.height - 40
    );
}
}