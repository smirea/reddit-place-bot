import chalk from 'chalk';

export default function getLogTime() {
    const d = new Date;
    const f = (num: number) => String(num).padStart(2, '0');

    return chalk.gray(`[${f(d.getHours())}:${f(d.getMinutes())}:${f(d.getSeconds())}] `);
}
