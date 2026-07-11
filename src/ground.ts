import { loadImage } from "./imageLoader.js";


export class Ground {

x: number;
y: number;
width: number;
height:number;
speed: number;
image: HTMLImageElement;

constructor(){
this.x =0;
this.y = 590;

this.width = 480;
this.height = 60;

this .speed = 3;

this.image = loadImage("assets/images/ground.png");

}

update(delta: number): void {
const dt = delta * 60;

this.x -= this.speed * dt;
if (this.x <= -this.width){
    this.x = 0;
}


}

draw(ctx: CanvasRenderingContext2D):void {
ctx.drawImage(
this.image,
this.x,
this.y,
this.width,
this.height

);
ctx.drawImage(
this.image,
this.x + this.width,
this.y,
this.width,
this.height



);




}


}






































