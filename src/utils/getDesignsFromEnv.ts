import fs from 'fs';
import path from 'path';
import { DesignData } from 'src/typeDefs';

type DesignConfig = [x: number, y: number, filePath: string];

export default function getDesignsFromEnv() {
    return getDesigns(JSON.parse(process.env.BOT_DESIGNS!) as DesignConfig[]);
};

export function getDesigns(list: Array<DesignConfig>) {
    const result: Array<{ originX: number; originY: number; data: DesignData }> = [];

    for (const [index, [originX, originY, filePath]] of list.entries()) {
        if (filePath == null || typeof filePath !== 'string') {
            throw new Error(`getDesign: index ${index} does not have a file path as the 3rd item`);
        }

        if (originX == null || originY == null) {
            throw new Error(`getDesign: index ${index} (${filePath}): invalid x / y`);
        }

        if (path.extname(filePath) !== '.json') {
            throw new Error(`getDesign: index ${index} (${filePath}): file must be JSON`);
        }

        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
            throw new Error(`getDesign: index ${index} (${filePath}): must be a file`);
        }

        result.push({ originX, originY, data: require(filePath) });
    }

    return result;
}
