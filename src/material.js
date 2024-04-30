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

class MetalMaterial extends Material {
    constructor(texture) {
        super();

        this.texture = texture;
    }

    scatter(ray, hitRecord) {
        const scatterDirection = ray.direction.reflect(hitRecord.normal);

        if (scatterDirection.dot(hitRecord.normal) <= 0) {
            return null;
        }

        return new ScatterRecord(this.texture.getColorAt(hitRecord.point), new Ray(hitRecord.point, scatterDirection));
    }
}

class DielectricMaterial extends Material {
    constructor(refractionIndex) {
        super();

        this.refractionIndex = refractionIndex;
    }

    scatter(ray, hitRecord) {
        const refractionRatio = hitRecord.isFrontFacing ? (1 / this.refractionIndex) : this.refractionIndex;
        const scatterDirection = ray.direction.refract(hitRecord.normal, refractionRatio);

        return new ScatterRecord(new Vector3(1, 1, 1), new Ray(hitRecord.point, scatterDirection));
    }
}

module.exports = {Material, DiffuseMaterial, MetalMaterial, DielectricMaterial};