import fs from 'fs';
import axios from 'axios';
import { Canvas, createCanvas, loadImage } from 'canvas';
import config from '../config';
import path from 'path';

let cachedData: undefined | Return;

type Return = {
    /**
     * time the source images were created
     *
     * /r/place creates images every 10 seconds, so requesting a newer one before that doesn't make sense
     */
    ts: number;
    /** You probably want to wait for new images to be available and not re-use logic */
    isOldCanvas: boolean;
    canvas: Canvas;
    ctx: ReturnType<Canvas['getContext']>;
}

type CanvasApiReturn = {
    ok: boolean;
    ts: number;
    quadrants: {
        top_left: string;
        top_right: string;
        bottom_left: string;
        bottom_right: string;
    };
}

export default async function getCurrentCanvas(): Promise<Return> {
    const { data } = await axios.get<CanvasApiReturn>('https://canvas.codes/canvas');

    if (!data.ok) throw new Error('getCavas: not ok :(');
    if (cachedData?.ts === data.ts) return { ...cachedData, isOldCanvas: true };

    const [topLeft, topRight, bottomLeft, bottomRight] = await Promise.all([
        loadImage(data.quadrants.top_left),
        loadImage(data.quadrants.top_right),
        loadImage(data.quadrants.bottom_left),
        loadImage(data.quadrants.bottom_right),
    ]);
    const canvas = createCanvas(2000, 2000);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(topLeft, 0, 0);
    ctx.drawImage(topRight, 1000, 0);
    ctx.drawImage(bottomLeft, 0, 1000);
    ctx.drawImage(bottomRight, 1000, 1000);

    if (config.storeImagesOnDisk) {
        const filePath = path.join(config.cacheDir + '/canvas_' + data.ts + '.png');
        fs.writeFileSync(filePath, canvas.toBuffer());
    }

    cachedData = {
        ts: data.ts,
        isOldCanvas: false,
        canvas,
        ctx,
    };

    return cachedData;
}
