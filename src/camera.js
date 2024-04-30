const Vector3 = require("./vector3");
const Ray = require("./ray");

class Camera {
    constructor(lookFrom, lookAt, fov, width, height) {
        const aspectRatio = width / height;
        const viewportHeight = Math.tan(fov / 360 * Math.PI) * 2;
        const viewportWidth = viewportHeight * aspectRatio;

        const forward = lookAt.sub(lookFrom).normalized();
        const right = new Vector3(0, 1, 0).cross(forward).normalized();
        const up = forward.cross(right).normalized();

        const horizontalDirection = right.mulScalar(viewportWidth);
        const verticalDirection = up.mulScalar(viewportHeight);

        const upperLeftCorner = lookFrom
            .sub(horizontalDirection.mulScalar(0.5))
            .add(verticalDirection.mulScalar(0.5))
            .add(forward);

        this.lookFrom = lookFrom;
        this.upperLeftCorner = upperLeftCorner;
        this.horizontalDirection = horizontalDirection;
        this.verticalDirection = verticalDirection;
    }

    getCameraRay(u, v) {
        const target = this.upperLeftCorner
            .add(this.horizontalDirection.mulScalar(u))
            .sub(this.verticalDirection.mulScalar(v));

        return new Ray(this.lookFrom, target.sub(this.lookFrom).normalized());
    }
}

module.exports = Camera;