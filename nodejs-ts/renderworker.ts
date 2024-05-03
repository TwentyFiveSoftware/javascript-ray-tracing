import { parentPort, workerData } from "node:worker_threads";
import { RenderWorkerData } from "./interfaces";
import { Camera } from "./camera";
import { Scene } from "./scene";
import { Settings } from "./settings";
import { Renderer } from "./renderer";

const { messageChannel, rawCamera, rawScene, rawSettings }: RenderWorkerData = workerData;

const camera = Camera.deserialize(rawCamera);
const scene = Scene.deserialize(rawScene);
const settings = Settings.deserialize(rawSettings);

messageChannel.on("message", y => {
    const pixels = Renderer.renderRow(scene, camera, settings, y);
    parentPort?.postMessage({ y, pixels: pixels.map(pixel => pixel.serialize()) });

    messageChannel.postMessage({});
});

messageChannel.postMessage({});
