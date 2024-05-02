class Settings {
    constructor(width, height, samplesPerPixel, maxRayTraceDepth, renderWorkers) {
        this.width = width;
        this.height = height;
        this.samplesPerPixel = samplesPerPixel;
        this.maxRayTraceDepth = maxRayTraceDepth;
        this.renderWorkers = renderWorkers;
    }

    serialize() {
        return JSON.stringify({
            width: this.width,
            height: this.height,
            samplesPerPixel: this.samplesPerPixel,
            maxRayTraceDepth: this.maxRayTraceDepth,
            renderWorkers: this.renderWorkers,
        });
    }

    static deserialize(raw) {
        const {width, height, samplesPerPixel, maxRayTraceDepth, renderWorkers} = JSON.parse(raw);
        return new Settings(width, height, samplesPerPixel, maxRayTraceDepth, renderWorkers);
    }
}

module.exports = Settings;