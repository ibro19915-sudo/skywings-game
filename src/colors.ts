export function getSkyColor(score: number): string {
    if (score >= 30) return "#FFA500";
    if (score >= 20) return "#191970";
    if (score >= 10) return "#FF7F50";
    return "#87CEEB";
}