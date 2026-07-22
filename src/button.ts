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
    constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    icon: string
){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
    this.icon = icon;
    
    }

    draw(ctx: CanvasRenderingContext2D) {

    ctx.save();

   ctx.globalAlpha = Math.max(
    0,
    1 - this.currentOffsetY / 30
); 
this.flash *= 0.84;
    // Shadow
   if (this.text === "") {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
} else {
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
}
     

   if (this.pressed) {
    this.targetScale = 0.95;
}
else if (this.hovered) {
    this.targetScale = 1.05;
}
else {
    this.targetScale = 1;
}

this.currentScale +=
    (this.targetScale - this.currentScale) * 0.20;

const scale = this.currentScale;

const drawWidth = this.width * scale;
const drawHeight = this.height * scale;

const drawX = this.x - (drawWidth - this.width) / 2;
if (this.delay > 0) {

    this.delay--;

}
else {

    this.currentOffsetY +=
        (0 - this.currentOffsetY) * 0.12;

    if (Math.abs(this.currentOffsetY) < 0.2) {

        this.currentOffsetY = 0;
        this.entrancePlayed = true;

    }

}

const drawY =
    this.y -
    (drawHeight - this.height) / 2 +
    this.currentOffsetY;
  
    // Gradient
    const gradient = ctx.createLinearGradient(
    drawX,
    drawY,
    drawX,
    drawY + drawHeight
);

    gradient.addColorStop(0, "#5CC8FF");
    gradient.addColorStop(0.5, "#2D8CFF");
    gradient.addColorStop(1, "#006BFF");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.roundRect(
         drawX,
    drawY,
    drawWidth,
    drawHeight,
        22
    );
    ctx.fill();
    if (this.flash > 0.01) {

    ctx.save();

    ctx.globalAlpha = this.flash * 0.35;

    ctx.fillStyle = "#FFFFFF";

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

    // Highlight
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
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

   // Bottom border
if (this.text !== "") {
    ctx.strokeStyle = "#003D99";
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

    // Text shadow
ctx.shadowBlur = 0;
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.font =
    this.text === ""
        ? "bold 30px Arial"
        : "bold 28px Arial";

const label =
    this.text.length > 0
        ? `${this.icon} ${this.text}`
        : this.icon;

// Shadow text
ctx.fillStyle = "rgba(0,0,0,0.35)";
ctx.fillText(
    label,
    drawX + drawWidth / 2,
    drawY + drawHeight / 2 + 2
);

// Main text
ctx.fillStyle = "#FFFFFF";
ctx.fillText(
    label,
    drawX + drawWidth / 2,
    drawY + drawHeight / 2
);

ctx.restore();

    }

    contains(mx: number, my: number): boolean {
        return (
            mx >= this.x &&
            mx <= this.x + this.width &&
            my >= this.y &&
            my <= this.y + this.height
        );
    }
   setHover(mx: number, my: number): void {
    this.hovered = this.contains(mx, my);
}

setHoverState(value: boolean): void {
    this.hovered = value;
}

setPressed(value: boolean): void {
    this.pressed = value;
}
}