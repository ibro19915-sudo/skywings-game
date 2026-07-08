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

import {
    drawGameOver,
    drawPauseScreen,
    drawResumeCountdown,
    drawMenu,
    drawHUD,
    drawAchievementPopup,
    drawMedalPopup,
    drawSkinUnlockPopup,
    drawScorePopup,
    drawShop
} from "./ui.js";

import { achievementText, achievementTimer, medalText, medalTimer, skinUnlockText, skinUnlockTimer, unlockedSkin, onScore, decrementTimers, resetAchievements, showSkinUnlock } from "./achievements.js";
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

//music
import {
    playWing,
    playScore,
    playHit,
    playDie,
    setAudioSettings,
    playMenuMusic,
    stopMenuMusic
} from "./audio.js";






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

let currentSkinIndex = skins.indexOf(getSelectedSkin());

if (currentSkinIndex === -1) {
    currentSkinIndex = 0;
}

// achievement/medal/skin state moved to src/achievements.ts

// pauser
let paused = false;

// resume countdown
let resumeCountdown = 3;
let resumeCountdownRunning = false;
// Menu animation
const bird = new Bird();
let menuBirdY = bird.y;
let menuTime = 0;


//count playtime
let lastTime = performance.now();
let statisticsSaveAccumulator = 0;

// showing statistics
let showStatistics = false;
let showShop = false;
let selectedShopSkin = 0;
const skinPrices = [0, 250, 1000, 2500];

//difficulty
let currentDifficulty: Difficulty = getDifficulty();
const difficulties: Difficulty[] = ["easy", "normal", "hard", "insane"];

let settings: Settings = loadSettings();
let showSettingsMenu = false;
let settingsMenuState: SettingsMenuState | null = null;
let showResetConfirmation = false;
let resetConfirmationChoice: "yes" | "no" = "yes";
let fpsCounter = new FPSCounter();

function ensureMenuMusic(): void {
    if (settings.music && !menuMusicPlaying && !gameStarted) {
        playMenuMusic();
        menuMusicPlaying = true;
    }
}

// stattiscs
let statistics: Statistics = loadStatistics();

// level up
let levelUpText = "";
let levelUpTimer = 0;

//bonus
let bonusText = "";
let bonusTimer = 0;

// music
let menuMusicPlaying = false;
let audioUnlocked = false;

const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
const isPhone =
    /iPhone|Android/i.test(navigator.userAgent) &&
    !/iPad/i.test(navigator.userAgent);
const isIPhone = /iPhone/i.test(navigator.userAgent);
const isIPad =
    /iPad/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

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
    if (showShop) {
    selectedShopSkin--;

    if (selectedShopSkin < 0) {
        selectedShopSkin = skins.length - 1;
    }

    return;
}
    
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
   if (showShop) {
    selectedShopSkin++;

    if (selectedShopSkin >= skins.length) {
        selectedShopSkin = 0;
    }

    return;
}
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
    if (showShop) {
      
        const shopSkins: SkinType[] = [
    "red",
    "blue",
    "gold",
    "diamond"
];
        const requirements = [0, 50, 150, 300];

        const skin = shopSkins[selectedShopSkin];
        const requiredPipes = requirements[selectedShopSkin];

        const alreadyOwned = isSkinUnlocked(skin);

        const canUnlock =
            statistics.totalPipes >= requiredPipes;

        if (!alreadyOwned && canUnlock) {
         const price = skinPrices[selectedShopSkin];
          if (statistics.coins >= price) {
    statistics.coins -= price;

    saveUnlockedSkin(skin);
    saveSelectedSkin(skin);
    currentSkinIndex = skins.indexOf(skin);
    saveStatistics(statistics);
    bird.loadSkin();
    showShop = false;
}
        }

        return;
    }

    if (showSettingsMenu || showStatistics) {
    return;
}
   
    if (!gameStarted && !countdownRunning && !showStatistics && !showSettingsMenu && !showShop) {
        ensureMenuMusic();
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
                stopMenuMusic();
                menuMusicPlaying = false;

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

        if (settings.music && !menuMusicPlaying) {
            playMenuMusic();
            menuMusicPlaying = true;
        }

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
    onOpenShop: () => {
    if (!gameStarted && !showStatistics && !showSettingsMenu) {
        showShop = true;
        selectedShopSkin = 0;
    }
},
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
    if (showShop) {
        showShop = false;
    } else if (showSettingsMenu) {
        showSettingsMenu = false;
        settingsMenuState = null;
    } else if (showStatistics) {
        showStatistics = false;
    }
},
    
    
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

    // Remove pipe unlock progress too
    localStorage.removeItem("bird_blue_unlocked");
    localStorage.removeItem("bird_gold_unlocked");
    localStorage.removeItem("bird_diamond_unlocked");

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
    stopMenuMusic();
menuMusicPlaying = false;

    // Equip red bird again
    saveSelectedSkin("red");
    currentSkinIndex = 0;
    bird.loadSkin();
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

    if (settings.music && !gameStarted && !menuMusicPlaying) {
        playMenuMusic();
        menuMusicPlaying = true;
    }

    if (!settings.music) {
        stopMenuMusic();
        menuMusicPlaying = false;
    }

    if (settings.music && !menuMusicPlaying) {
        playMenuMusic();
        menuMusicPlaying = true;
    }

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

    if (settings.music) {
        playMenuMusic();
        menuMusicPlaying = true;
    }
}





// Find the canvas on the webpage
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

function resizeCanvas(): void {
    if (isPhone) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
    }

    if (ground) {
        ground.width = canvas.width;
        ground.height = Math.max(60, Math.round(canvas.height * 0.09));
        ground.y = canvas.height - ground.height;
    }
}

window.addEventListener("resize", () => {
    if (isPhone) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
window.addEventListener("orientationchange", resizeCanvas);

function getCanvasTouchCoordinates(clientX: number, clientY: number): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.width;
    const height = rect.height || canvas.height;

    return {
        x: (clientX - rect.left) * (canvas.width / width),
        y: (clientY - rect.top) * (canvas.height / height),
    };
}

let touchStartX = 0;
let touchStartY = 0;
let touchStartInDifficultyZone = false;

canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();

    if (!audioUnlocked) {
        audioUnlocked = true;

        if (settings.music && !menuMusicPlaying) {
            playMenuMusic();
            menuMusicPlaying = true;
        }
    }

    if (!isTouchDevice) {
        return;
    }

    const touch = event.touches[0];
    const { x, y } = getCanvasTouchCoordinates(touch.clientX, touch.clientY);

    touchStartX = x;
    touchStartY = y;
    touchStartInDifficultyZone = false;

    const isLeftEdge = x < canvas.width * 0.2;
    const isRightEdge = x > canvas.width * 0.8;
    const isTopLeftCorner = x < canvas.width * 0.25 && y < canvas.height * 0.2;
    const isTopRightCorner = x > canvas.width * 0.75 && y < canvas.height * 0.2;
    const isBottomLeftCorner = x < canvas.width * 0.25 && y > canvas.height * 0.8;
    const isBottomCenter = x >= canvas.width * 0.25 && x <= canvas.width * 0.75 && y > canvas.height * 0.8;
    const isCenterArea = x >= canvas.width * 0.25 && x <= canvas.width * 0.75;
    const difficultyTextY = canvas.height * 0.38;
    const difficultyTextBand = canvas.height * 0.06;
    const isDifficultyZone =
        isIPhone &&
        !gameStarted &&
        !countdownRunning &&
        !showStatistics &&
        !showSettingsMenu &&
        !showShop &&
        y >= difficultyTextY - difficultyTextBand &&
        y <= difficultyTextY + difficultyTextBand &&
        x >= canvas.width * 0.2 &&
        x <= canvas.width * 0.8;
    const isIPadDifficultyArea =
        isIPad &&
        !gameStarted &&
        !countdownRunning &&
        !showStatistics &&
        !showSettingsMenu &&
        !showShop &&
        x > canvas.width * 0.25 &&
        x < canvas.width * 0.75 &&
        y > 300 &&
        y < 380;

    if (isDifficultyZone) {
        touchStartInDifficultyZone = true;
        if (x < canvas.width / 2) {
            onChangeDifficultyPrev();
        } else {
            onChangeDifficultyNext();
        }
        return;
    }

    if (isIPadDifficultyArea) {
        onChangeDifficultyNext();
        return;
    }

    if (showSettingsMenu && settingsMenuState) {
        if (isBottomLeftCorner) {
            showSettingsMenu = false;
            settingsMenuState = null;
            showResetConfirmation = false;
            return;
        }

        const optionRowHeight = 54;
        const optionStartY = 180;
        const optionIndex = Math.floor((y - optionStartY + optionRowHeight / 2) / optionRowHeight);

        if (showResetConfirmation) {
            if (x < canvas.width / 2) {
                resetConfirmationChoice = "yes";
                resetAllProgress();
                showSettingsMenu = false;
                settingsMenuState = null;
                showResetConfirmation = false;
            } else {
                resetConfirmationChoice = "no";
                showResetConfirmation = false;
            }
            return;
        }

        if (optionIndex === 0) {
            const currentIndex = difficulties.indexOf(settingsMenuState.settings.difficulty);
            const nextIndex = (currentIndex + 1) % difficulties.length;
            settingsMenuState.settings.difficulty = difficulties[nextIndex];
            settings = settingsMenuState.settings;
            currentDifficulty = settings.difficulty;
            saveSettings(settings);
            setAudioSettings(settings);
            return;
        }

        if (optionIndex === 1) {
            settingsMenuState.settings.soundEffects = !settingsMenuState.settings.soundEffects;
            settings = settingsMenuState.settings;
            saveSettings(settings);
            setAudioSettings(settings);
            if (settings.music && !gameStarted && !menuMusicPlaying) {
                playMenuMusic();
                menuMusicPlaying = true;
            }
            return;
        }

        if (optionIndex === 2) {
            settingsMenuState.settings.music = !settingsMenuState.settings.music;
            settings = settingsMenuState.settings;
            saveSettings(settings);
            setAudioSettings(settings);
            if (settings.music && !gameStarted && !menuMusicPlaying) {
                playMenuMusic();
                menuMusicPlaying = true;
            }
            if (!settings.music) {
                stopMenuMusic();
                menuMusicPlaying = false;
            }
            return;
        }

        if (optionIndex === 3) {
            settingsMenuState.settings.fpsCounter = !settingsMenuState.settings.fpsCounter;
            settings = settingsMenuState.settings;
            saveSettings(settings);
            return;
        }

        if (optionIndex === 4) {
            showResetConfirmation = true;
            resetConfirmationChoice = "yes";
            return;
        }

        if (optionIndex === 5) {
            showSettingsMenu = false;
            settingsMenuState = null;
            return;
        }

        return;
    }

    if (showStatistics) {
        if (isBottomLeftCorner) {
            showStatistics = false;
        }
        return;
    }

    if (showShop) {
        if (isBottomLeftCorner) {
            showShop = false;
            return;
        }

        if (isLeftEdge) {
            onChangeSkinLeft();
            return;
        }

        if (isRightEdge) {
            onChangeSkinRight();
            return;
        }

        if (isCenterArea) {
            onSpace();
            return;
        }

        return;
    }

    if (gameOver) {
        onSpace();
        return;
    }

    if (gameStarted && paused && !gameOver) {
        onTogglePause();
        return;
    }

    if (gameStarted && !paused && !gameOver && isTopRightCorner) {
        onTogglePause();
        return;
    }

    if (!gameStarted && !countdownRunning && !showStatistics && !showSettingsMenu) {
        if (isTopLeftCorner) {
            showStatistics = true;
            return;
        }

        if (isTopRightCorner) {
            openSettingsMenu();
            return;
        }

        if (isBottomCenter) {
            showShop = true;
            selectedShopSkin = 0;
            return;
        }

        if (isIPhone) {
            if (isLeftEdge) {
                onChangeSkinLeft();
                return;
            }

            if (isRightEdge) {
                onChangeSkinRight();
                return;
            }

            if (isCenterArea) {
                onSpace();
                return;
            }

            return;
        }

        if (isLeftEdge) {
            onChangeSkinLeft();
            return;
        }

        if (isRightEdge) {
            onChangeSkinRight();
            return;
        }

        onSpace();
        return;
    }

    if (gameStarted && !paused && !gameOver) {
        onSpace();
    }
});

canvas.addEventListener("touchend", (event) => {
    if (!isTouchDevice || !isIPhone || !touchStartInDifficultyZone) {
        return;
    }

    event.preventDefault();

    const touch = event.changedTouches[0];
    const { x, y } = getCanvasTouchCoordinates(touch.clientX, touch.clientY);
    const deltaX = x - touchStartX;
    const deltaY = y - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX < 0) {
            onChangeDifficultyNext();
        } else {
            onChangeDifficultyPrev();
        }
    }
});

// Get the 2D drawing context
const ctx = canvas.getContext("2d")!;

// ground 

let ground: Ground;
let clouds: Clouds;
ground = new Ground();
clouds = new Clouds();
resizeCanvas();
// Audio is handled in src/audio.ts via helper functions

const bronzeMedal = new Image();
bronzeMedal.src = "assets/images/bronze.png";

const silverMedal = new Image();
silverMedal.src = "assets/images/silver.png";

const goldMedal = new Image();
goldMedal.src = "assets/images/gold.png";

const diamondMedal = new Image();
diamondMedal.src = "assets/images/diamond.png";






function unlockBirdByPipes(): void {
  if (
    statistics.totalPipes >= 50 &&
    localStorage.getItem("bird_blue_unlocked") !== "true"
) {
    localStorage.setItem("bird_blue_unlocked", "true");
    showSkinUnlock("BLUE");
}

    if (
    statistics.totalPipes >= 150 &&
    localStorage.getItem("bird_gold_unlocked") !== "true"
) {
    localStorage.setItem("bird_gold_unlocked", "true");
    showSkinUnlock("GOLD");
}

if (
    statistics.totalPipes >= 300 &&
    localStorage.getItem("bird_diamond_unlocked") !== "true"
) {
    localStorage.setItem("bird_diamond_unlocked", "true");
    showSkinUnlock("DIAMOND");
}
}





// resetGame moved to src/reset.ts

// Start the game loop


   


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
if (showShop) {
    drawShop(
        ctx,
        canvas,
        statistics,
        selectedShopSkin
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
        menuBirdY = 350 + Math.sin(menuTime) * 15;
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

    const playableHeight = Math.max(240, canvas.height - ground.height);

    // Ground Collision
    if (bird.y + bird.height >= ground.y) {

    bird.y = ground.y - bird.height;

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
    ctx.font = "24px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        levelUpText,
        canvas.width / 2,
        80
    );
}

if (bonusTimer > 0) {
    bonusTimer--;

    ctx.fillStyle = "#00FF00";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        bonusText,
        canvas.width / 2,
        110
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
unlockBirdByPipes();

const leveledUp = addXP(statistics, 2);

statistics.coins += 1;

if (leveledUp) {
    levelUpText = `LEVEL ${statistics.level}!`;
    levelUpTimer = 180;

    statistics.coins += 1000;

    bonusText = "+1000 COINS BONUS!";
    bonusTimer = 180;
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
        newPipe.playableHeight = playableHeight;

        const lastPipe = pipes[pipes.length - 1];

        newPipe.x = lastPipe.x + 250;
        newPipe.passed = false;

        const minHeight = 80;
        const maxHeight = Math.max(minHeight + 1, playableHeight - newPipe.gap - 70);

        newPipe.topHeight =
            minHeight + Math.random() * (maxHeight - minHeight);
        newPipe.topHeight = Math.min(newPipe.topHeight, playableHeight - newPipe.gap - 70);

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