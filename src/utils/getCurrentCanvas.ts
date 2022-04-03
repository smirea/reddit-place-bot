import fs from 'fs';
import axios from 'axios';
import { Canvas, createCanvas, loadImage } from 'canvas';
import config from '../config';
import path from 'path';

let cachedData: undefined | ({ timestamp: number; } & Return);

type Return = {
    canvas: Canvas;
    ctx: ReturnType<Canvas['getContext']>;
}

export default async function getCurrentCanvas(): Promise<Return> {
    const seconds = Math.floor(Date.now() / 1000);
    const timestamp = seconds - seconds % config.canvasRefreshFrequencySeconds;

    // TODO: disabled for now, always re-fetch canvas
    // if (cachedData?.timestamp === timestamp) return cachedData;

    const res = await axios.get('https://canvas.codes/canvas');
    const data: { ok: boolean; canvas_left: string; canvas_right: string } = res.data;

    if (!data.ok) throw new Error('getCavas: not ok :(');

    const [left, right] = await Promise.all([
        loadImage(data.canvas_left),
        loadImage(data.canvas_right),
    ]);
    const canvas = createCanvas(2000, 1000);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(left, 0, 0);
    ctx.drawImage(right, 1000, 0);

    // not needed for now, but cool to store each image on disk if desired
    if (false) {
        const filePath = path.join(config.cacheDir + '/canvas_' + timestamp + '.png');
        fs.writeFileSync(filePath, canvas.toBuffer());
    }

    cachedData = { timestamp, canvas, ctx };

    return cachedData;
}
