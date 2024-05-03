import * as path from "path";
import { Worker, MessageChannel, MessagePort } from "node:worker_threads";
import { Camera } from "./camera";
import { Scene } from "./scene";
import { Settings } from "./settings";
import { Vector3 } from "./vector3";
import { PixelRow, RenderWorkerData, RenderWorkerResult } from "./interfaces";
import { Ray } from "./ray";
import { HitRecord } from "./hitrecord";
import { ScatterRecord } from "./scatterrecord";

export class Renderer {
    public static async render(camera: Camera, scene: Scene, settings: Settings): Promise<Vector3[]> {
        const renderWorkers: Promise<RenderWorkerResult>[] = [];
        const workerChannels: MessagePort[] = [];

        for (let i = 0; i < settings.renderWorkers; i++) {
            const { port1: mainThreadPort, port2: workerPort } = new MessageChannel();

            workerChannels.push(mainThreadPort);
            renderWorkers.push(Renderer.runRenderWorker(workerPort, camera, scene, settings));
        }

        let nextRowIndex: number = 0;

        for (const workerChannel of workerChannels) {
            workerChannel.on("message", () => {
                if (nextRowIndex >= settings.height) {
                    workerChannel.close();
                    return;
                }

                const y: number = nextRowIndex++;

                console.log(`${y + 1} / ${settings.height} (${(((y + 1) / settings.height) * 100).toFixed(2)}%)`);

                workerChannel.postMessage(y);
            });
        }

        const pixelRowsPerWorker: PixelRow[][] = await Promise.all(renderWorkers);

        const pixels: Vector3[][] = [];
        for (const pixelRows of pixelRowsPerWorker) {
            for (const pixelRow of pixelRows) {
                pixels[pixelRow.y] = pixelRow.pixels.map(rawPixel => Vector3.deserialize(rawPixel));
            }
        }

        return pixels.flat();
    }

    private static async runRenderWorker(
        workerPort: MessagePort,
        camera: Camera,
        scene: Scene,
        settings: Settings,
    ): Promise<RenderWorkerResult> {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            const worker: Worker = new Worker(path.join(__dirname, "./renderworker.ts"), {
                workerData: {
                    messageChannel: workerPort,
                    rawCamera: camera.serialize(),
                    rawScene: scene.serialize(),
                    rawSettings: settings.serialize(),
                } as RenderWorkerData,
                transferList: [workerPort],
            });

            const pixelRows: PixelRow[] = [];

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

    public static renderRow(scene: Scene, camera: Camera, settings: Settings, y: number): Vector3[] {
        const pixelsInRow: Vector3[] = [];

        for (let x = 0; x < settings.width; x++) {
            let pixelColorSum: Vector3 = Vector3.zero();

            for (let sample = 0; sample < settings.samplesPerPixel; sample++) {
                const u: number = (x + Math.random()) / (settings.width - 1);
                const v: number = (y + Math.random()) / (settings.height - 1);

                const ray: Ray = camera.getCameraRay(u, v);
                pixelColorSum = pixelColorSum.add(Renderer.calculateRayColor(scene, ray, settings.maxRayTraceDepth));
            }

            pixelsInRow[x] = pixelColorSum.mulScalar(1 / settings.samplesPerPixel);
        }

        return pixelsInRow;
    }

    private static calculateRayColor(scene: Scene, ray: Ray, remainingDepth: number): Vector3 {
        if (remainingDepth <= 0) {
            return Vector3.zero();
        }

        const hitRecord: HitRecord | null = scene.rayHitsScene(ray);
        if (hitRecord === null) {
            const t: number = 0.5 * (ray.direction.y + 1);
            return new Vector3(1, 1, 1).mulScalar(1 - t).add(new Vector3(0.5, 0.7, 1).mulScalar(t));
        }

        const scatterRecord: ScatterRecord | null = hitRecord.material.scatter(ray, hitRecord);
        if (scatterRecord === null) {
            return Vector3.zero();
        }

        return scatterRecord.attenuation.mul(
            this.calculateRayColor(scene, scatterRecord.scatteredRay, remainingDepth - 1),
        );
    }
}
