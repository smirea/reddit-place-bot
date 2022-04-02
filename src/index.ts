import axios from 'axios';
import Bot from './Bot';

async function init() {
    const bot = new Bot('random12345689');

    console.dir(
        await bot.setPixel({ x: 10, y: 10, color: 'blue' }),
        { depth: 10 }
    );

}

async function getCurrentImage() {
    const { data: { url } } = await axios.get('https://canvas.codes/canvas');
    return url;
}

init();
