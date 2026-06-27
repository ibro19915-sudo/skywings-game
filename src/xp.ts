import { Statistics } from "./statistics";

export function xpNeeded(level: number): number {
    if (level === 1) {
        return 100;
    }

    if (level === 2) {
        return 150;
    }

    return 200;
}

export function addXP(
    stats: Statistics,
    amount: number
): boolean {

    let leveledUp = false;

    stats.xp += amount;

    while (stats.xp >= xpNeeded(stats.level)) {

        stats.xp -= xpNeeded(stats.level);

        stats.level++;

        stats.coins += 1000;

        leveledUp = true;
    }

    return leveledUp;
}