const wing = new Audio("assets/sounds/wing.mp3");
const score = new Audio("assets/sounds/score.mp3");
const hit = new Audio("assets/sounds/hit.mp3");
const die = new Audio("assets/sounds/die.mp3");

let soundEffectsEnabled = true;

export function setAudioSettings(settings: { soundEffects: boolean }): void {
    soundEffectsEnabled = settings.soundEffects;
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

