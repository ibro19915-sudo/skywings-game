export type Difficulty = 
     | "easy"
    | "normal"
    | "hard"
    | "insane";

    const KEY = "skywings_difficulty";

    export function getDifficulty(): Difficulty {

        const saved = localStorage.getItem(KEY) as Difficulty;

        if (
            saved === "easy" ||
            saved === "normal" ||
        saved === "hard" ||
        saved === "insane"
            
        ){
            return saved;
        }
            return "normal";
        }
   
   
   export function saveDifficulty(
    difficulty: Difficulty
   ): void {

         localStorage.setItem(KEY, difficulty);

   }
    