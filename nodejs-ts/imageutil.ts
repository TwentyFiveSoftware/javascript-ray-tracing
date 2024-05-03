import Jimp from "jimp";
import { Vector3 } from "./vector3";
import { Settings } from "./settings";

export class ImageUtil {
    public static savePixelsAsPng(path: string, pixels: Vector3[], settings: Settings): void {
        if (pixels.length !== settings.width * settings.height) {
            throw new Error("pixel array has invalid length");
        }

        const image = new Jimp(settings.width, settings.height);

        for (let y = 0; y < settings.height; y++) {
            for (let x = 0; x < settings.width; x++) {
                const color: Vector3 = pixels[y * settings.width + x].sqrt().mulScalar(0xff);

                const hex: Uint32Array = new Uint32Array(1);
                hex[0] = (color.x << 24) | (color.y << 16) | (color.z << 8) | 0xff;

                image.setPixelColor(hex[0], x, y);
            }
        }

        image.write(path);
    }
}
