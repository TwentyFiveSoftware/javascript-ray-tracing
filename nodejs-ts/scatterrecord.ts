import { Vector3 } from "./vector3";
import { Ray } from "./ray";

export class ScatterRecord {
    public readonly attenuation: Vector3;
    public readonly scatteredRay: Ray;

    constructor(attenuation: Vector3, scatteredRay: Ray) {
        this.attenuation = attenuation;
        this.scatteredRay = scatteredRay;
    }
}
