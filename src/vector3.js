class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static zero() {
        return new Vector3(0, 0, 0);
    }

    add(other) {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    sub(other) {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    neg() {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    mulScalar(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    mul(other) {
        return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
    }

    cross(other) {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    sqrt() {
        return new Vector3(Math.sqrt(this.x), Math.sqrt(this.y), Math.sqrt(this.z));
    }

    lengthSquared() {
        return this.dot(this);
    }

    length() {
        return Math.sqrt(this.lengthSquared());
    }

    normalized() {
        const length = this.length();
        if (length === 0) {
            return this;
        }

        return this.mulScalar(1 / length);
    }

    isNearZero() {
        const epsilon = 1e-8;
        return Math.abs(this.x) < epsilon && Math.abs(this.y) < epsilon && Math.abs(this.z) < epsilon;
    }

    static randomUnitVector() {
        while (true) {
            const point = new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
            if (point.lengthSquared() < 1.0) {
                return point.normalized();
            }
        }
    }
}

module.exports = Vector3;