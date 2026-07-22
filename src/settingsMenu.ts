import { type Difficulty } from "./difficulty.js";
import type { Settings } from "./settings.js";

import {
    settingsMusicButton,
    settingsSoundButton,
    settingsFPSButton,
    settingsDifficultyButton,
    difficultyLeftButton,
    difficultyRightButton,
    settingsResetButton,
    settingsBackButton,
    settingsYesButton,
    settingsNoButton
} from "./game.js";
export type SettingsMenuOption =
    "difficulty" |
    "soundEffects" |
    "music" |
    "fpsCounter" |
    "resetProgress" |
    "back";
    import { GS } from "./gameState.js";

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
    ctx.font = "bold 44px Arial";
    ctx.fillText("⚙ Settings", canvas.width / 2, 100);

    // Update button text
    settingsMusicButton.text =
        state.settings.music ? "ON" : "OFF";

    settingsSoundButton.text =
        state.settings.soundEffects ? "ON" : "OFF";

    settingsFPSButton.text =
        state.settings.fpsCounter ? "ON" : "OFF";

    settingsDifficultyButton.text =
    state.settings.difficulty.toUpperCase();

    // Labels
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = "24px Arial";

const iconX = canvas.width * 0.12;
const textX = iconX + 42;

ctx.fillText("🎵", iconX, settingsMusicButton.y + 36);
ctx.fillText("Music", textX, settingsMusicButton.y + 36);

ctx.fillText("🔊", iconX, settingsSoundButton.y + 36);
ctx.fillText("Sound", textX, settingsSoundButton.y + 36);

ctx.fillText("📊", iconX, settingsFPSButton.y + 36);
ctx.fillText("FPS Counter", textX, settingsFPSButton.y + 36);

ctx.fillText("🎯", iconX, settingsDifficultyButton.y + 36);
ctx.fillText("Difficulty", textX, settingsDifficultyButton.y + 36);

    // Draw normal buttons
   settingsMusicButton.draw(ctx);
settingsSoundButton.draw(ctx);
settingsFPSButton.draw(ctx);

difficultyLeftButton.draw(ctx);
settingsDifficultyButton.hovered = false;
settingsDifficultyButton.pressed = false;
settingsDifficultyButton.draw(ctx);
difficultyRightButton.draw(ctx);

    
    ctx.save();

difficultyLeftButton.draw(ctx);
difficultyRightButton.draw(ctx);


    settingsResetButton.draw(ctx);
    settingsBackButton.draw(ctx);


  
     
    // Popup
    if (showResetConfirmation) {

        // Dark overlay
        
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const boxWidth = 460;
        const boxHeight = 260;

        const boxX = (canvas.width - boxWidth) / 2;
        const boxY = (canvas.height - boxHeight) / 2;

        // Window
        ctx.fillStyle = "#111827";
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        ctx.fillStyle = "#fbbf24";
        ctx.textAlign = "center";
        ctx.font = "30px Arial";

        ctx.fillText(
            "Are you sure you want",
            canvas.width / 2,
            boxY + 70
        );

        ctx.fillText(
            "to reset all progress?",
            canvas.width / 2,
            boxY + 110
        );

        // YES button
       settingsYesButton.width = 150;
settingsYesButton.height = 55;
settingsYesButton.y = boxY + 170;
       //No button
settingsNoButton.width = 150;
settingsNoButton.height = 55;
settingsNoButton.y = boxY + 170;





// Keep centered
settingsYesButton.x =
    canvas.width / 2 - settingsYesButton.width - 15;

settingsNoButton.x =
    canvas.width / 2 + 15;



settingsYesButton.draw(ctx);
settingsNoButton.draw(ctx);




    }
     // Draw success message
if (GS.showResetSuccess) {

    ctx.save();

    ctx.fillStyle = "#00ff66";
    ctx.textAlign = "center";
    ctx.font = "bold 24px Arial";

    ctx.fillText(
        "✓ Progress Reset Successfully!",
        canvas.width / 2,
        settingsResetButton.y - 20
    );

    ctx.restore();
}
}
