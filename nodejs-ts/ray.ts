import { Vector3 } from "./vector3";

export class Ray {
    public readonly origin: Vector3;
    public readonly direction: Vector3;

    constructor(origin: Vector3, direction: Vector3) {
        this.origin = origin;
        this.direction = direction;
    }

    public at(t: number): Vector3 {
        return this.origin.add(this.direction.mulScalar(t));
    }
}
