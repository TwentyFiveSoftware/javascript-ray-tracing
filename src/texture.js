const Vector3 = require("./vector3");

class Texture {
    getColorAt(point) {
        return Vector3.zero();
    }

    serialize() {
        return JSON.stringify({});
    }

    static deserialize(raw) {
        const { textureType } = JSON.parse(raw);
        switch (textureType) {
            case SolidTexture.TEXTURE_TYPE:
                return SolidTexture.deserialize(raw);
            case CheckeredTexture.TEXTURE_TYPE:
                return CheckeredTexture.deserialize(raw);
            default:
                return null;
        }
    }
}

class SolidTexture extends Texture {
    static TEXTURE_TYPE = "SOLID";

    constructor(albedo) {
        super();

        this.albedo = albedo;
    }

    getColorAt(point) {
        return this.albedo;
    }

    serialize() {
        return JSON.stringify({
            textureType: SolidTexture.TEXTURE_TYPE,
            albedo: this.albedo.serialize(),
        });
    }

    static deserialize(raw) {
        const { albedo } = JSON.parse(raw);
        return new SolidTexture(Vector3.deserialize(albedo));
    }
}

class CheckeredTexture extends Texture {
    static TEXTURE_TYPE = "CHECKERED";

    constructor(albedo1, albedo2) {
        super();

        this.albedo1 = albedo1;
        this.albedo2 = albedo2;
    }

    getColorAt(point) {
        const size = 6;
        const sines = Math.sin(size * point.x) * Math.sin(size * point.y) * Math.sin(size * point.z);
        return sines < 0 ? this.albedo1 : this.albedo2;
    }

    serialize() {
        return JSON.stringify({
            textureType: CheckeredTexture.TEXTURE_TYPE,
            albedo1: this.albedo1.serialize(),
            albedo2: this.albedo2.serialize(),
        });
    }

    static deserialize(raw) {
        const { albedo1, albedo2 } = JSON.parse(raw);
        return new CheckeredTexture(Vector3.deserialize(albedo1), Vector3.deserialize(albedo2));
    }
}

module.exports = { Texture, SolidTexture, CheckeredTexture };
