const Camera = require("./camera");
const Renderer = require("./renderer");
const ImageUtil = require("./imageutil");
const Vector3 = require("./vector3");
const Scene = require("./scene");

const WIDTH = 800;
const HEIGHT = 450;
const SAMPLES_PER_PIXEL = 5;
const MAX_RAY_TRACE_DEPTH = 50;

const camera = new Camera(new Vector3(12, 2, -3), Vector3.zero(), 25, WIDTH, HEIGHT);
const scene = Scene.generateRandomScene();
const renderer = new Renderer(camera, scene);

const pixels = renderer.render(WIDTH, HEIGHT, SAMPLES_PER_PIXEL, MAX_RAY_TRACE_DEPTH);
ImageUtil.savePixelsAsPng("render.png", pixels, WIDTH, HEIGHT);
