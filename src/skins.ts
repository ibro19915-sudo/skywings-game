export type SkinType =
| "red"
    | "blue"
    | "gold"
    | "diamond";

    export const skinUnlockScores = {
    red:0,
    blue: 10,
    gold: 25,
    diamond: 50

    };

    export function saveUnlockedSkin(skin: SkinType): void {

        localStorage.setItem(
            "skin_" + skin,
            "unlocked"
        );
    }

    export function isSkinUnlocked(skin: SkinType): boolean {

       if (skin === "red"){
        return true;
       }

       return (
              localStorage.getItem("skin_" + skin)
              === "unlocked"
       );
    }

   export function saveSelectedSkin(
    skin: SkinType
): void {

    localStorage.setItem(
        "selectedSkin",
        skin
    );

}
export function getSelectedSkin(): SkinType {

    const saved =
        localStorage.getItem("selectedSkin");

    if (
        saved === "red" ||
        saved === "blue" ||
        saved === "gold" ||
        saved === "diamond"
    ) {
        return saved;
    }

    return "red";

}