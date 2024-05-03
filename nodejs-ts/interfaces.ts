import { MessagePort } from "node:worker_threads";

export interface Serializable {
    serialize(): string;
}

export interface PixelRow {
    y: number;
    pixels: string[];
}

export type RenderWorkerResult = PixelRow[];

export interface RenderWorkerData {
    messageChannel: MessagePort;
    rawCamera: string;
    rawScene: string;
    rawSettings: string;
}
