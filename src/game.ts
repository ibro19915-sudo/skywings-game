import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";
import { Ground } from "./ground.js";
import { Clouds } from "./clouds.js";
import { FPSCounter } from "./fps.js";
import { showSkinUnlock } from "./achievements.js";
import { getSelectedSkin } from "./skins.js";
import { isPhone } from "./gameState.js";
import { loadImage } from "./imageLoader.js";

export const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d")!;


export let ground: Ground;
export let clouds: Clouds;
export const pipes: Pipe[] = [];

export const bronzeMedal = loadImage("assets/images/bronze.png");
export const silverMedal = loadImage("assets/images/silver.png");
export const goldMedal = loadImage("assets/images/gold.png");
export const diamondMedal = loadImage("assets/images/diamond.png");

export const bird = new Bird();
export let PLAYABLE_HEIGHT = 240;
export function initScene(currentSkinIndex: number) {
    
    ground = new Ground();
    clouds = new Clouds();


    // initialize pipes
    pipes.length = 0;
    for (let i = 0; i < 3; i++) {
        const pipe = new Pipe((localStorage.getItem("skywings_difficulty") as any) || "normal");
        pipe.x = 480 + i * 250;
        pipes.push(pipe);
    }

    resizeCanvas();
    PLAYABLE_HEIGHT = Math.max(
    240,
    canvas.height - ground.height
);
    bird.loadSkin();
}

export function resizeCanvas(): void {
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

export function unlockBirdByPipes(statistics: any) {
    if (statistics.totalPipes >= 50 && localStorage.getItem("bird_blue_unlocked") !== "true") {
        localStorage.setItem("bird_blue_unlocked", "true");
        showSkinUnlock("BLUE");
    }

    if (statistics.totalPipes >= 150 && localStorage.getItem("bird_gold_unlocked") !== "true") {
        localStorage.setItem("bird_gold_unlocked", "true");
        showSkinUnlock("GOLD");
    }

    if (statistics.totalPipes >= 300 && localStorage.getItem("bird_diamond_unlocked") !== "true") {
        localStorage.setItem("bird_diamond_unlocked", "true");
        showSkinUnlock("DIAMOND");
    }
}
const shopUnlockRequirements = [0, 25, 50, 100];