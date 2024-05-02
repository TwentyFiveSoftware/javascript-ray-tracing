class HitRecord {
    constructor(t, point, normal, isFrontFacing, material) {
        this.t = t;
        this.point = point;
        this.normal = normal;
        this.isFrontFacing = isFrontFacing;
        this.material = material;
    }
}

module.exports = HitRecord;
