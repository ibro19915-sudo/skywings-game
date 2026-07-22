import { loadSettings } from "./settings.js";
import { loadStatistics } from "./statistics.js";
import { getSelectedSkin } from "./skins.js";
import { FPSCounter } from "./fps.js";
import type { Difficulty } from "./difficulty.js";
import type { Settings } from "./settings.js";
import type { Statistics } from "./statistics.js";
import type { SkinType } from "./skins.js";

const skins: SkinType[] = [
    "red",
    "blue",
    "gold",
    "diamond",
];

const initialCurrentSkinIndex = skins.indexOf(getSelectedSkin());

export const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

export const isPhone =
    /iPhone|Android/i.test(navigator.userAgent) &&
    !/iPad/i.test(navigator.userAgent);

export const isIPhone =
    /iPhone/i.test(navigator.userAgent);

export const isIPad =
    /iPad/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" &&
        navigator.maxTouchPoints > 1);

export const GS = {

    score: 0,
    bestScore: Number(localStorage.getItem("bestScore")) || 0,

    scorePopupTimer: 0,

    gameOver: false,
    gameStarted: false,

    countdown: 3,
    countdownRunning: false,
    showGo: false,

    newRecord: false,

    skins,
    currentSkinIndex:
        initialCurrentSkinIndex === -1
            ? 0
            : initialCurrentSkinIndex,

    paused: false,

    resumeCountdown: 3,
    resumeCountdownRunning: false,

    menuBirdY: 0,
    menuTime: 0,

    lastTime: performance.now(),
    delta: 0,
    accumulator: 0,

    statisticsSaveAccumulator: 0,

    // =========================
    // Statistics
    // =========================

    showStatistics: false,

    statisticsPopupScale: 0.9,
statisticsPopupAlpha: 1,
statisticsPopupOpening: false,

    // NEW
    statisticsAnimation: 0,
    statisticsOpening: false,
    statisticsClosing: false,

    // =========================
    // Shop
    // =========================

    showShop: false,
    selectedShopSkin: 0,

    skinPrices: [
        0,
        250,
        1000,
        2500
    ],

    // =========================
    // Difficulty
    // =========================

    currentDifficulty:
        (localStorage.getItem("skywings_difficulty") as Difficulty) ||
        "normal",

    difficulties: [
        "easy",
        "normal",
        "hard",
        "insane"
    ] as Difficulty[],

    // =========================
    // Settings
    // =========================

    settings: loadSettings(),

    showSettingsMenu: false,
    settingsMenuState: null as any,

    showResetConfirmation: false,
    resetConfirmationChoice: "yes" as "yes" | "no",

    showResetSuccess: false,
    resetSuccessTimer: 0,

    // =========================
    // FPS
    // =========================

    fpsCounter: new FPSCounter(),

    // =========================
    // Statistics Save
    // =========================

    statistics: loadStatistics(),

    // =========================
    // XP
    // =========================

    levelUpText: "",
    levelUpTimer: 0,

    bonusText: "",
    bonusTimer: 0,

    // =========================
    // Audio
    // =========================

    menuMusicPlaying: false,
    audioUnlocked: false,

    // =========================
    // Device
    // =========================

    isTouchDevice,
    isPhone,
    isIPhone,
    isIPad,

    ensureMenuMusic(playMenuMusic: () => void) {

        if (
            GS.settings.music &&
            !GS.menuMusicPlaying &&
            !GS.gameStarted
        ) {
            playMenuMusic();
            GS.menuMusicPlaying = true;
        }
    },
};