export interface Statistics {
    gamesPlayed: number;
    totalPipes: number;
    totalCrashes: number;
    totalScore: number;
    playTime: number;
    level: number;
    xp: number;
    coins: number;
}

const KEY = "skywings_statistics";

export function loadStatistics(): Statistics {

    const data = localStorage.getItem(KEY);

    if (data) {
        const stats = JSON.parse(data);

return {
    gamesPlayed: stats.gamesPlayed ?? 0,
    totalPipes: stats.totalPipes ?? 0,
    totalCrashes: stats.totalCrashes ?? 0,
    totalScore: stats.totalScore ?? 0,
    playTime: stats.playTime ?? 0,

    xp: stats.xp ?? 0,
    level: stats.level ?? 1,
    coins: stats.coins ?? 0
};
    }

    return {
        gamesPlayed: 0,
        totalPipes: 0,
        totalCrashes: 0,
        totalScore: 0,
        playTime: 0,
        level: 1,
        xp: 0,
        coins: 0
    };
}

export function saveStatistics(stats: Statistics): void {
    localStorage.setItem(KEY, JSON.stringify(stats));
}

export function averageScore(stats: Statistics): number {

    if (stats.gamesPlayed === 0) {
        return 0;
    }

    return stats.totalScore / stats.gamesPlayed;
}

export function formattedPlayTime(stats: Statistics): string {

    const totalSeconds = Math.floor(stats.playTime);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
}