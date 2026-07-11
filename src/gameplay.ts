import { updatePipes, spawnPipe } from "./pipeManager.js";
import { updateScore } from "./scoreManager.js";
import { checkPipeCollisions } from "./collisionManager.js";
import { unlockBirdByPipes } from "./game.js";

export function updateGameplay(
   GS: any,
    bird: any,
    pipes: any,
    ground: any,
    playableHeight: number
) {

    let baseSpeed = 3;

    switch (GS.currentDifficulty) {
        case "easy":
            baseSpeed = 2.5;
            break;

        case "normal":
            baseSpeed = 3;
            break;

        case "hard":
            baseSpeed = 4;
            break;

        case "insane":
            baseSpeed = 5;
            break;
    }

    const pipeSpeed =
        baseSpeed + Math.floor(GS.score / 10);

    updatePipes(
        pipes,
        pipeSpeed,
        GS.delta
    );

    ground.update(GS.delta);

    updateScore(
        bird,
        pipes,
        GS.statistics,
        GS,
        unlockBirdByPipes
    );

    checkPipeCollisions(
        bird,
        pipes,
        GS
    );

    spawnPipe(
        pipes,
        playableHeight,
        GS.currentDifficulty
    );
}