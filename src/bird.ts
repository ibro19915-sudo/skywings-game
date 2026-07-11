import { getSelectedSkin } from "./skins.js";
import { loadImage } from "./imageLoader.js";

const DEG_TO_RAD = Math.PI / 180;
const GRAVITY = 0.45;
const JUMP_FORCE = -9;

export class Bird {

    x: number;
    y: number;
    width: number;
    height: number;
    velocityY: number;
    angle: number;

    images: HTMLImageElement[];
    frame: number;
    frameCounter: number;
constructor() {

    this.x = 120;
    this.y = 350;

    this.width = 90;
    this.height = 80;

    this.velocityY = 0;
    this.angle = 0;

    // Animation
    this.images = [];

    this.loadSkin();

    this.frame = 0;
    this.frameCounter = 0;
}


    update(delta: number): void {

        


const dt = delta * 60;

this.velocityY += GRAVITY * dt;
this.y += this.velocityY * dt;
        if (this.velocityY < 0) {

            this.angle = -25;

        } else {

            this.angle += 3 * dt;

            if (this.angle > 90) {
                this.angle = 90;
            }

        }

        // Wing animation
        this.frameCounter += delta;

        if (this.frameCounter >= 0.1) {

            this.frameCounter = 0;
            this.frame = (this.frame + 1) % 3;

        }
       
    }
    

jump(): void {
    
    this.velocityY = JUMP_FORCE;
    this.angle = -25;
}
loadSkin(): void {

    this.images = [];

    const selectedSkin = getSelectedSkin();

    for (let i = 1; i <= 3; i++) {

       const img = loadImage(
    `assets/images/${selectedSkin}bird${i}.png`
);

this.images.push(img);
    }

}

    draw(ctx: CanvasRenderingContext2D): void {

        ctx.save();

        ctx.translate(
            this.x + this.width / 2,
            this.y + this.height / 2
        );

        ctx.rotate(this.angle * DEG_TO_RAD);

        ctx.drawImage(
            this.images[this.frame],
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        ctx.restore();

    }

}