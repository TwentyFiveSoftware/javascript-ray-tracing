const Vector3 = require("./vector3");

class Texture {
    getColorAt(point) {
        return Vector3.zero();
    }
}

class SolidTexture extends Texture {
    constructor(albedo) {
        super();

        this.albedo = albedo;
    }

    getColorAt(point) {
        return this.albedo;
    }
}

class CheckeredTexture extends Texture {
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
}

module.exports = {Texture, SolidTexture, CheckeredTexture};