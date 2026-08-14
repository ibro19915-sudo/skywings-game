export class Button {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    icon: string;

    hovered: boolean = false;
    pressed: boolean = false;
    hoverSoundPlayed: boolean = false;

    currentScale: number = 1;
    targetScale: number = 1;

    delay: number = 0;
    currentOffsetY: number = 30;

    entrancePlayed: boolean = false;

    flash: number = 0;

    // Extra animation values
    pressAmount: number = 0;
    hoverAmount: number = 0;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
        icon: string
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.icon = icon;
    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.save();

        // --------------------------------
        // ENTRANCE ANIMATION
        // --------------------------------

        ctx.globalAlpha = Math.max(
            0,
            1 - this.currentOffsetY / 30
        );

        if (this.delay > 0) {

            this.delay--;

        } else {

            this.currentOffsetY +=
                (0 - this.currentOffsetY) * 0.12;

            if (Math.abs(this.currentOffsetY) < 0.2) {
                this.currentOffsetY = 0;
                this.entrancePlayed = true;
            }
        }

        // --------------------------------
        // ANIMATION VALUES
        // --------------------------------

        const targetHover = this.hovered ? 1 : 0;
        const targetPress = this.pressed ? 1 : 0;

        this.hoverAmount +=
            (targetHover - this.hoverAmount) * 0.18;

        this.pressAmount +=
            (targetPress - this.pressAmount) * 0.35;

        // --------------------------------
        // SCALE
        // --------------------------------

        let baseScale = 1;

        if (this.hovered) {
            baseScale = 1.05;
        }

        if (this.pressed) {
            baseScale = 0.95;
        }

        this.targetScale = baseScale;

        this.currentScale +=
            (this.targetScale - this.currentScale) * 0.20;

        const scale = this.currentScale;

        const drawWidth = this.width * scale;
        const drawHeight = this.height * scale;

        const drawX =
            this.x -
            (drawWidth - this.width) / 2;

        const drawY =
            this.y -
            (drawHeight - this.height) / 2 +
            this.currentOffsetY;

        // --------------------------------
        // SHADOW
        // --------------------------------

        if (this.text === "") {

            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;

        } else {

            ctx.shadowColor =
                "rgba(0,0,0,0.45)";

            ctx.shadowBlur = 18;

            ctx.shadowOffsetY =
                6 + this.pressAmount * 3;
        }

        // --------------------------------
        // BUTTON GRADIENT
        // --------------------------------

        const gradient =
            ctx.createLinearGradient(
                drawX,
                drawY,
                drawX,
                drawY + drawHeight
            );

        gradient.addColorStop(
            0,
            "#5CC8FF"
        );

        gradient.addColorStop(
            0.5,
            "#2D8CFF"
        );

        gradient.addColorStop(
            1,
            "#006BFF"
        );

        ctx.fillStyle = gradient;

        // --------------------------------
        // BUTTON BODY
        // --------------------------------

        ctx.beginPath();

        ctx.roundRect(
            drawX,
            drawY,
            drawWidth,
            drawHeight,
            22
        );

        ctx.fill();

        // --------------------------------
        // HOVER GLOW
        // --------------------------------

        if (this.hoverAmount > 0.01) {

            ctx.save();

            ctx.shadowColor =
                "rgba(92, 200, 255, 0.75)";

            ctx.shadowBlur =
                18 * this.hoverAmount;

            ctx.strokeStyle =
                `rgba(255,255,255,${0.25 * this.hoverAmount})`;

            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.roundRect(
                drawX,
                drawY,
                drawWidth,
                drawHeight,
                22
            );

            ctx.stroke();

            ctx.restore();
        }

        // --------------------------------
        // CLICK FLASH
        // --------------------------------

        this.flash *= 0.84;

        if (this.flash > 0.01) {

            ctx.save();

            ctx.globalAlpha =
                this.flash * 0.40;

            ctx.fillStyle =
                "#FFFFFF";

            ctx.beginPath();

            ctx.roundRect(
                drawX,
                drawY,
                drawWidth,
                drawHeight,
                22
            );

            ctx.fill();

            ctx.restore();
        }

        // --------------------------------
        // TOP HIGHLIGHT
        // --------------------------------

        ctx.strokeStyle =
            "rgba(255,255,255,0.55)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.roundRect(
            drawX + 1,
            drawY + 1,
            drawWidth - 2,
            drawHeight - 2,
            22
        );

        ctx.stroke();

        // --------------------------------
        // BOTTOM BORDER
        // --------------------------------

        if (this.text !== "") {

            ctx.strokeStyle =
                "#003D99";

            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.moveTo(
                drawX + 12,
                drawY + drawHeight - 2
            );

            ctx.lineTo(
                drawX + drawWidth - 12,
                drawY + drawHeight - 2
            );

            ctx.stroke();
        }

       // --------------------------------
// TEXT
// --------------------------------

ctx.shadowBlur = 0;

ctx.textAlign = "center";
ctx.textBaseline = "middle";

const label =
    this.text.length > 0
        ? `${this.icon} ${this.text}`
        : this.icon;

// --------------------------------
// AUTO-FIT TEXT
// --------------------------------

let fontSize =
    this.text === ""
        ? 30
        : 28;

const maxTextWidth =
    drawWidth - 30;

while (fontSize > 18) {

    ctx.font = `bold ${fontSize}px Arial`;

    if (ctx.measureText(label).width <= maxTextWidth) {
        break;
    }

    fontSize--;
}

// Text shadow

ctx.fillStyle =
    "rgba(0,0,0,0.35)";

ctx.fillText(
    label,
    drawX + drawWidth / 2,
    drawY + drawHeight / 2 + 2
);

// Main text

ctx.fillStyle =
    "#FFFFFF";

ctx.fillText(
    label,
    drawX + drawWidth / 2,
    drawY + drawHeight / 2
);

        ctx.restore();
    }

    setHover(
        mouseX: number,
        mouseY: number
    ): void {

        this.hovered =
            this.contains(mouseX, mouseY);
    }

    contains(
        mx: number,
        my: number
    ): boolean {

        return (
            mx >= this.x &&
            mx <= this.x + this.width &&
            my >= this.y &&
            my <= this.y + this.height
        );
    }

    setPressed(
        value: boolean
    ): void {

        this.pressed = value;

        // Start click flash immediately
        if (value) {
            this.flash = 1;
        }
    }

    setHoverState(
        value: boolean
    ): void {

        this.hovered = value;
    }
}