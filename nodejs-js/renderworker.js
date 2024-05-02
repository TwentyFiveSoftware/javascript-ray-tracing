const { parentPort, workerData } = require("node:worker_threads");
const Renderer = require("./renderer");
const Camera = require("./camera");
const Settings = require("./settings");
const Scene = require("./scene");

const { messageChannel, rawCamera, rawScene, rawSettings } = workerData;

const camera = Camera.deserialize(rawCamera);
const scene = Scene.deserialize(rawScene);
const settings = Settings.deserialize(rawSettings);

messageChannel.on("message", y => {
    const pixels = Renderer.renderRow(scene, camera, settings, y);
    parentPort.postMessage({ y, pixels: pixels.map(pixel => pixel.serialize()) });

    messageChannel.postMessage({});
});

messageChannel.postMessage({});
