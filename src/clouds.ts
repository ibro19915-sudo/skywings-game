
import { loadImage } from "./imageLoader.js";

export class Clouds {

    x: number;
    speed: number;
    image: HTMLImageElement;

    constructor() {

        this.x = 0;
        this.speed = 1;

        this.image = loadImage("assets/images/clouds.png");
    }

     update(delta: number): void {

         const dt = delta * 60;

        this.x -= this.speed * dt;

        if (this.x <= -640) {
            this.x = 0;
        }

    }

    draw(ctx: CanvasRenderingContext2D): void {

        ctx.drawImage(
            this.image,
            this.x,
            20,
            640,
            180
        );

        ctx.drawImage(
            this.image,
            this.x + 640,
            20,
            640,
            180
        );

    }

}