import {
    canvas,
    playButton,
    shopButton,
    statsButton,
     pauseContinueButton,
    pauseMainMenuButton,
    pauseButton,
    restartButton,
    settingsButton
} from "./game.js";
import { handleMenuClick } from "./buttonManager.js";

import {
    shopPrevButton,
    shopNextButton,
    shopActionButton,
    shopBackButton,

    settingsMusicButton,
    settingsSoundButton,
    settingsFPSButton,
    settingsDifficultyButton,
    settingsResetButton,
    settingsBackButton,
    settingsYesButton,
    statisticsBackButton,
    settingsNoButton,
    difficultyLeftButton,
    difficultyRightButton
} from "./game.js";
import { GS } from "./gameState.js";

export interface InputHandlers {
	onTogglePause: () => void;
	onChangeSkinLeft: () => void;
	onChangeSkinRight: () => void;
	onChangeDifficultyPrev: () => void;
	onChangeDifficultyNext: () => void;
	onOpenShop: () => void;
	onOpenSettings: () => void;
	onSettingsKey: (key: string) => void;
	onSpace: () => void;
	onShowStatistics: () => void;
	onHideStatistics: () => void;
	
}
import { playButtonHover } from "./audio.js";


export function setupInput(handlers: InputHandlers): void {
	const isTouchDevice =
		"ontouchstart" in window || navigator.maxTouchPoints > 0;

	document.addEventListener("keydown", (event) => {
		if (event.code === "KeyP") {
			handlers.onTogglePause();
			return;
		}

		if (event.code === "KeyA") {
			handlers.onChangeSkinLeft();
			return;
		}

		if (event.code === "KeyD") {
			handlers.onChangeSkinRight();
			return;
		}

		if (event.code === "KeyQ" && !isTouchDevice) {
			handlers.onChangeDifficultyPrev();
			return;
		}

		if (event.code === "KeyE" && !isTouchDevice) {
			handlers.onChangeDifficultyNext();
			return;
		}

		if (event.code === "KeyS") {
			handlers.onShowStatistics();
			return;
		}

		if (event.code === "KeyB") {
            handlers.onOpenShop();
         return;
        }


		if (event.code === "KeyM") {
			handlers.onOpenSettings();
			return;
		}

		if (event.code === "Escape") {
			handlers.onHideStatistics();
			return;
		}

		if (event.code === "ArrowUp" || event.code === "ArrowDown" || event.code === "ArrowLeft" || event.code === "ArrowRight" || event.code === "Enter") {
			handlers.onSettingsKey(event.code);
			return;
		}

		if (event.code === "Space") {
			handlers.onSpace();
			return;
		}
	});
	
	canvas.addEventListener("mousedown", (event) => {

    if (GS.countdownRunning || GS.showGo) {
    return;
}

    const rect = canvas.getBoundingClientRect();

    const mouseX =
        (event.clientX - rect.left) *
        (canvas.width / rect.width);

    const mouseY =
        (event.clientY - rect.top) *
        (canvas.height / rect.height);

    if (!GS.showStatistics) {

    playButton.setPressed(playButton.contains(mouseX, mouseY));
    shopButton.setPressed(shopButton.contains(mouseX, mouseY));
    statsButton.setPressed(statsButton.contains(mouseX, mouseY));
    settingsButton.setPressed(settingsButton.contains(mouseX, mouseY));

    pauseButton.setPressed(
        pauseButton.contains(mouseX, mouseY)
    );

}

    if (GS.showShop) {

    shopPrevButton.setPressed(
        shopPrevButton.contains(mouseX, mouseY)
    );

    shopNextButton.setPressed(
        shopNextButton.contains(mouseX, mouseY)
    );

    shopActionButton.setPressed(
        shopActionButton.contains(mouseX, mouseY)
    );

    shopBackButton.setPressed(
        shopBackButton.contains(mouseX, mouseY)
    );

}

if (GS.paused) {

    pauseContinueButton.setPressed(
        pauseContinueButton.contains(mouseX, mouseY)
    );

    pauseMainMenuButton.setPressed(
        pauseMainMenuButton.contains(mouseX, mouseY)
    );

    return;
}

if (GS.gameOver) {

    restartButton.setPressed(
        restartButton.contains(mouseX, mouseY)
    );

    return;
}

if (GS.showSettingsMenu) {

    if (GS.showResetConfirmation) {

        settingsYesButton.setPressed(
            settingsYesButton.contains(mouseX, mouseY)
        );

        settingsNoButton.setPressed(
            settingsNoButton.contains(mouseX, mouseY)
        );

    } else {

        settingsMusicButton.setPressed(
            settingsMusicButton.contains(mouseX, mouseY)
        );

        settingsSoundButton.setPressed(
            settingsSoundButton.contains(mouseX, mouseY)
        );

        settingsFPSButton.setPressed(
            settingsFPSButton.contains(mouseX, mouseY)
        );

        settingsDifficultyButton.setPressed(
            settingsDifficultyButton.contains(mouseX, mouseY)
        );

        settingsResetButton.setPressed(
            settingsResetButton.contains(mouseX, mouseY)
        );

        settingsBackButton.setPressed(
            settingsBackButton.contains(mouseX, mouseY)
        );

    }
    

}
if (GS.showStatistics) {

    statisticsBackButton.setPressed(

        statisticsBackButton.contains(
            mouseX,
            mouseY
        )

    );

}

});

canvas.addEventListener("mouseup", () => {

    const buttons = [

        pauseButton,
        restartButton,
        playButton,
        shopButton,
        statsButton,
        settingsButton,

        pauseContinueButton,
        pauseMainMenuButton,

        statisticsBackButton,

        shopPrevButton,
        shopNextButton,
        shopActionButton,
        shopBackButton,

        settingsMusicButton,
        settingsSoundButton,
        settingsFPSButton,
        settingsDifficultyButton,
        settingsResetButton,
        settingsBackButton,
        settingsYesButton,
        settingsNoButton

    ];

    for (const button of buttons) {
        button.setPressed(false);
    }

});

canvas.addEventListener("mouseleave", () => {

    const buttons = [
        pauseButton,
        restartButton,
        playButton,
        shopButton,
        statsButton,
        settingsButton,

        pauseContinueButton,
        pauseMainMenuButton,

        statisticsBackButton,

        shopPrevButton,
        shopNextButton,
        shopActionButton,
        shopBackButton,

        settingsMusicButton,
        settingsSoundButton,
        settingsFPSButton,
        settingsDifficultyButton,
        settingsResetButton,
        settingsBackButton,
        settingsYesButton,
        settingsNoButton
    ];

    for (const button of buttons) {
        button.setPressed(false);
        button.setHoverState(false);
    }

    canvas.style.cursor = "default";

});
	
	canvas.addEventListener("click", (event) => {

        if (GS.countdownRunning || GS.showGo) {
    return;
}

    const rect = canvas.getBoundingClientRect();

    const mouseX =
        (event.clientX - rect.left) *
        (canvas.width / rect.width);

    const mouseY =
        (event.clientY - rect.top) *
        (canvas.height / rect.height);

     if (
    isTouchDevice &&
    GS.gameStarted &&
    !GS.gameOver &&
    !GS.paused &&
    pauseButton.contains(mouseX, mouseY)
) {
    handlers.onTogglePause();
    return;
}
if (
    GS.gameOver &&
    restartButton.contains(mouseX, mouseY)
) {
    handlers.onSpace();
    return;
}

   if (
    GS.gameOver &&
    restartButton.contains(mouseX, mouseY)
) {
    handlers.onSpace();   // restart game
    return;
}

    if (handleMenuClick(mouseX, mouseY)) {
    return;
    if (
    GS.gameOver &&
    restartButton.contains(mouseX, mouseY)
) {
    handlers.onSpace();
    return;
}


}
    if (difficultyLeftButton.contains(mouseX, mouseY)) {
    // decrease difficulty
}

if (difficultyRightButton.contains(mouseX, mouseY)) {
    // increase difficulty
}

});


 canvas.addEventListener("mousemove", (event) => {

    const rect = canvas.getBoundingClientRect();

    const mouseX =
        (event.clientX - rect.left) *
        (canvas.width / rect.width);

    const mouseY =
        (event.clientY - rect.top) *
        (canvas.height / rect.height);

        if (GS.countdownRunning || GS.showGo) {

    playButton.setHoverState(false);
    shopButton.setHoverState(false);
    statsButton.setHoverState(false);
    settingsButton.setHoverState(false);

    canvas.style.cursor = "default";
    return;
}


   let buttons;

if (GS.showSettingsMenu) {

    if (GS.showResetConfirmation) {

        // Position buttons first
        settingsYesButton.x =
            canvas.width / 2 - settingsYesButton.width - 15;

        settingsYesButton.y =
            (canvas.height - 260) / 2 + 170;

        settingsNoButton.x =
            canvas.width / 2 + 15;

        settingsNoButton.y =
            (canvas.height - 260) / 2 + 170;

        buttons = [
            settingsYesButton,
            settingsNoButton
        ];

    } else {

        buttons = [
            settingsMusicButton,
            settingsSoundButton,
            settingsFPSButton,
            settingsDifficultyButton,
            settingsResetButton,
            settingsBackButton
        ];

    }

}
else if (GS.showShop) {

    buttons = [

        shopPrevButton,
        shopNextButton,
        shopActionButton,
        shopBackButton

    ];

}
else if (GS.paused) {

    buttons = [

        pauseContinueButton,
        pauseMainMenuButton

    ];

}else if (GS.gameOver) {

    buttons = [

        restartButton

    ];

}
else if (GS.showStatistics) {

    buttons = [

        statisticsBackButton

    ];

}
else {

    buttons = [

        playButton,
        pauseButton,
        shopButton,
        statsButton,
        settingsButton

    ];

}

 difficultyLeftButton.setHover(mouseX, mouseY);
difficultyRightButton.setHover(mouseX, mouseY);
for (const button of buttons) {

    const wasHovered = button.hovered;

    button.setHover(mouseX, mouseY);

   

    if (button.hovered && !wasHovered) {
        playButtonHover();
    }

}

    const hovering =
    buttons.some(button => button.hovered);

    canvas.style.cursor = hovering ? "pointer" : "default";

});
}
