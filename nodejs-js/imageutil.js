const Jimp = require("jimp");

class ImageUtil {
    static savePixelsAsPng(path, pixels, width, height) {
        if (pixels.length !== width * height) {
            throw new Error("pixel array has invalid length");
        }

        const image = new Jimp(width, height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const color = pixels[y * width + x].sqrt().mulScalar(0xff);

                const hex = new Uint32Array(1);
                hex[0] = (color.x << 24) | (color.y << 16) | (color.z << 8) | 0xff;

                image.setPixelColor(hex[0], x, y);
            }
        }

        image.write(path);
    }
}

module.exports = ImageUtil;
