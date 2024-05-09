import * as os from "os";
import { Settings } from "./settings";
import { Vector3 } from "./vector3";
import { Camera } from "./camera";
import { Scene } from "./scene";
import { Renderer } from "./renderer";
import { ImageUtil } from "./imageutil";

const renderWorkerPath: string = process.argv.length > 2 ? process.argv[2] : "./nodejs-ts/renderworker.ts";

const settings: Settings = new Settings(1920, 1080, 1, 50, os.cpus().length, renderWorkerPath);

const main = async (): Promise<void> => {
    const camera: Camera = Camera.fromFov(new Vector3(12, 2, -3), Vector3.zero(), 25, settings);
    const scene: Scene = Scene.generateRandomScene();

    const renderStartTime: number = Date.now();
    const pixels: Vector3[] = await Renderer.render(camera, scene, settings);
    const renderFinishTime: number = Date.now();

    console.log(`rendered ${settings.samplesPerPixel} samples/pixel in ${renderFinishTime - renderStartTime} ms`);
    ImageUtil.savePixelsAsPng("render.png", pixels, settings);
};

main().catch(err => console.error(err));
