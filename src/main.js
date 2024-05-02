const Camera = require("./camera");
const Renderer = require("./renderer");
const ImageUtil = require("./imageutil");
const Vector3 = require("./vector3");
const Scene = require("./scene");
const Settings = require("./settings");

const settings = new Settings(1920, 1080, 1, 50, 8);

const main = async () => {
    const camera = Camera.fromFov(new Vector3(12, 2, -3), Vector3.zero(), 25, settings.width, settings.height);
    const scene = Scene.generateRandomScene();

    const renderStartTime = Date.now();
    const pixels = await Renderer.render(camera, scene, settings);
    const renderFinishTime = Date.now();

    console.log(`rendered ${settings.samplesPerPixel} samples/pixel in ${renderFinishTime - renderStartTime} ms`);
    ImageUtil.savePixelsAsPng("render.png", pixels, settings.width, settings.height);
};

main().catch(err => console.error(err));
