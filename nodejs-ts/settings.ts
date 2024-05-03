import { Serializable } from "./interfaces";

export class Settings implements Serializable {
    public readonly width: number;
    public readonly height: number;
    public readonly samplesPerPixel: number;
    public readonly maxRayTraceDepth: number;
    public readonly renderWorkers: number;
    public readonly renderWorkerFilePath: string;

    constructor(
        width: number,
        height: number,
        samplesPerPixel: number,
        maxRayTraceDepth: number,
        renderWorkers: number,
        renderWorkerFilePath: string,
    ) {
        this.width = width;
        this.height = height;
        this.samplesPerPixel = samplesPerPixel;
        this.maxRayTraceDepth = maxRayTraceDepth;
        this.renderWorkers = renderWorkers;
        this.renderWorkerFilePath = renderWorkerFilePath;
    }

    public serialize(): string {
        return JSON.stringify({
            width: this.width,
            height: this.height,
            samplesPerPixel: this.samplesPerPixel,
            maxRayTraceDepth: this.maxRayTraceDepth,
            renderWorkers: this.renderWorkers,
        } as SerializedSettings);
    }

    public static deserialize(raw: string): Settings {
        const {
            width,
            height,
            samplesPerPixel,
            maxRayTraceDepth,
            renderWorkers,
            renderWorkerFilePath,
        }: SerializedSettings = JSON.parse(raw);
        return new Settings(width, height, samplesPerPixel, maxRayTraceDepth, renderWorkers, renderWorkerFilePath);
    }
}

interface SerializedSettings {
    width: number;
    height: number;
    samplesPerPixel: number;
    maxRayTraceDepth: number;
    renderWorkers: number;
    renderWorkerFilePath: string;
}
