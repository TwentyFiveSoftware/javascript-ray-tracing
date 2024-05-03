import { Serializable } from "./interfaces";
import { Vector3 } from "./vector3";
import { Settings } from "./settings";
import { Ray } from "./ray";

export class Camera implements Serializable {
    private readonly lookFrom: Vector3;
    private readonly upperLeftCorner: Vector3;
    private readonly horizontalDirection: Vector3;
    private readonly verticalDirection: Vector3;

    constructor(lookFrom: Vector3, upperLeftCorner: Vector3, horizontalDirection: Vector3, verticalDirection: Vector3) {
        this.lookFrom = lookFrom;
        this.upperLeftCorner = upperLeftCorner;
        this.horizontalDirection = horizontalDirection;
        this.verticalDirection = verticalDirection;
    }

    public static fromFov(lookFrom: Vector3, lookAt: Vector3, fov: number, settings: Settings): Camera {
        const aspectRatio: number = settings.width / settings.height;
        const viewportHeight: number = Math.tan((fov / 360) * Math.PI) * 2;
        const viewportWidth: number = viewportHeight * aspectRatio;

        const forward: Vector3 = lookAt.sub(lookFrom).normalized();
        const right: Vector3 = new Vector3(0, 1, 0).cross(forward).normalized();
        const up: Vector3 = forward.cross(right).normalized();

        const horizontalDirection: Vector3 = right.mulScalar(viewportWidth);
        const verticalDirection: Vector3 = up.mulScalar(viewportHeight);

        const upperLeftCorner: Vector3 = lookFrom
            .sub(horizontalDirection.mulScalar(0.5))
            .add(verticalDirection.mulScalar(0.5))
            .add(forward);

        return new Camera(lookFrom, upperLeftCorner, horizontalDirection, verticalDirection);
    }

    public getCameraRay(u: number, v: number): Ray {
        const target: Vector3 = this.upperLeftCorner
            .add(this.horizontalDirection.mulScalar(u))
            .sub(this.verticalDirection.mulScalar(v));

        return new Ray(this.lookFrom, target.sub(this.lookFrom).normalized());
    }

    public serialize(): string {
        return JSON.stringify({
            lookFrom: this.lookFrom.serialize(),
            upperLeftCorner: this.upperLeftCorner.serialize(),
            horizontalDirection: this.horizontalDirection.serialize(),
            verticalDirection: this.verticalDirection.serialize(),
        } as SerializedCamera);
    }

    public static deserialize(raw: string): Camera {
        const { lookFrom, upperLeftCorner, horizontalDirection, verticalDirection }: SerializedCamera = JSON.parse(raw);
        return new Camera(
            Vector3.deserialize(lookFrom),
            Vector3.deserialize(upperLeftCorner),
            Vector3.deserialize(horizontalDirection),
            Vector3.deserialize(verticalDirection),
        );
    }
}

interface SerializedCamera {
    lookFrom: string;
    upperLeftCorner: string;
    horizontalDirection: string;
    verticalDirection: string;
}
