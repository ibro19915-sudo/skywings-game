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

this.image = new Image();
this.image.src = "assets/images/ground.png";

}

update(): void {
this.x -= this.speed;
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






































