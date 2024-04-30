const Camera = require("./camera");
const Renderer = require("./renderer");
const ImageUtil = require("./imageutil");
const Vector3 = require("./vector3");

const WIDTH = 800;
const HEIGHT = 450;
const SAMPLES_PER_PIXEL = 10;

const camera = new Camera(new Vector3(12, 2, -3), new Vector3(), 25, WIDTH, HEIGHT);
const renderer = new Renderer(camera);

const pixels = renderer.render(WIDTH, HEIGHT, SAMPLES_PER_PIXEL);
ImageUtil.savePixelsAsPng("render.png", pixels, WIDTH, HEIGHT);
