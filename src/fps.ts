export class FPSCounter {
    private frameCount = 0;
    private lastTime = performance.now();
    private fps = 60;
    private lastUpdate = performance.now();

    update(): void {
        this.frameCount++;
        const now = performance.now();

        if (now - this.lastUpdate >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / (now - this.lastUpdate));
            this.frameCount = 0;
            this.lastUpdate = now;
        }
    }

    getValue(): number {
        return this.fps;
    }
}
