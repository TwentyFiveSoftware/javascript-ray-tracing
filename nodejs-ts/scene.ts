import { Serializable } from "./interfaces";
import { Sphere } from "./sphere";
import { DielectricMaterial, DiffuseMaterial, Material, MetalMaterial } from "./material";
import { CheckeredTexture, SolidTexture } from "./texture";
import { ColorUtil } from "./colorutil";
import { Vector3 } from "./vector3";
import { Ray } from "./ray";
import { HitRecord } from "./hitrecord";

export class Scene implements Serializable {
    private readonly spheres: Sphere[];

    constructor(spheres: Sphere[]) {
        this.spheres = spheres;
    }

    public static generateRandomScene(): Scene {
        const spheres: Sphere[] = [];

        for (let x = -11; x < 11; x++) {
            for (let z = -11; z < 11; z++) {
                let material: Material;

                let materialRandom = Math.random();
                if (materialRandom < 0.8) {
                    material = new DiffuseMaterial(new SolidTexture(ColorUtil.getRandomColor()));
                } else if (materialRandom < 0.95) {
                    material = new MetalMaterial(new SolidTexture(ColorUtil.getRandomColor()));
                } else {
                    material = new DielectricMaterial(1.5);
                }

                const center: Vector3 = new Vector3(x + Math.random() * 0.9, 0.2, z + Math.random() * 0.9);

                spheres.push(new Sphere(center, 0.2, material));
            }
        }

        // GROUND
        spheres.push(
            new Sphere(
                new Vector3(0, -1000, 0),
                1000,
                new DiffuseMaterial(new CheckeredTexture(new Vector3(0.05, 0.05, 0.05), new Vector3(0.95, 0.95, 0.95))),
            ),
        );

        // LEFT
        spheres.push(
            new Sphere(new Vector3(-4, 1, 0), 1, new DiffuseMaterial(new SolidTexture(new Vector3(0.6, 0.3, 0.1)))),
        );

        // CENTER
        spheres.push(new Sphere(new Vector3(0, 1, 0), 1, new DielectricMaterial(1.5)));

        // RIGHT
        spheres.push(
            new Sphere(new Vector3(4, 1, 0), 1, new MetalMaterial(new SolidTexture(new Vector3(0.7, 0.6, 0.5)))),
        );

        return new Scene(spheres);
    }

    public rayHitsScene(ray: Ray): HitRecord | null {
        let currentHitRecord: HitRecord | null = null;
        let maxT: number = Infinity;

        for (const sphere of this.spheres) {
            const hitRecord: HitRecord | null = sphere.rayHitsSphere(ray, 0.001, maxT);
            if (hitRecord !== null) {
                currentHitRecord = hitRecord;
                maxT = hitRecord.t;
            }
        }

        return currentHitRecord;
    }

    public serialize(): string {
        return JSON.stringify({
            spheres: this.spheres.map(sphere => sphere.serialize()),
        } as SerializedScene);
    }

    public static deserialize(raw: string): Scene {
        const { spheres }: SerializedScene = JSON.parse(raw);
        return new Scene(spheres.map(rawSphere => Sphere.deserialize(rawSphere)));
    }
}

interface SerializedScene {
    spheres: string[];
}
