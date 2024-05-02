const { Worker, MessageChannel } = require("node:worker_threads");
const path = require("node:path");
const Vector3 = require("./vector3");

class Renderer {
    static async render(camera, scene, settings) {
        const renderWorkers = [];
        const workerChannels = [];

        for (let i = 0; i < settings.renderWorkers; i++) {
            const { port1: mainThreadPort, port2: workerPort } = new MessageChannel();

            workerChannels.push(mainThreadPort);
            renderWorkers.push(Renderer.runRenderWorker(workerPort, camera, scene, settings));
        }

        let nextRowIndex = 0;

        for (const workerChannel of workerChannels) {
            workerChannel.on("message", () => {
                if (nextRowIndex >= settings.height) {
                    workerChannel.close();
                    return;
                }

                const y = nextRowIndex++;

                console.log(`${y + 1} / ${settings.height} (${(((y + 1) / settings.height) * 100).toFixed(2)}%)`);

                workerChannel.postMessage(y);
            });
        }

        const pixelRowsPerWorker = await Promise.all(renderWorkers);

        const pixels = [];
        for (const pixelRows of pixelRowsPerWorker) {
            for (const pixelRow of pixelRows) {
                pixels[pixelRow.y] = pixelRow.pixels.map(rawPixel => Vector3.deserialize(rawPixel));
            }
        }

        return pixels.flat();
    }

    static async runRenderWorker(workerPort, camera, scene, settings) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(path.join(__dirname, "renderworker.js"), {
                workerData: {
                    messageChannel: workerPort,
                    rawCamera: camera.serialize(),
                    rawScene: scene.serialize(),
                    rawSettings: settings.serialize(),
                },
                transferList: [workerPort],
            });

            const pixelRows = [];

            worker.on("message", pixelRow => {
                pixelRows.push(pixelRow);
            });

            worker.on("error", reject);
            worker.on("exit", code => {
                if (code !== 0) {
                    reject(new Error(`Render worker stopped with exit code ${code}`));
                    return;
                }

                resolve(pixelRows);
            });
        });
    }

    static renderRow(scene, camera, settings, y) {
        const pixelsInRow = [];

        for (let x = 0; x < settings.width; x++) {
            let pixelColorSum = Vector3.zero();

            for (let sample = 0; sample < settings.samplesPerPixel; sample++) {
                const u = (x + Math.random()) / (settings.width - 1);
                const v = (y + Math.random()) / (settings.height - 1);

                const ray = camera.getCameraRay(u, v);
                pixelColorSum = pixelColorSum.add(Renderer._calculateRayColor(scene, ray, settings.maxRayTraceDepth));
            }

            pixelsInRow[x] = pixelColorSum.mulScalar(1 / settings.samplesPerPixel);
        }

        return pixelsInRow;
    }

    static _calculateRayColor(scene, ray, remainingDepth) {
        if (remainingDepth <= 0) {
            return Vector3.zero();
        }

        const hitRecord = scene.rayHitsScene(ray);
        if (hitRecord === null) {
            const t = 0.5 * (ray.direction.y + 1);
            return new Vector3(1, 1, 1).mulScalar(1 - t).add(new Vector3(0.5, 0.7, 1).mulScalar(t));
        }

        const scatterRecord = hitRecord.material.scatter(ray, hitRecord);
        if (scatterRecord === null) {
            return Vector3.zero();
        }

        return scatterRecord.attenuation.mul(
            this._calculateRayColor(scene, scatterRecord.scatteredRay, remainingDepth - 1),
        );
    }
}

module.exports = Renderer;
