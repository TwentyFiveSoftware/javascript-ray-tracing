const Vector3 = require("./vector3");
const Sphere = require("./sphere");
const {DiffuseMaterial} = require("./material");

class Scene {
    constructor(spheres) {
        this.spheres = spheres;
    }

    static generateRandomScene() {
        const spheres = [];

        spheres.push(new Sphere(Vector3.zero(), 1, new DiffuseMaterial()));

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
}

module.exports = Scene;