const ScatterRecord = require("./scatterrecord");
const Vector3 = require("./vector3");
const Ray = require("./ray");
const {Texture} = require("./texture");

class Material {
    scatter(ray, hitRecord) {
        return null;
    };

    serialize() {
        return JSON.stringify({});
    }

    static deserialize(raw) {
        const {materialType} = JSON.parse(raw);
        switch (materialType) {
            case DiffuseMaterial.MATERIAL_TYPE:
                return DiffuseMaterial.deserialize(raw);
            case MetalMaterial.MATERIAL_TYPE:
                return MetalMaterial.deserialize(raw);
            case DielectricMaterial.MATERIAL_TYPE:
                return DielectricMaterial.deserialize(raw);
            default:
                return null;
        }
    }
}

class DiffuseMaterial extends Material {
    static MATERIAL_TYPE = "DIFFUSE";

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

    serialize() {
        return JSON.stringify({
            materialType: DiffuseMaterial.MATERIAL_TYPE,
            texture: this.texture.serialize(),
        });
    }

    static deserialize(raw) {
        const {texture} = JSON.parse(raw);
        return new DiffuseMaterial(Texture.deserialize(texture));
    }
}

class MetalMaterial extends Material {
    static MATERIAL_TYPE = "METAL";

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

    serialize() {
        return JSON.stringify({
            materialType: MetalMaterial.MATERIAL_TYPE,
            texture: this.texture.serialize(),
        });
    }

    static deserialize(raw) {
        const {texture} = JSON.parse(raw);
        return new MetalMaterial(Texture.deserialize(texture));
    }
}

class DielectricMaterial extends Material {
    static MATERIAL_TYPE = "DIELECTRIC";

    constructor(refractionIndex) {
        super();

        this.refractionIndex = refractionIndex;
    }

    scatter(ray, hitRecord) {
        const refractionRatio = hitRecord.isFrontFacing ? (1 / this.refractionIndex) : this.refractionIndex;
        const scatterDirection = ray.direction.refract(hitRecord.normal, refractionRatio);

        return new ScatterRecord(new Vector3(1, 1, 1), new Ray(hitRecord.point, scatterDirection));
    }

    serialize() {
        return JSON.stringify({
            materialType: DielectricMaterial.MATERIAL_TYPE,
            refractionIndex: this.refractionIndex,
        });
    }

    static deserialize(raw) {
        const {refractionIndex} = JSON.parse(raw);
        return new DielectricMaterial(refractionIndex);
    }
}

module.exports = {Material, DiffuseMaterial, MetalMaterial, DielectricMaterial};