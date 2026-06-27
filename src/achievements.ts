import { saveUnlockedSkin, isSkinUnlocked } from "./skins.js";

export let achievementText = "";
export let achievementTimer = 0;

export let medalText = "";
export let medalTimer = 0;

export let skinUnlockText = "";
export let skinUnlockTimer = 0;

export let unlockedSkin = 0;

const ACHIEVEMENTS_KEY = "skywings_achievements";
const MEDALS_KEY = "skywings_medals";

const newlyUnlockedAchievements = new Set<string>();
const newlyUnlockedMedals = new Set<string>();

function loadSet(key: string): Set<string> {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return new Set();
        const arr = JSON.parse(raw) as string[];
        return new Set(arr);
    } catch {
        return new Set();
    }
}

function saveSet(key: string, s: Set<string>): void {
    const arr = Array.from(s);
    localStorage.setItem(key, JSON.stringify(arr));
}

export function isAchievementUnlocked(id: string): boolean {
    const s = loadSet(ACHIEVEMENTS_KEY);
    return s.has(id);
}

export function unlockAchievementPersistent(id: string, text: string): void {
    const s = loadSet(ACHIEVEMENTS_KEY);
    if (s.has(id)) return; // already unlocked previously, do not show popup
    s.add(id);
    saveSet(ACHIEVEMENTS_KEY, s);
    // show popup for this run
    achievementText = text;
    achievementTimer = 120;
    newlyUnlockedAchievements.add(id);
}

export function isMedalUnlocked(id: string): boolean {
    const s = loadSet(MEDALS_KEY);
    return s.has(id);
}

export function unlockMedalPersistent(id: string, text: string): void {
    const s = loadSet(MEDALS_KEY);
    if (s.has(id)) return; // already unlocked previously, do not show popup
    s.add(id);
    saveSet(MEDALS_KEY, s);
    medalText = text;
    medalTimer = 130;
    newlyUnlockedMedals.add(id);
}

export function onScore(score: number): void {
    // handle skin unlocks (unchanged behavior)
    if (score >= 10 && !isSkinUnlocked("blue")) {
        saveUnlockedSkin("blue");
        skinUnlockText = "🐦 BLUE BIRD UNLOCKED!";
        skinUnlockTimer = 180;
    }

    if (score >= 25 && !isSkinUnlocked("gold")) {
        saveUnlockedSkin("gold");
        skinUnlockText = "🥇 GOLD BIRD UNLOCKED!";
        skinUnlockTimer = 180;
    }

    if (score >= 50 && !isSkinUnlocked("diamond")) {
        saveUnlockedSkin("diamond");
        skinUnlockText = "💎 DIAMOND BIRD UNLOCKED!";
        skinUnlockTimer = 180;
    }

    // achievements (only show popup if newly unlocked now)
    if (score === 5) {
        unlockAchievementPersistent("first_flight", "🏆 First Flight");
    }
    if (score === 10) {
        unlockAchievementPersistent("pipe_dodger", "🏆 Pipe Dodger");
    }
    if (score === 20) {
        unlockAchievementPersistent("sky_explorer", "🏆 Sky Explorer");
    }
    if (score === 30) {
        unlockAchievementPersistent("sky_master", "🏆 Sky Master");
    }
    if (score === 50) {
        unlockAchievementPersistent("legend_pilot", "🏆 Legend Pilot");
    }

    // medals and unlockedSkin index
    if (score === 10) {
        unlockMedalPersistent("bronze", "🥉 Bronze Medal Unlocked!");
        unlockedSkin = 1;
    }
    if (score === 20) {
        unlockMedalPersistent("silver", "🥈 Silver Medal Unlocked!");
        unlockedSkin = 2;
    }
    if (score === 30) {
        unlockMedalPersistent("gold", "🥇 Gold Medal Unlocked!");
        unlockedSkin = 3;
    }
    if (score === 50) {
        unlockMedalPersistent("diamond", "💎 Diamond Medal Unlocked!");
        unlockedSkin = 4;
    }
}

export function decrementTimers(): void {
    if (achievementTimer > 0) achievementTimer--;
    if (medalTimer > 0) medalTimer--;
    if (skinUnlockTimer > 0) skinUnlockTimer--;
}

export function resetAchievements(): void {
    // reset per-run UI state only; do not clear persisted unlocks
    achievementTimer = 0;
    achievementText = "";
    medalTimer = 0;
    medalText = "";
    skinUnlockTimer = 0;
    skinUnlockText = "";
    unlockedSkin = 0;
    newlyUnlockedAchievements.clear();
    newlyUnlockedMedals.clear();
}

export function wasAchievementUnlockedThisRun(id: string): boolean {
    return newlyUnlockedAchievements.has(id);
}

export function wasMedalUnlockedThisRun(id: string): boolean {
    return newlyUnlockedMedals.has(id);
}
