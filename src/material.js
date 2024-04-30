const ScatterRecord = require("./scatterrecord");
const Vector3 = require("./vector3");
const Ray = require("./ray");

class Material {
    scatter(ray, hitRecord) {
        return null;
    };
}

class DiffuseMaterial extends Material {
    constructor(texture) {
        super();

        this.texture = texture;
    }

    scatter(ray, hitRecord) {
        let scatterDirection = hitRecord.normal.add(Vector3.randomUnitVector()).normalized();
        if (scatterDirection.isNearZero()) {
            scatterDirection = hitRecord.normal;
        }

        return new ScatterRecord(this.texture.getColorAt(hitRecord.point), new Ray(hitRecord.point, scatterDirection));
    }
}

module.exports = {Material, DiffuseMaterial};