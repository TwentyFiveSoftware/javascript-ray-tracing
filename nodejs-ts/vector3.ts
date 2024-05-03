import { Serializable } from "./interfaces";

export class Vector3 implements Serializable {
    public readonly x: number;
    public readonly y: number;
    public readonly z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    public add(other: Vector3): Vector3 {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    public sub(other: Vector3): Vector3 {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    public neg(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    public mulScalar(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    public mul(other: Vector3): Vector3 {
        return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
    }

    public cross(other: Vector3): Vector3 {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x,
        );
    }

    public dot(other: Vector3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    public sqrt(): Vector3 {
        return new Vector3(Math.sqrt(this.x), Math.sqrt(this.y), Math.sqrt(this.z));
    }

    public lengthSquared(): number {
        return this.dot(this);
    }

    public length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    public normalized(): Vector3 {
        const length: number = this.length();
        if (length === 0) {
            return this;
        }

        return this.mulScalar(1 / length);
    }

    public isNearZero(): boolean {
        const epsilon: number = 1e-8;
        return Math.abs(this.x) < epsilon && Math.abs(this.y) < epsilon && Math.abs(this.z) < epsilon;
    }

    public reflect(normal: Vector3): Vector3 {
        return this.sub(normal.mulScalar(2 * this.dot(normal)));
    }

    public refract(normal: Vector3, refractionRatio: number): Vector3 {
        const cosTheta: number = Math.min(normal.dot(this.neg()), 1);
        const sinTheta: number = Math.sqrt(1 - cosTheta * cosTheta);

        const r0: number = (1 - refractionRatio) / (1 + refractionRatio);
        const reflectance: number = r0 * r0 + (1 - r0 * r0) * Math.pow(1 - cosTheta, 5);

        if (refractionRatio * sinTheta > 1 || reflectance > Math.random()) {
            return this.reflect(normal);
        }

        const rOutPerpendicular: Vector3 = this.add(normal.mulScalar(cosTheta)).mulScalar(refractionRatio);
        const rOutParallel: Vector3 = normal.mulScalar(-Math.sqrt(1 - rOutPerpendicular.lengthSquared()));
        return rOutPerpendicular.add(rOutParallel);
    }

    public static randomUnitVector() {
        while (true) {
            const point: Vector3 = new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
            if (point.lengthSquared() < 1) {
                return point.normalized();
            }
        }
    }

    public serialize(): string {
        return JSON.stringify({
            x: this.x,
            y: this.y,
            z: this.z,
        } as SerializedVector3);
    }

    public static deserialize(raw: string): Vector3 {
        const { x, y, z }: SerializedVector3 = JSON.parse(raw);
        return new Vector3(x, y, z);
    }
}

interface SerializedVector3 {
    x: number;
    y: number;
    z: number;
}
