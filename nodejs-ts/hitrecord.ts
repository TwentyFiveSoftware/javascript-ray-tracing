import { Vector3 } from "./vector3";
import { Material } from "./material";

export class HitRecord {
    public readonly t: number;
    public readonly point: Vector3;
    public readonly normal: Vector3;
    public readonly isFrontFacing: boolean;
    public readonly material: Material;

    constructor(t: number, point: Vector3, normal: Vector3, isFrontFacing: boolean, material: Material) {
        this.t = t;
        this.point = point;
        this.normal = normal;
        this.isFrontFacing = isFrontFacing;
        this.material = material;
    }
}
