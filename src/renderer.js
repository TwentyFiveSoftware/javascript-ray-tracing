const Vector3 = require("./vector3");

class Renderer {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
    }

    render(width, height, samplesPerPixel, maxRayTraceDepth) {
        const pixels = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let pixelColorSum = Vector3.zero();

                for (let sample = 0; sample < samplesPerPixel; sample++) {
                    const u = (x + Math.random()) / (width - 1);
                    const v = (y + Math.random()) / (height - 1);

                    const ray = this.camera.getCameraRay(u, v);
                    pixelColorSum = pixelColorSum.add(this._calculateRayColor(ray, maxRayTraceDepth));
                }

                pixels[y * width + x] = pixelColorSum.mulScalar(1 / samplesPerPixel);
            }
        }

        return pixels;
    }

    _calculateRayColor(ray, remainingDepth) {
        if (remainingDepth <= 0) {
            return Vector3.zero();
        }

        const hitRecord = this.scene.rayHitsScene(ray);
        if (hitRecord === null) {
            const t = 0.5 * (ray.direction.y + 1);
            return new Vector3(1, 1, 1).mulScalar(1 - t).add(new Vector3(0.5, 0.7, 1).mulScalar(t));
        }

        const scatterRecord = hitRecord.material.scatter(ray, hitRecord);
        if (scatterRecord === null) {
            return Vector3.zero();
        }

        return scatterRecord.attenuation.mul(this._calculateRayColor(scatterRecord.scatteredRay, remainingDepth - 1));
    }
}

module.exports = Renderer;