const ScatterRecord = require("./scatterrecord");
const Vector3 = require("./vector3");
const Ray = require("./ray");

class Material {
    scatter(ray, hitRecord) {
        return null;
    };
}

class DiffuseMaterial extends Material {
    scatter(ray, hitRecord) {
        return new ScatterRecord(new Vector3(0.9, 0.9, 0.9), new Ray(hitRecord.point, hitRecord.normal));
    }
}

module.exports = {Material, DiffuseMaterial};