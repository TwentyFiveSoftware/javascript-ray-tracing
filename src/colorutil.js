const Vector3 = require("./vector3");

class ColorUtil {
    static getRandomColor() {
        return ColorUtil._hsvToRgb(Math.random() * 360, 0.75, 0.45);
    }

    static _hsvToRgb(hue, s, v) {
        const h = hue / 60;
        const fraction = (h - Math.floor(h));

        const p = v * (1 - s);
        const q = v * (1 - s * fraction);
        const t = v * (1 - s * (1 - fraction));

        if (0 <= h && h < 1) return new Vector3(v, t, p);
        else if (1 <= h && h < 2) return new Vector3(q, v, p);
        else if (2 <= h && h < 3) return new Vector3(p, v, t);
        else if (3 <= h && h < 4) return new Vector3(p, q, v);
        else if (4 <= h && h < 5) return new Vector3(t, p, v);
        else if (5 <= h && h < 6) return new Vector3(v, p, q);

        return Vector3.zero();
    }
}

module.exports = ColorUtil;