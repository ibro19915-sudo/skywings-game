import { type Difficulty } from "./difficulty.js";
import type { Settings } from "./settings.js";

export type SettingsMenuOption =
    "difficulty" |
    "soundEffects" |
    "music" |
    "fpsCounter" |
    "resetProgress" |
    "back";

export interface SettingsMenuState {
    selectedOption: SettingsMenuOption;
    settings: Settings;
}

const difficulties: Difficulty[] = ["easy", "normal", "hard", "insane"];

export function createSettingsMenuState(settings: Settings): SettingsMenuState {
    return {
        selectedOption: "difficulty",
        settings
    };
}

function formatOnOff(value: boolean): string {
    return value ? "ON" : "OFF";
}

function formatDifficulty(value: Difficulty): string {
    return value.toUpperCase();
}

export function updateSettingsMenu(
    state: SettingsMenuState,
    key: string
): SettingsMenuState {
    const next = { ...state };

    switch (key) {
        case "ArrowUp":
            if (next.selectedOption === "difficulty") {
                next.selectedOption = "back";
            } else if (next.selectedOption === "soundEffects") {
                next.selectedOption = "difficulty";
            } else if (next.selectedOption === "music") {
                next.selectedOption = "soundEffects";
            } else if (next.selectedOption === "fpsCounter") {
                next.selectedOption = "music";
            } else if (next.selectedOption === "resetProgress") {
                next.selectedOption = "fpsCounter";
            } else if (next.selectedOption === "back") {
                next.selectedOption = "resetProgress";
            }
            break;

        case "ArrowDown":
            if (next.selectedOption === "difficulty") {
                next.selectedOption = "soundEffects";
            } else if (next.selectedOption === "soundEffects") {
                next.selectedOption = "music";
            } else if (next.selectedOption === "music") {
                next.selectedOption = "fpsCounter";
            } else if (next.selectedOption === "fpsCounter") {
                next.selectedOption = "resetProgress";
            } else if (next.selectedOption === "resetProgress") {
                next.selectedOption = "back";
            } else if (next.selectedOption === "back") {
                next.selectedOption = "difficulty";
            }
            break;

        case "ArrowLeft":
            if (next.selectedOption === "difficulty") {
                const currentIndex = difficulties.indexOf(
                    next.settings.difficulty
                );
                const prevIndex =
                    (currentIndex - 1 + difficulties.length) %
                    difficulties.length;

                next.settings.difficulty =
                    difficulties[prevIndex];

            } else if (next.selectedOption === "soundEffects") {
                next.settings.soundEffects = false;

            } else if (next.selectedOption === "music") {
                next.settings.music = false;

            } else if (next.selectedOption === "fpsCounter") {
                next.settings.fpsCounter = false;
            }
            break;

        case "ArrowRight":
            if (next.selectedOption === "difficulty") {
                const currentIndex = difficulties.indexOf(
                    next.settings.difficulty
                );
                const nextIndex =
                    (currentIndex + 1) %
                    difficulties.length;

                next.settings.difficulty =
                    difficulties[nextIndex];

            } else if (next.selectedOption === "soundEffects") {
                next.settings.soundEffects = true;

            } else if (next.selectedOption === "music") {
                next.settings.music = true;

            } else if (next.selectedOption === "fpsCounter") {
                next.settings.fpsCounter = true;
            }
            break;

        case "Enter":
            if (next.selectedOption === "back") {
                next.selectedOption = "back";
            }
            break;
    }

    return next;
}

export function drawSettingsMenu(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    state: SettingsMenuState,
    showResetConfirmation = false,
    resetConfirmationChoice: "yes" | "no" = "yes"
): void {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "48px Arial";
    const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
    ctx.fillText("SETTINGS", canvas.width / 2, 100);

    ctx.font = "28px Arial";
    const startY = 180;
    const lineHeight = 54;

    const options = [
        {
            label: "Difficulty",
            value: formatDifficulty(state.settings.difficulty),
            key: "difficulty" as const
        },
        {
            label: "Sound Effects",
            value: formatOnOff(state.settings.soundEffects),
            key: "soundEffects" as const
        },
        {
    label: "Music",
    value: formatOnOff(state.settings.music),
    key: "music" as const
},
        {
            label: "FPS Counter",
            value: formatOnOff(state.settings.fpsCounter),
            key: "fpsCounter" as const
        },
        {
            label: "Reset Progress",
            value: "",
            key: "resetProgress" as const
        },
        {
            label: "Back",
            value: "",
            key: "back" as const
        }
    ];

    options.forEach((option, index) => {
        const y = startY + index * lineHeight;
        const isSelected = state.selectedOption === option.key;
        ctx.fillStyle = isSelected ? "#FFD700" : "white";
        ctx.fillText(`${option.label}${option.value ? `: ${option.value}` : ""}`, canvas.width / 2, y);
    });

    if (showResetConfirmation) {
        ctx.fillStyle = "#fbbf24";
        ctx.font = "26px Arial";
        ctx.fillText("Are you sure?", canvas.width / 2, 500);

        const yesSelected = resetConfirmationChoice === "yes";
        const noSelected = resetConfirmationChoice === "no";

        ctx.fillStyle = yesSelected ? "#ffffff" : "#888888";
        ctx.fillText("YES", canvas.width / 2 - 70, 550);

        ctx.fillStyle = noSelected ? "#ffffff" : "#888888";
        ctx.fillText("NO", canvas.width / 2 + 70, 550);
    }
 ctx.fillStyle = "white";
ctx.font = "20px Arial";

if (isTouchDevice) {
    ctx.fillText(
       "Touch an option • Touch bottom-left to go back" ,
        canvas.width / 2,
        canvas.height - 30
    );
} else {
    ctx.fillText(
        "Arrow Keys + Enter • Press ESC to go back",
        canvas.width / 2,
        canvas.height - 30
    );
}
}
