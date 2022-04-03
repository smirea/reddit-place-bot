import type { BotJobDescription, Design } from './typeDefs';
import Bot from './Bot';
import getCurrentCanvas from './utils/getCurrentCanvas';
import _ from 'lodash';
import { COLORS } from './utils/constants';
import chalk from 'chalk';
import getLogTime from './utils/getLogTime';

export default class BotPool {
    bots: Bot[];
    running = false;

    constructor(public usernames: string[], public designs: Design[]) {
        this.bots = usernames.map(u => new Bot(u));

        this.runPoll();
    }

    start() {
        console.log(chalk.green('BotPool.start()'));
        this.running = true;
    }

    stop() {
        console.log(chalk.red('BotPool.stop()'));
        this.running = false;
    }

    getAvailableBots() { return this.bots.filter(bot => bot.available); }

    /**
     * Login all bots before placing tiles to place faster
     */
    async loginAllBots() {
        process.stdout.write(getLogTime() + chalk.bold('Logging in all bots:'));
        for (const bot of this.bots) {
            process.stdout.write(' ' + bot.credentials.username);
            await bot.login();
            process.stdout.write(' ✅');
        }
        process.stdout.write('\n');
    }

    async runPoll() {
        top: while (true) {
            if (!this.running) {
                await sleep(1e3);
                continue;
            }

            const bots = this.getAvailableBots();
            if (!bots.length) { // need more bots :(
                console.log(chalk.yellow('No bots available :('));
                await sleep(15e3);
                continue;
            }

            const jobs = await this.getJobs();
            if (!jobs.length) { // take a siesta if there's no work to do
                await sleep(5e3);
                continue;
            }

            for (const job of jobs) {
                const bot = bots.pop();
                if (!bot) {
                    await sleep(15e3); // need more bots :(
                    continue top;
                }

                const { error } = await bot.setPixel(job);
                if (error) {
                    console.error(chalk.bold.red('[ERROR]'), error);
                    // placing a pixel failed, likely due to timeout, re-queue job
                    jobs.push(job);
                }
            }

            console.log(chalk.green('Finished all jobs!'));
            await sleep(2e3); // all jobs finished. wait longer for the images to refresh
        }
    }

    async getJobs() {
        const jobs: BotJobDescription[] = [];
        const { ctx, isOldCanvas } = await getCurrentCanvas();

        if (isOldCanvas) {
            console.log(chalk.yellow('Waiting for a new canvas image (every 10 seconds)'));
            return [];
        }

        for (const { data, originX, originY } of this.designs) {
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
                    const existingColor = RGB_MAP[hashRGB(r, g, b)]?.id;

                    if (existingColor == null) {
                        console.warn(
                            chalk.bgYellowBright.black(`Could not map color: [${r}, ${g}, ${b}]`)
                        );
                    }

                    if (existingColor !== color) {
                        jobs.push({
                            x: originX + x,
                            y: originY + y,
                            color,
                        });
                    }
                }
            }
        }

        return jobs;
    }
}

const sleep = (time: number) => new Promise(r => setTimeout(r, time));
const hashRGB = (r: number, g: number, b: number) => `${r}-${g}-${b}`;
const RGB_MAP = _.keyBy(COLORS, ({ rgb: [r, g, b] }) => hashRGB(r, g, b));
