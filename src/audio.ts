const wing = new Audio("assets/sounds/wing.mp3");
const score = new Audio("assets/sounds/score.mp3");
const hit = new Audio("assets/sounds/hit.mp3");
const die = new Audio("assets/sounds/die.mp3");
const menuMusic = new Audio(
      "assets/sounds/menuMusic.mp3"
);

menuMusic.loop = true;
menuMusic.volume = 0.5;


let soundEffectsEnabled = true;
let musicEnabled = true;



export function playMenuMusic(): void {
    if (!musicEnabled) return;

    menuMusic.currentTime = 0;
    void menuMusic.play();
}

export function stopMenuMusic(): void {
    menuMusic.pause();

    menuMusic.currentTime = 0;
}

import type { Settings } from "./settings.js";

export function setAudioSettings(settings: Settings): void {
    soundEffectsEnabled = settings.soundEffects;
    musicEnabled = settings.music;

    if (!musicEnabled) {
        menuMusic.pause();
        menuMusic.currentTime = 0;
    }
}

function playSound(audio: HTMLAudioElement): void {
    if (!soundEffectsEnabled) {
        return;
    }

    audio.pause();
    audio.currentTime = 0;
    void audio.play();
}

export function playWing(): void {
    playSound(wing);
}

export function playScore(): void {
    playSound(score);
}

export function playHit(): void {
    playSound(hit);
}

export function playDie(): void {
    playSound(die);
}

