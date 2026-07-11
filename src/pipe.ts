import type { Difficulty } from "./difficulty.js";
import { loadImage } from "./imageLoader.js";

export class Pipe {

    x: number;
    topHeight: number;
    gap: number;
    width: number;
  
    speed: number;
    passed: boolean;
    image: HTMLImageElement;
    playableHeight: number;


   constructor(difficulty: Difficulty = "normal") {
    this.x = 480;
    this.topHeight = 200;

    switch (difficulty) {
        case "easy":
            this.gap = 200;
            break;
        case "normal":
            this.gap = 170;
            break;
        case "hard":
            this.gap = 145;
            break;
        case "insane":
            this.gap = 120;
            break;
    }

    this.width = 70;
   
    this.speed = 3;
    this.passed = false;
    this.playableHeight = 640;

    this.image = loadImage("assets/images/pipe.png");
}
update(delta: number): void {
    const dt = delta * 60;

    this.x -= this.speed * dt;
}
   

  draw(ctx: CanvasRenderingContext2D): void {

    // Manually crop the sprite
    // Adjust these 4 numbers until the gap disappears
    const cropX = 120;
    const cropY = 85;
    const cropWidth = 780;
    const cropHeight = 1340;

  // ---------- TOP PIPE ----------
const topPipeY = 0;

ctx.save();
ctx.translate(this.x + this.width / 2, topPipeY + this.topHeight / 2);
ctx.rotate(Math.PI);

ctx.drawImage(
    this.image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    -this.width / 2,
    -this.topHeight / 2,
    this.width,
    this.topHeight
);

ctx.restore(); 
    // ---------- BOTTOM PIPE ----------
    const bottomPipeY = this.topHeight + this.gap;
    const bottomHeight = this.playableHeight - bottomPipeY + 120;

    ctx.drawImage(
    this.image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    this.x - (this.width - this.width) / 2, // equals this.x
    bottomPipeY,
    this.width,
    bottomHeight
);
}
}