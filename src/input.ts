import {
    canvas,
    playButton,
    shopButton,
    loginButton,
    statsButton,
     pauseContinueButton,
    pauseMainMenuButton,
    pauseButton,
    restartButton,
    settingsButton
} from "./game.js";
import { handleMenuClick } from "./buttonManager.js";
import {
    loginActionButton,
    signupButton,
    loginBackButton
} from "./loginScreen.js";
import { playButtonClick } from "./audio.js";
import {
    shopPrevButton,
    
    shopNextButton,
    shopActionButton,
    shopBackButton,
    backButton,

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

    onLoginKey: (key: string) => void;

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

          if (GS.showLoginScreen) {
        handlers.onLoginKey(event.key);
        return;
    }


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
    loginButton.setPressed(loginButton.contains(mouseX, mouseY));

    pauseButton.setPressed(
        pauseButton.contains(mouseX, mouseY)
    );
    backButton.setPressed(
    backButton.contains(mouseX, mouseY)
);

if (GS.showLoginScreen) {

    loginActionButton.setPressed(
        loginActionButton.contains(mouseX, mouseY)
    );

    signupButton.setPressed(
        signupButton.contains(mouseX, mouseY)
    );

    loginBackButton.setPressed(
        loginBackButton.contains(mouseX, mouseY)
    );
}

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
    backButton,

   loginActionButton,
signupButton,
loginBackButton,

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
    backButton,

    loginActionButton,
signupButton,
loginBackButton,

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


// =========================
// LOGIN TEXT FIELD FOCUS
// =========================

if (!isTouchDevice && GS.showLoginScreen) {

    // Email field
    if (mouseY >= 155 && mouseY <= 205) {
        GS.loginField = "email";
        return;
    }

    // Password field
    if (mouseY >= 210 && mouseY <= 255) {
        GS.loginField = "password";
        return;
    }
}

// =========================
// LOGIN BUTTON CLICKS
// =========================

if (!isTouchDevice && GS.showLoginScreen) {

    // LOGIN / CREATE ACCOUNT
    if (loginActionButton.contains(mouseX, mouseY)) {
        playButtonClick();
        handlers.onLoginKey("Enter");
        return;
    }

    // SIGN UP / BACK TO LOGIN
    if (signupButton.contains(mouseX, mouseY)) {
        playButtonClick();

        if (GS.loginMode === "login") {
            GS.loginMode = "signup";
        } else {
            GS.loginMode = "login";
        }

        GS.loginMessage = "";
        GS.loginField = "email";
        return;
    }

    // BACK
    if (loginBackButton.contains(mouseX, mouseY)) {
        playButtonClick();
        GS.showLoginScreen = false;
        return;
    }
}
    // Mouse only.
// Touch devices use touchInput.ts instead.
if (!isTouchDevice && handleMenuClick(mouseX, mouseY)) {
    return;
}
   



   if (difficultyLeftButton.contains(mouseX, mouseY)) {
    handlers.onChangeDifficultyPrev();
    return;
}

if (difficultyRightButton.contains(mouseX, mouseY)) {
    handlers.onChangeDifficultyNext();
    return;
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
    loginActionButton.setHoverState(false);
loginBackButton.setHoverState(false);

    canvas.style.cursor = "default";
    return;
}


  let buttons;

if (GS.showLoginScreen) {

    buttons = [
        loginActionButton,
        signupButton,
        loginBackButton
    ];

}
else if (GS.showSettingsMenu) {

    if (GS.showResetConfirmation) {

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
            settingsBackButton,
            backButton
        ];

    }
}
else if (GS.showShop) {

    buttons = [
        shopPrevButton,
        shopNextButton,
        shopActionButton,
        shopBackButton,
        backButton
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
        statisticsBackButton,
        backButton
    ];

}
else {
    buttons = [
        playButton,
        pauseButton,
        shopButton,
        statsButton,
        settingsButton,
        loginButton
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
