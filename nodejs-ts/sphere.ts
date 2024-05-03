import { Vector3 } from "./vector3";
import { Material } from "./material";
import { Ray } from "./ray";
import { HitRecord } from "./hitrecord";
import { Serializable } from "./interfaces";

export class Sphere implements Serializable {
    private readonly center: Vector3;
    private readonly radius: number;
    private readonly material: Material;

    constructor(center: Vector3, radius: number, material: Material) {
        this.center = center;
        this.radius = radius;
        this.material = material;
    }

    public rayHitsSphere(ray: Ray, tMin: number, tMax: number): HitRecord | null {
        const oc: Vector3 = ray.origin.sub(this.center);
        const a: number = ray.direction.lengthSquared();
        const halfB: number = oc.dot(ray.direction);
        const c: number = oc.lengthSquared() - this.radius * this.radius;
        const discriminant: number = halfB * halfB - a * c;

        if (discriminant < 0) {
            return null;
        }

        const sqrtD: number = Math.sqrt(discriminant);

        let t: number = (-halfB - sqrtD) / a;
        if (t < tMin || t > tMax) {
            t = (-halfB + sqrtD) / a;

            if (t < tMin || t > tMax) {
                return null;
            }
        }

        const point: Vector3 = ray.at(t);
        const normal: Vector3 = point.sub(this.center).mulScalar(1 / this.radius);
        const isFrontFacing: boolean = ray.direction.dot(normal) < 0;

        return new HitRecord(t, point, normal, isFrontFacing, this.material);
    }

    public serialize(): string {
        return JSON.stringify({
            center: this.center.serialize(),
            radius: this.radius,
            material: this.material.serialize(),
        } as SerializedSphere);
    }

    public static deserialize(raw: string): Sphere {
        const { center, radius, material }: SerializedSphere = JSON.parse(raw);
        return new Sphere(Vector3.deserialize(center), radius, Material.deserialize(material)!);
    }
}

interface SerializedSphere {
    center: string;
    radius: number;
    material: string;
}
