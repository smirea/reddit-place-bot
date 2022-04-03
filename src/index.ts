import chalk from 'chalk';
import _ from 'lodash';
import Bot from './Bot';
import config from './config';
import { COLORS } from './utils/constants';
import getCurrentCanvas from './utils/getCurrentCanvas';
import getDesignsFromEnv from './utils/getDesignsFromEnv';

async function init() {
    const designs = getDesignsFromEnv();
    const { ctx } = await getCurrentCanvas();

    const hashRGB = (r: number, g: number, b: number) => `${r}-${g}-${b}`;
    const rgbMap = _.keyBy(COLORS, ({ rgb: [r, g, b] }) => hashRGB(r, g, b));

    // proof of concept
    const bots = config.credentials.map(cred => new Bot(cred.username));

    for (const { originX, originY, data } of designs) {
        const width = data[0].length;
        const height = data.length;
        const imageData = ctx.getImageData(originX, originY, width, height);

        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                const color = data[y][x];
                if (color == null) continue;

                const r = imageData.data[(y * width + x) * 4 + 0];
                const g = imageData.data[(y * width + x) * 4 + 1];
                const b = imageData.data[(y * width + x) * 4 + 2];
                const existingColor = rgbMap[hashRGB(r, g, b)]?.id;

                if (existingColor == null) {
                    console.warn(chalk.bgYellowBright.black(`Could not map color: [${r}, ${g}, ${b}]`));
                }

                if (existingColor !== color) {
                    const bot = bots.pop();
                    if (!bot) {
                        console.log(chalk.red('Ran outta bots :('));
                        process.exit();
                    }
                    await bot.setPixel({
                        x: originX + x,
                        y: originY + y,
                        color,
                    })
                }
            }
        }
    }

}

init();
