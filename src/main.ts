import { initScene, resizeCanvas } from "./game.js";
import { GS } from "./gameState.js";
import { initializeInput } from "./inputHandlers.js";
import { initTouchHandlers } from "./touchInput.js";
import { startGameLoop } from "./gameloop.js";

// Initialize scene and start everything
initScene(GS.currentSkinIndex);

window.addEventListener("resize", () => resizeCanvas());
window.addEventListener("orientationchange", resizeCanvas);

initializeInput();
initTouchHandlers();
startGameLoop();
