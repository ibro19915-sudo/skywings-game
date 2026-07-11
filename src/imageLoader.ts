const imageCache = new Map<string, HTMLImageElement>();

export function loadImage(path: string): HTMLImageElement {
    let img = imageCache.get(path);

    if (!img) {
        img = new Image();
        img.src = path;
        imageCache.set(path, img);
    }

    return img;
}