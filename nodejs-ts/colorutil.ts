import { Vector3 } from "./vector3";

export class ColorUtil {
    public static getRandomColor(): Vector3 {
        return ColorUtil.hsvToRgb(Math.random() * 360, 0.75, 0.45);
    }

    private static hsvToRgb(hue: number, s: number, v: number): Vector3 {
        const h: number = hue / 60;
        const fraction: number = h - Math.floor(h);

        const p: number = v * (1 - s);
        const q: number = v * (1 - s * fraction);
        const t: number = v * (1 - s * (1 - fraction));

        if (0 <= h && h < 1) return new Vector3(v, t, p);
        else if (1 <= h && h < 2) return new Vector3(q, v, p);
        else if (2 <= h && h < 3) return new Vector3(p, v, t);
        else if (3 <= h && h < 4) return new Vector3(p, q, v);
        else if (4 <= h && h < 5) return new Vector3(t, p, v);
        else if (5 <= h && h < 6) return new Vector3(v, p, q);

        return Vector3.zero();
    }
}
