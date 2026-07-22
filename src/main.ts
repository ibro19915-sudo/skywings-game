import { initScene, resizeCanvas } from "./game.js";
import { GS } from "./gameState.js";
import { initializeInput } from "./inputHandlers.js";
import { initTouchHandlers } from "./touchInput.js";
import { startGameLoop } from "./gameloop.js";
import { loadSettings } from "./settings.js";
import { setAudioSettings } from "./audio.js";

// Initialize scene and start everything
initScene(GS.currentSkinIndex);

// Load saved settings immediately
GS.settings = loadSettings();
setAudioSettings(GS.settings);

window.addEventListener("resize", () => resizeCanvas());
window.addEventListener("orientationchange", resizeCanvas);

initializeInput();
initTouchHandlers();
startGameLoop();