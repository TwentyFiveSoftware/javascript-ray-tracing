const Vector3 = require("./vector3");
const Sphere = require("./sphere");
const {DiffuseMaterial, MetalMaterial, DielectricMaterial} = require("./material");
const {SolidTexture, CheckeredTexture} = require("./texture");
const ColorUtil = require("./colorutil");

class Scene {
    constructor(spheres) {
        this.spheres = spheres;
    }

    static generateRandomScene() {
        const spheres = [];

        for (let x = -11; x < 11; x++) {
            for (let z = -11; z < 11; z++) {
                let material;

                let materialRandom = Math.random();
                if (materialRandom < 0.8) {
                    material = new DiffuseMaterial(new SolidTexture(ColorUtil.getRandomColor()));
                } else if (materialRandom < 0.95) {
                    material = new MetalMaterial(new SolidTexture(ColorUtil.getRandomColor()));
                } else {
                    material = new DielectricMaterial(1.5);
                }

                const center = new Vector3(x + Math.random() * 0.9, 0.2, z + Math.random() * 0.9);

                spheres.push(new Sphere(center, 0.2, material));
            }
        }

        // GROUND
        spheres.push(new Sphere(
            new Vector3(0, -1000, 0),
            1000,
            new DiffuseMaterial(new CheckeredTexture(new Vector3(0.05, 0.05, 0.05), new Vector3(0.95, 0.95, 0.95))))
        );

        // LEFT
        spheres.push(new Sphere(
            new Vector3(-4, 1, 0), 1, new DiffuseMaterial(new SolidTexture(new Vector3(0.6, 0.3, 0.1)))
        ));

        // CENTER
        spheres.push(new Sphere(new Vector3(0, 1, 0), 1, new DielectricMaterial(1.5)));

        // RIGHT
        spheres.push(new Sphere(
            new Vector3(4, 1, 0), 1, new MetalMaterial(new SolidTexture(new Vector3(0.7, 0.6, 0.5)))
        ));

        return new Scene(spheres);
    }

    rayHitsScene(ray) {
        let currentHitRecord = null;
        let maxT = Infinity;

        for (const sphere of this.spheres) {
            const hitRecord = sphere.rayHitsSphere(ray, 0.001, maxT);
            if (hitRecord !== null) {
                currentHitRecord = hitRecord;
                maxT = hitRecord.t;
            }
        }

        return currentHitRecord;
    }

    serialize() {
        return JSON.stringify({
            spheres: this.spheres.map(sphere => sphere.serialize()),
        });
    }

    static deserialize(raw) {
        const {spheres} = JSON.parse(raw);
        return new Scene(spheres.map(rawSphere => Sphere.deserialize(rawSphere)));
    }
}

module.exports = Scene;