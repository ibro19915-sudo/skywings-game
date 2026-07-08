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
}
