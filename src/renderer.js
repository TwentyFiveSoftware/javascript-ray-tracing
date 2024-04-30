const Vector3 = require("./vector3");

class Renderer {
    constructor(camera) {
        this.camera = camera;
    }

    render(width, height, samplesPerPixel) {
        const pixels = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let pixelColorSum = Vector3.zero();

                for (let sample = 0; sample < samplesPerPixel; sample++) {
                    const u = (x + Math.random()) / (width - 1);
                    const v = (y + Math.random()) / (height - 1);

                    const ray = this.camera.getCameraRay(u, v);
                    pixelColorSum = pixelColorSum.add(this._calculateRayColor(ray));
                }

                pixels[y * width + x] = pixelColorSum.mul(1 / samplesPerPixel);
            }
        }

        return pixels;
    }

    _calculateRayColor(ray) {
        return new Vector3(1, 0, 0);
    }
}

module.exports = Renderer;