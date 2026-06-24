export class Pipe {

    x: number;
    topHeight: number;
    gap: number;
    width: number;
    speed: number;
  passed: boolean;
  image: HTMLImageElement;



    constructor() {
        this.x = 480;
        this.topHeight = 200;
        this.gap = 170;
        this.width = 70;
        this.speed = 3;
        this.passed = false;
        this.image = new Image();
this.image.src = "assets/images/pipe.png";

    }

    update(): void {
        this.x -= this.speed;
    }

    draw(ctx: CanvasRenderingContext2D): void {

    // Crop the useful part of the image
    const cropX = 95;
    const cropY = 20;
    const cropWidth = 835;
    const cropHeight = 1485;

    // Top pipe
    ctx.save();

    ctx.translate(this.x + this.width / 2, this.topHeight / 2);
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

    // Bottom pipe
    ctx.drawImage(
        this.image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        this.x,
        this.topHeight + this.gap,
        this.width,
        640 - (this.topHeight + this.gap)
    );
    }
}