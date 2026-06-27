import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";
import { checkCollision } from "./collision.js";
import { Ground  }   from "./ground.js";
import { Clouds } from "./clouds.js";
import {

    saveUnlockedSkin,
    isSkinUnlocked,
    saveSelectedSkin,
    getSelectedSkin,
    SkinType
} from "./skins.js"

import { drawGameOver, drawPauseScreen, drawResumeCountdown, drawMenu, drawHUD, drawAchievementPopup, drawMedalPopup, drawSkinUnlockPopup, drawScorePopup } from "./ui.js";
import { playWing, playScore, playHit, playDie, setAudioSettings } from "./audio.js";
import { achievementText, achievementTimer, medalText, medalTimer, skinUnlockText, skinUnlockTimer, unlockedSkin, onScore, decrementTimers, resetAchievements } from "./achievements.js";
import { resetGame as resetGameInternal } from "./reset.js";
import {
    loadStatistics,
    saveStatistics,
    type Statistics
} from "./statistics.js";
import { drawStatisticsScreen } from "./statisticsScreen.js";
import {
    getDifficulty,
    saveDifficulty,
    Difficulty
} from "./difficulty.js";
import { loadSettings, saveSettings, type Settings } from "./settings.js";
import { createSettingsMenuState, drawSettingsMenu, updateSettingsMenu, type SettingsMenuState } from "./settingsMenu.js";
import { FPSCounter } from "./fps.js";
import { addXP,xpNeeded } from "./xp.js";

import { setupInput } from "./input.js";




// Find the canvas on the webpage
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

// Get the 2D drawing context
const ctx = canvas.getContext("2d")!;

// ground 
const bird = new Bird();
const ground = new Ground();
const clouds = new Clouds();
// Audio is handled in src/audio.ts via helper functions

const bronzeMedal = new Image();
bronzeMedal.src = "assets/images/bronze.png";

const silverMedal = new Image();
silverMedal.src = "assets/images/silver.png";

const goldMedal = new Image();
goldMedal.src = "assets/images/gold.png";

const diamondMedal = new Image();
diamondMedal.src = "assets/images/diamond.png";


let score = 0;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;
let scorePopupTimer = 0;
let gameOver = false;
let gameStarted = false;
let countdown = 3;
let countdownRunning = false;
let showGo =false;
let newRecord = false;
const skins: SkinType[] = [
    "red",
    "blue",
    "gold",
    "diamond"
];

let currentSkinIndex =
    skins.indexOf(getSelectedSkin());

// achievement/medal/skin state moved to src/achievements.ts

// pauser
let paused = false;

// resume countdown
let resumeCountdown = 3;
let resumeCountdownRunning = false;
// Menu animation
let menuBirdY = bird.y;
let menuTime = 0;


//count playtime
let lastTime = performance.now();
let statisticsSaveAccumulator = 0;

// showing statistics
let showStatistics = false;

//difficulty
let currentDifficulty: Difficulty = getDifficulty();
const difficulties: Difficulty[] = ["easy", "normal", "hard", "insane"];

let settings: Settings = loadSettings();
let showSettingsMenu = false;
let settingsMenuState: SettingsMenuState | null = null;
let showResetConfirmation = false;
let resetConfirmationChoice: "yes" | "no" = "yes";
let fpsCounter = new FPSCounter();

// stattiscs
let statistics: Statistics = loadStatistics();

// level up
let levelUpText = "";
let levelUpTimer = 0;

const pipes: Pipe[] = [];

for(let i = 0; i < 3; i++) {
    const pipe = new Pipe(currentDifficulty);
    pipe.x = 480 + i * 250;
    pipes.push(pipe);
}


// Input handlers
function onTogglePause(): void {
    if (gameStarted && !gameOver) {
        if (!paused && !resumeCountdownRunning) {
            paused = true;
        } else if (paused) {
            paused = false;
            resumeCountdownRunning = true;
            resumeCountdown = 3;

            const timer = setInterval(() => {
                resumeCountdown--;
                if (resumeCountdown <= 0) {
                    clearInterval(timer);
                    resumeCountdownRunning = false;
                }
            }, 1000);
        }
    }
}

function onChangeSkinLeft(): void {
    if (!gameStarted && !countdownRunning && !showStatistics && !showSettingsMenu) {
        do {
            currentSkinIndex--;
            if (currentSkinIndex < 0) {
                currentSkinIndex = skins.length - 1;
            }
        } while (!isSkinUnlocked(skins[currentSkinIndex]));

        saveSelectedSkin(skins[currentSkinIndex]);
        bird.loadSkin();
    }
}

function onChangeSkinRight(): void {
    if (!gameStarted && !countdownRunning && !showStatistics && !showSettingsMenu) {
        do {
            currentSkinIndex++;
            if (currentSkinIndex >= skins.length) {
                currentSkinIndex = 0;
            }
        } while (!isSkinUnlocked(skins[currentSkinIndex]));

        saveSelectedSkin(skins[currentSkinIndex]);
        bird.loadSkin();
    }
}

function onChangeDifficultyPrev(): void {
    if (!gameStarted && !countdownRunning) {
        const currentIndex = difficulties.indexOf(currentDifficulty);
        const nextIndex = (currentIndex - 1 + difficulties.length) % difficulties.length;
        currentDifficulty = difficulties[nextIndex];
        saveDifficulty(currentDifficulty);
    }
}

function onChangeDifficultyNext(): void {
    if (!gameStarted && !countdownRunning) {
        const currentIndex = difficulties.indexOf(currentDifficulty);
        const nextIndex = (currentIndex + 1) % difficulties.length;
        currentDifficulty = difficulties[nextIndex];
        saveDifficulty(currentDifficulty);
    }
}

function onSpace(): void {
    if (showSettingsMenu || showStatistics) {
        return;
    }

    if (countdownRunning || showGo || resumeCountdownRunning) {
        return;
    }

    if (!gameStarted) {
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
                    statistics.gamesPlayed++;
                    saveStatistics(statistics);
                    bird.y = menuBirdY;
                    bird.jump();
                    playWing();
                }, 700);
            }
        }, 1000);

    } else if (gameOver) {
        score = 0;
        gameOver = false;
        gameStarted = false;
        newRecord = false;
        paused = false;

        menuTime = 0;
        menuBirdY = 350;

        resetGameInternal(bird, ground, clouds, pipes, Pipe, statistics);

    } else {
        bird.jump();
        playWing();
    }
}

setupInput({
    onTogglePause,
    onChangeSkinLeft,
    onChangeSkinRight,
    onChangeDifficultyPrev,
    onChangeDifficultyNext,
    onOpenSettings: () => {
        if (!gameStarted && !countdownRunning && !showStatistics && !showSettingsMenu) {
            openSettingsMenu();
        }
    },
    onSettingsKey: (key: string) => {
        handleSettingsKey(key);
    },
    onSpace,
    onShowStatistics: () => {
        if (!gameStarted && !showSettingsMenu && !showStatistics) {
            showStatistics = true;
        }
    },
    onHideStatistics: () => {
        if (showSettingsMenu) {
            showSettingsMenu = false;
            settingsMenuState = null;
        } else if (showStatistics) {
            showStatistics = false;
        }
    }
});

function openSettingsMenu(): void {
    if (!gameStarted && !countdownRunning) {
        settings = loadSettings();
        currentDifficulty = settings.difficulty;
        setAudioSettings(settings);
        settingsMenuState = createSettingsMenuState(settings);
        showSettingsMenu = true;
        showResetConfirmation = false;
        resetConfirmationChoice = "yes";
    }
}

function resetAllProgress(): void {
    localStorage.removeItem("bestScore");
    localStorage.removeItem("skywings_statistics");
    localStorage.removeItem("skywings_difficulty");
    localStorage.removeItem("skywings_settings");
    localStorage.removeItem("selectedSkin");
    localStorage.removeItem("skin_blue");
    localStorage.removeItem("skin_gold");
    localStorage.removeItem("skin_diamond");
    localStorage.removeItem("skywings_achievements");
    localStorage.removeItem("skywings_medals");

    localStorage.setItem("bestScore", "0");
    bestScore = 0;
    score = 0;
    statistics = loadStatistics();
    currentDifficulty = getDifficulty();
    settings = loadSettings();
    settings.difficulty = currentDifficulty;
    settings.soundEffects = true;
    settings.fpsCounter = false;
    saveSettings(settings);
    setAudioSettings(settings);
    currentSkinIndex = skins.indexOf(getSelectedSkin());
}

function handleSettingsKey(key: string): void {
    if (!showSettingsMenu || !settingsMenuState) {
        return;
    }

    if (showResetConfirmation) {
        if (key === "Escape") {
            showResetConfirmation = false;
            return;
        }

        if (key === "ArrowLeft") {
            resetConfirmationChoice = "yes";
            return;
        }

        if (key === "ArrowRight") {
            resetConfirmationChoice = "no";
            return;
        }

        if (key === "Enter") {
            if (resetConfirmationChoice === "yes") {
                resetAllProgress();
                showSettingsMenu = false;
                settingsMenuState = null;
            }
            showResetConfirmation = false;
            return;
        }

        return;
    }

    if (key === "Escape") {
        showSettingsMenu = false;
        settingsMenuState = null;
        return;
    }

    if (key === "Enter" && settingsMenuState.selectedOption === "resetProgress") {
        showResetConfirmation = true;
        return;
    }

    const updated = updateSettingsMenu(settingsMenuState, key);
    settingsMenuState = updated;
    settings = updated.settings;
    currentDifficulty = settings.difficulty;
    setAudioSettings(settings);
    saveSettings(settings);

    if (key === "Enter" && settingsMenuState.selectedOption === "back") {
        showSettingsMenu = false;
        settingsMenuState = null;
    }
}

// unlockAchievement/unlockMedal moved to src/achievements.ts
function triggerGameOver(): void {

    statistics.totalCrashes++;
    statistics.totalScore += score;
    saveStatistics(statistics);

    gameOver = true;
}


function gameLoop(): void {
    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    if (gameStarted && !paused && !gameOver) {
        statistics.playTime += delta;
        statisticsSaveAccumulator += delta;
        if (statisticsSaveAccumulator >= 1) {
            saveStatistics(statistics);
            statisticsSaveAccumulator -= 1;
        }
    }

    if (gameOver) {
        drawGameOver(
            ctx,
            canvas,
            score,
            bestScore,
            newRecord,
            achievementText,
            bronzeMedal,
            silverMedal,
            goldMedal,
            diamondMedal,
            medalText,
            skinUnlockText
        );
        requestAnimationFrame(gameLoop);
        return;
    }
     // ===== PAUSE =====
   // ===== PAUSE =====
if (paused) {

        drawPauseScreen(ctx, canvas);

        requestAnimationFrame(gameLoop);
        return;
    }

// ===== RESUME COUNTDOWN =====
if (resumeCountdownRunning) {

    drawResumeCountdown(ctx, canvas, clouds, pipes, ground, bird, resumeCountdown, score);
    requestAnimationFrame(gameLoop);
    return;
}

if (showStatistics) {
    drawStatisticsScreen(
        ctx,
        canvas,
        statistics,
        bestScore
    );
    requestAnimationFrame(gameLoop);
    return;
}

if (showSettingsMenu && settingsMenuState) {
    drawSettingsMenu(ctx, canvas, settingsMenuState, showResetConfirmation, resetConfirmationChoice);
    if (settings.fpsCounter) {
        fpsCounter.update();
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`FPS: ${fpsCounter.getValue()}`, canvas.width - 20, 30);
    }
    requestAnimationFrame(gameLoop);
    return;
}

    // ================= MENU =================

    if (!gameStarted) {
        menuTime += 0.05;
        drawMenu(ctx, canvas, clouds, bird, ground, menuBirdY, menuTime, countdownRunning, countdown, showGo, currentSkinIndex, skins, score, currentDifficulty);
        requestAnimationFrame(gameLoop);
        return;
    }

    // ================= GAME =================
// Draw Sky
let skyColor = "#87CEEB";
if (score >= 30) {
    skyColor = "#FFA500"; // Sunrise
} else if (score >= 20) {
    skyColor = "#191970"; // Night
} else if (score >= 10) {
    skyColor = "#FF7F50"; // Sunset
}
ctx.fillStyle = skyColor;
ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Clouds
clouds.update();
clouds.draw(ctx);
    
    bird.update();

    // Ground Collision
    if (bird.y + bird.height >= canvas.height) {

    bird.y = canvas.height - bird.height;

   if (score > bestScore){
    bestScore = score;
    localStorage.setItem("bestScore", bestScore.toString());
    newRecord = true;
   }

    playHit();

setTimeout(() => {
        playDie();
}, 150);

triggerGameOver();
}

    // Ceiling Collision
    if (bird.y <= 0) {
        bird.y = 0;

        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem("bestScore", bestScore.toString());
            newRecord = true;
        }

        playHit();
        setTimeout(() => {
            playDie();
        }, 150);

        triggerGameOver();
    }

     let baseSpeed = 3;

switch(currentDifficulty){

case "easy":
    baseSpeed = 2.5;
    break;

case "normal":
    baseSpeed = 3;
    break;

case "hard":
    baseSpeed = 4;
    break;

case "insane":
    baseSpeed = 5;
    break;

}

if (levelUpTimer > 0) {
    levelUpTimer--;

    ctx.fillStyle = "#FFD700";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        levelUpText,
        canvas.width / 2,
        120
    );
}

const pipeSpeed = baseSpeed + Math.floor(score / 10);

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

    statistics.totalPipes++;
     saveStatistics(statistics);

const leveledUp = addXP(statistics, 2);

statistics.coins += 1;

if (leveledUp) {
    levelUpText =
        "LEVEL UP! LEVEL " +
        statistics.level +
        " (+1000 Coins)";
    levelUpTimer = 180;
}

saveStatistics(statistics);

    scorePopupTimer = 30;
    onScore(score);
    playScore();

   
}
      

       if (!gameOver && checkCollision(bird, pipe)) {

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore.toString());
    newRecord = true;
}

    playHit();

setTimeout(() => {
    playDie();
}, 150);

triggerGameOver();
}
    }

    // Spawn New Pipes
    const firstPipe = pipes[0];

    if (firstPipe.x + firstPipe.width < 0) {

        pipes.shift();

        const newPipe = new Pipe(currentDifficulty);

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

    for (const pipe of pipes) {
        pipe.draw(ctx);
    }
    bird.draw(ctx);
    ground.draw(ctx);
    drawHUD(ctx, canvas, score, bestScore, statistics, xpNeeded);

    if (settings.fpsCounter) {
        fpsCounter.update();
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`FPS: ${fpsCounter.getValue()}`, canvas.width - 20, 60);
    }

if (achievementTimer > 0) {
    // decrement handled via achievements.decrementTimers()
    drawAchievementPopup(ctx, canvas, achievementText);
}

// Medal popup
if (medalTimer > 0) {
    drawMedalPopup(ctx, canvas, medalText);
}

if (skinUnlockTimer > 0) {
    drawSkinUnlockPopup(ctx, canvas, skinUnlockText);
}

    if (scorePopupTimer > 0) {
    scorePopupTimer--;
    drawScorePopup(ctx, bird);
}

    // decrement achievement/medal/skin timers
    decrementTimers();

    requestAnimationFrame(gameLoop);
}


// resetGame moved to src/reset.ts

// Start the game loop
gameLoop();