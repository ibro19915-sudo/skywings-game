import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";
import { checkCollision } from "./collision.js";
import { Ground  }   from "./ground.js";
import { Clouds } from "./clouds.js";


// Find the canvas on the webpage
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

// Get the 2D drawing context
const ctx = canvas.getContext("2d")!;

// ground 
const bird = new Bird();
const ground = new Ground();
const clouds = new Clouds();
const wingSound = new Audio("assets/sounds/wing.mp3");
const scoreSound = new Audio ("assets/sounds/score.mp3");
const hitSound = new Audio("assets/sounds/hit.mp3");
const dieSound = new Audio("assets/sounds/die.mp3");

const bronzeMedal = new Image();
bronzeMedal.src = "assets/images/bronze.png";

const silverMedal = new Image();
silverMedal.src = "assets/images/silver.png";

const goldMedal = new Image();
goldMedal.src = "assets/images/gold.png";

const diamondMedal = new Image();
diamondMedal.src = "assets/images/diamond.png";





let score = 0;
let bestScore = 0;
let gameOver = false;
let gameStarted = false;
let countdown = 3;
let countdownRunning = false;
let showGo =false;

// Menu animation
let menuBirdY = bird.y;
let menuTime = 0;

const pipes: Pipe[] = [];

for(let i = 0; i < 3; i++) {
    const pipe = new Pipe();
    pipe.x = 480 + i * 250;
    pipes.push(pipe);
}

document.addEventListener("keydown", (event) => {

    if (event.code !== "Space") {
        return;
    }

    if (!gameStarted && !countdownRunning) {

        countdownRunning = true;
        countdown = 3;

        const timer = setInterval(() => {

            countdown--;

            if (countdown === 0) {

                clearInterval(timer);

                countdownRunning = false;
                showGo = true;

                setTimeout(() => {

                    showGo = false;
                    gameStarted = true;

                    bird.y = menuBirdY;
                    bird.jump();

                    wingSound.pause();
                    wingSound.currentTime = 0;
                    wingSound.play();

                }, 700);
            }

        }, 1000);

    } else if (gameOver) {

        resetGame();

    } else {

        bird.jump();

        wingSound.pause();
        wingSound.currentTime = 0;
        wingSound.play();

    }

});

function gameLoop(): void {

    if (gameOver) {

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "white";
ctx.textAlign = "center";

ctx.font = "60px Arial";
ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

ctx.font = "30px Arial";
ctx.fillText(
    "Score: " + score,
    canvas.width / 2,
    canvas.height / 2 + 60
);

ctx.fillText(
    "Best Score: " + bestScore,
    canvas.width / 2,
    canvas.height / 2 + 100
);
let medal: HTMLImageElement | null = null;

if (score >= 50) {
    medal = diamondMedal;
}
else if (score >= 30) {
    medal = goldMedal;
}
else if (score >= 20) {
    medal = silverMedal;
}
else if (score >= 10) {
    medal = bronzeMedal;
}

if (medal) {
    ctx.drawImage(
        medal,
        canvas.width / 2 - 32,
        canvas.height / 2 + 120,
        64,
        64
    );
}

ctx.font = "22px Arial";
ctx.fillText(
    "Press SPACE to Restart",
    canvas.width / 2,
    canvas.height / 2 + 210
);
        requestAnimationFrame(gameLoop);
        return;
    }

   

    // ================= MENU =================

    if (!gameStarted) {
// Draw Sky
ctx.fillStyle = "#87CEEB";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Clouds
clouds.update();
clouds.draw(ctx);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("SKY WINGS", canvas.width / 2, 120);

       if (!countdownRunning) {
    ctx.font = "28px Arial";
    ctx.fillText("Press SPACE to Start", canvas.width / 2, 200);
}
        if (countdownRunning) {

    ctx.fillStyle = "white";
    ctx.font = "80px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        countdown.toString(),
        canvas.width / 2,
        canvas.height / 2
    );

    requestAnimationFrame(gameLoop);
    return;
}
if (showGo) {

    ctx.fillStyle = "#FFD700";
    ctx.font = "90px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "GO!",
        canvas.width / 2,
        canvas.height / 2
    );

    requestAnimationFrame(gameLoop);
    return;
}
        menuTime += 0.05;
        bird.y = menuBirdY + Math.sin(menuTime) * 8;

        bird.draw(ctx);

        ground.update();
        ground.draw(ctx);

        requestAnimationFrame(gameLoop);
        return;
    }

    // ================= GAME =================
// Draw Sky
ctx.fillStyle = "#87CEEB";
ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Clouds
clouds.update();
clouds.draw(ctx);
    
    bird.update();

    // Ground Collision
    if (bird.y + bird.height >= canvas.height) {

    bird.y = canvas.height - bird.height;

    if (score > bestScore) {
        bestScore = score;
    }

    hitSound.pause();
hitSound.currentTime = 0;
hitSound.play();

setTimeout(() => {
    dieSound.pause();
    dieSound.currentTime = 0;
    dieSound.play();
}, 150);

gameOver = true;
}

    // Ceiling Collision
   if (bird.y <= 0) {

    bird.y = 0;

    if (score > bestScore) {
        bestScore = score;
    }

   hitSound.pause();
hitSound.currentTime = 0;
hitSound.play();

setTimeout(() => {
    dieSound.pause();
    dieSound.currentTime = 0;
    dieSound.play();
}, 150);

gameOver = true;
}

 const pipeSpeed = 3 + Math.floor(score / 10);

for (const pipe of pipes) {
    pipe.speed = pipeSpeed;
    pipe.update();
}
    
    // Update Ground
    ground.update();

    // Collision + Score
    for (const pipe of pipes) {
if (!pipe.passed && bird.x > pipe.x + pipe.width) {
    pipe.passed = true;
    score++;

    scoreSound.pause();
    scoreSound.currentTime = 0;
    scoreSound.play();

    if (score > bestScore) {
        bestScore = score;
    }
}
      

       if (!gameOver && checkCollision(bird, pipe)) {

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore.toString());
    }

    hitSound.pause();
    hitSound.currentTime = 0;
    hitSound.play();

setTimeout(() => {
    dieSound.pause();
    dieSound.currentTime = 0;
    dieSound.play();
}, 150);

gameOver = true;
}
    }

    // Spawn New Pipes
    const firstPipe = pipes[0];

    if (firstPipe.x + firstPipe.width < 0) {

        pipes.shift();

        const newPipe = new Pipe();

        const lastPipe = pipes[pipes.length - 1];

        newPipe.x = lastPipe.x + 250;
        newPipe.passed = false;

        const minHeight = 80;
        const maxHeight = 280;

        newPipe.topHeight =
            minHeight + Math.random() * (maxHeight - minHeight);

        pipes.push(newPipe);
    }

    // ================= DRAW =================

    // Pipes
    for (const pipe of pipes) {
        pipe.draw(ctx);
    }

    // Bird
    bird.draw(ctx);

    // Ground
    ground.draw(ctx);

    // Score
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "left";
   ctx.fillText("Score: " + score, 20, 40);
ctx.fillText("Best: " + bestScore, 20, 80);

    requestAnimationFrame(gameLoop);
}


function resetGame(): void {

    score = 0;
    gameOver = false;
    gameStarted = false;

    bird.x = 120;
    bird.y = 350;
    bird.velocityY = 0;
    bird.angle = 0;

    ground.x = 0;
    clouds.x = 0;

    // Reset menu animation
    menuTime = 0;
    menuBirdY = 350;
    bird.y = menuBirdY;

    pipes.length = 0;

    for (let i = 0; i < 3; i++) {

        const pipe = new Pipe();
        pipe.x = 480 + i * 250;
        pipe.passed = false;

        pipes.push(pipe);

    }

}

// Start the game loop
gameLoop();