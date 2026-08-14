import {
  Statistics,
  averageScore,
  formattedPlayTime
} from "./statistics.js";
import { GS } from "./gameState.js";
import { statisticsBackButton } from "./game.js";

export function drawStatisticsScreen(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    statistics: Statistics,
    bestScore: number
): void {

     // Animate popup

    if (GS.statisticsPopupOpening) {

        GS.statisticsPopupScale += 0.02;
        GS.statisticsPopupAlpha += 0.08;

        if (GS.statisticsPopupScale >= 1) {
            GS.statisticsPopupScale = 1;
        }

        if (GS.statisticsPopupAlpha >= 1) {
            GS.statisticsPopupAlpha = 1;
            GS.statisticsPopupOpening = false;
        }

    }
    


    //Dark overlay

   ctx.fillStyle = "rgba(0,0,0,0.45)";
ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
);
    const panelWidth = GS.isPhone ? canvas.width * 0.94 : 560;
const panelHeight = GS.isPhone
    ? canvas.height * 0.88
    : 440;

    const panelX =
        (canvas.width - panelWidth) / 2;

    const panelY = (canvas.height - panelHeight) / 2;

      

        ctx.save();

        const scale = GS.statisticsPopupScale;

ctx.translate(
    canvas.width / 2,
    canvas.height / 2
);

ctx.scale(scale, scale);

ctx.translate(
    -canvas.width / 2,
    -canvas.height / 2
);

    ctx.globalAlpha = GS.statisticsPopupAlpha;

    statisticsBackButton.x =
    canvas.width / 2 -
    statisticsBackButton.width / 2;

statisticsBackButton.y =
    panelY +
    panelHeight -
    statisticsBackButton.height -
    10;

ctx.fillStyle = "#ffffff";

    ctx.beginPath();

    ctx.roundRect(
        panelX,
        panelY,
        panelWidth,
        panelHeight,
        20
    );

    ctx.fill();

    ctx.strokeStyle = "#7ec8ff";
ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#1d3557";
    
    ctx.textAlign = "center";

   ctx.font = GS.isPhone ? "48px Arial" : "48px Arial";
   ctx.fillText(
    "Statistics",
    canvas.width / 2,
    GS.isPhone ? panelY + 55 : panelY + 52
);

    ctx.font = GS.isPhone ? "20px Arial" : "28px Arial";

   function drawStatRow(
    icon: string,
    label: string,
    value: string | number,
    y: number
) {

    const leftPadding = GS.isPhone ? 18 : 45;
   const iconSize = GS.isPhone ? "26px Arial" : "26px Arial";
const textSize = GS.isPhone ? "26px Arial" : "24px Arial";

    const startX = panelX + leftPadding;

    ctx.textAlign = "left";

    ctx.font = iconSize;
    ctx.fillText(icon, startX, y);

    ctx.font = textSize;
    ctx.fillStyle = "#1d3557";

    ctx.fillText(
        label,
        startX + (GS.isPhone ? 28 : 38),
        y
    );

    ctx.textAlign = "right";
    ctx.fillStyle = "#234b84";

    ctx.fillText(
        String(value),
        panelX + panelWidth - leftPadding,
        y
    );

    ctx.textAlign = "center";
    ctx.fillStyle = "#1d3557";
}

  let y = GS.isPhone ? panelY + 110 : panelY + 105;

drawStatRow(
    "🎮",
    "Games Played",
    statistics.gamesPlayed,
    y
);

y += GS.isPhone ? 58 : 50;

drawStatRow(
    "🚧",
    "Total Pipes",
    statistics.totalPipes,
    y
);

y += GS.isPhone ? 58 : 50;

drawStatRow(
    "💥",
    "Total Crashes",
    statistics.totalCrashes,
    y
);

y += GS.isPhone ? 58 : 50;

drawStatRow(
    "🏆",
    "Best Score",
    bestScore,
    y
);

y += GS.isPhone ? 58 : 50;

drawStatRow(
    "⏱",
    "Play Time",
    formattedPlayTime(statistics),
    y
);

y += GS.isPhone ? 58 : 50;

drawStatRow(
    "📈",
    "Average Score",
    averageScore(statistics).toFixed(1),
    y
);

  statisticsBackButton.draw(ctx);
 



ctx.restore();
}