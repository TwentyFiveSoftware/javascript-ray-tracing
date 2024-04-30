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

module.exports = {Texture, SolidTexture};