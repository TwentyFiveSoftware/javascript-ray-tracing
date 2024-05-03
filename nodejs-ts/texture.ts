import { Vector3 } from "./vector3";
import { Serializable } from "./interfaces";

export interface Texture extends Serializable {
    getColorAt(point: Vector3): Vector3;
}

export namespace Texture {
    export const deserialize = (raw: string): Texture | null => {
        const { textureType }: SerializedTexture = JSON.parse(raw);
        switch (textureType) {
            case TextureType.SOLID:
                return SolidTexture.deserialize(raw);
            case TextureType.CHECKERED:
                return CheckeredTexture.deserialize(raw);
            default:
                return null;
        }
    };
}

enum TextureType {
    SOLID,
    CHECKERED,
}

interface SerializedTexture {
    textureType: TextureType;
}

interface SerializedSolidTexture extends SerializedTexture {
    albedo: string;
}

interface SerializedCheckeredTexture extends SerializedTexture {
    albedo1: string;
    albedo2: string;
}

export class SolidTexture implements Texture {
    private readonly albedo: Vector3;

    constructor(albedo: Vector3) {
        this.albedo = albedo;
    }

    public getColorAt(_: Vector3): Vector3 {
        return this.albedo;
    }

    public serialize() {
        return JSON.stringify({
            textureType: TextureType.SOLID,
            albedo: this.albedo.serialize(),
        } as SerializedSolidTexture);
    }

    public static deserialize(raw: string): SolidTexture {
        const { albedo }: SerializedSolidTexture = JSON.parse(raw);
        return new SolidTexture(Vector3.deserialize(albedo));
    }
}

export class CheckeredTexture implements Texture {
    private readonly albedo1: Vector3;
    private readonly albedo2: Vector3;

    constructor(albedo1: Vector3, albedo2: Vector3) {
        this.albedo1 = albedo1;
        this.albedo2 = albedo2;
    }

    public getColorAt(point: Vector3): Vector3 {
        const size: number = 6;
        const sines: number = Math.sin(size * point.x) * Math.sin(size * point.y) * Math.sin(size * point.z);
        return sines < 0 ? this.albedo1 : this.albedo2;
    }

    public serialize() {
        return JSON.stringify({
            textureType: TextureType.CHECKERED,
            albedo1: this.albedo1.serialize(),
            albedo2: this.albedo2.serialize(),
        } as SerializedCheckeredTexture);
    }

    public static deserialize(raw: string): CheckeredTexture {
        const { albedo1, albedo2 }: SerializedCheckeredTexture = JSON.parse(raw);
        return new CheckeredTexture(Vector3.deserialize(albedo1), Vector3.deserialize(albedo2));
    }
}
