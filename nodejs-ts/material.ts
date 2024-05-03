import { Serializable } from "./interfaces";
import { Ray } from "./ray";
import { HitRecord } from "./hitrecord";
import { ScatterRecord } from "./scatterrecord";
import { Texture } from "./texture";
import { Vector3 } from "./vector3";

export interface Material extends Serializable {
    scatter(ray: Ray, hitRecord: HitRecord): ScatterRecord | null;
}

export namespace Material {
    export const deserialize = (raw: string): Material | null => {
        const { materialType }: SerializedMaterial = JSON.parse(raw);
        switch (materialType) {
            case MaterialType.DIFFUSE:
                return DiffuseMaterial.deserialize(raw);
            case MaterialType.METAL:
                return MetalMaterial.deserialize(raw);
            case MaterialType.DIELECTRIC:
                return DielectricMaterial.deserialize(raw);
            default:
                return null;
        }
    };
}

enum MaterialType {
    DIFFUSE,
    METAL,
    DIELECTRIC,
}

interface SerializedMaterial {
    materialType: MaterialType;
}

interface SerializedDiffuseMaterial extends SerializedMaterial {
    texture: string;
}

interface SerializedMetalMaterial extends SerializedMaterial {
    texture: string;
}

interface SerializedDielectricMaterial extends SerializedMaterial {
    refractionIndex: number;
}

export class DiffuseMaterial implements Material {
    private readonly texture: Texture;

    constructor(texture: Texture) {
        this.texture = texture;
    }

    public scatter(_: Ray, hitRecord: HitRecord): ScatterRecord | null {
        let scatterDirection: Vector3 = hitRecord.normal.add(Vector3.randomUnitVector()).normalized();
        if (scatterDirection.isNearZero()) {
            scatterDirection = hitRecord.normal;
        }

        return new ScatterRecord(this.texture.getColorAt(hitRecord.point), new Ray(hitRecord.point, scatterDirection));
    }

    public serialize() {
        return JSON.stringify({
            materialType: MaterialType.DIFFUSE,
            texture: this.texture.serialize(),
        } as SerializedDiffuseMaterial);
    }

    public static deserialize(raw: string): DiffuseMaterial {
        const { texture }: SerializedDiffuseMaterial = JSON.parse(raw);
        return new DiffuseMaterial(Texture.deserialize(texture)!);
    }
}

export class MetalMaterial implements Material {
    private readonly texture: Texture;

    constructor(texture: Texture) {
        this.texture = texture;
    }

    public scatter(ray: Ray, hitRecord: HitRecord): ScatterRecord | null {
        const scatterDirection: Vector3 = ray.direction.reflect(hitRecord.normal);

        if (scatterDirection.dot(hitRecord.normal) <= 0) {
            return null;
        }

        return new ScatterRecord(this.texture.getColorAt(hitRecord.point), new Ray(hitRecord.point, scatterDirection));
    }

    public serialize() {
        return JSON.stringify({
            materialType: MaterialType.METAL,
            texture: this.texture.serialize(),
        } as SerializedMetalMaterial);
    }

    public static deserialize(raw: string): MetalMaterial {
        const { texture }: SerializedMetalMaterial = JSON.parse(raw);
        return new MetalMaterial(Texture.deserialize(texture)!);
    }
}

export class DielectricMaterial implements Material {
    private readonly refractionIndex: number;

    constructor(refractionIndex: number) {
        this.refractionIndex = refractionIndex;
    }

    public scatter(ray: Ray, hitRecord: HitRecord): ScatterRecord | null {
        const refractionRatio: number = hitRecord.isFrontFacing ? 1 / this.refractionIndex : this.refractionIndex;
        const scatterDirection: Vector3 = ray.direction.refract(hitRecord.normal, refractionRatio);

        return new ScatterRecord(new Vector3(1, 1, 1), new Ray(hitRecord.point, scatterDirection));
    }

    public serialize() {
        return JSON.stringify({
            materialType: MaterialType.DIELECTRIC,
            refractionIndex: this.refractionIndex,
        } as SerializedDielectricMaterial);
    }

    public static deserialize(raw: string): DielectricMaterial {
        const { refractionIndex }: SerializedDielectricMaterial = JSON.parse(raw);
        return new DielectricMaterial(refractionIndex);
    }
}
