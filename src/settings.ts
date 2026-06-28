import { getDifficulty, saveDifficulty, type Difficulty } from "./difficulty.js";

export interface Settings {
    difficulty: Difficulty;
    soundEffects: boolean;
    music: boolean;
    fpsCounter: boolean;
}

const SETTINGS_KEY = "skywings_settings";

function isDifficulty(value: string): value is Difficulty {
    return value === "easy" || value === "normal" || value === "hard" || value === "insane";
}

export function loadSettings(): Settings {
    const raw = localStorage.getItem(SETTINGS_KEY);

    if (!raw) {
        return {
            difficulty: getDifficulty(),
            soundEffects: true,
            music: true,
            fpsCounter: false
        };
    }

    try {
        const parsed = JSON.parse(raw) as Partial<Settings>;

        return {
            difficulty: isDifficulty(parsed.difficulty ?? "")
                ? parsed.difficulty!
                : getDifficulty(),
            soundEffects: parsed.soundEffects ?? true,
            music: parsed.music ?? true,
            fpsCounter: parsed.fpsCounter ?? false
        };
    } catch {
        return {
            difficulty: getDifficulty(),
            soundEffects: true,
            music: true,
            fpsCounter: false
        };
    }
}



export function saveSettings(settings: Settings): void {
  const normalized: Settings = {
    difficulty: isDifficulty(settings.difficulty)
        ? settings.difficulty
        : getDifficulty(),
    soundEffects: settings.soundEffects,
    music: settings.music,
    fpsCounter: settings.fpsCounter
};

    saveDifficulty(normalized.difficulty);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(normalized));
}
