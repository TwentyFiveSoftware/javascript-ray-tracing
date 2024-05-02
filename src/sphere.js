const HitRecord = require("./hitrecord");
const { Material } = require("./material");
const Vector3 = require("./vector3");

class Sphere {
    constructor(center, radius, material) {
        this.center = center;
        this.radius = radius;
        this.material = material;
    }

    rayHitsSphere(ray, tMin, tMax) {
        const oc = ray.origin.sub(this.center);
        const a = ray.direction.lengthSquared();
        const halfB = oc.dot(ray.direction);
        const c = oc.lengthSquared() - this.radius * this.radius;
        const discriminant = halfB * halfB - a * c;

        if (discriminant < 0) {
            return null;
        }

        const sqrtD = Math.sqrt(discriminant);

        let t = (-halfB - sqrtD) / a;
        if (t < tMin || t > tMax) {
            t = (-halfB + sqrtD) / a;

            if (t < tMin || t > tMax) {
                return null;
            }
        }

        const point = ray.at(t);
        const normal = point.sub(this.center).mulScalar(1 / this.radius);
        const isFrontFacing = ray.direction.dot(normal) < 0;

        return new HitRecord(t, point, normal, isFrontFacing, this.material);
    }

    serialize() {
        return JSON.stringify({
            center: this.center.serialize(),
            radius: this.radius,
            material: this.material.serialize(),
        });
    }

    static deserialize(raw) {
        const { center, radius, material } = JSON.parse(raw);
        return new Sphere(Vector3.deserialize(center), radius, Material.deserialize(material));
    }
}

module.exports = Sphere;
