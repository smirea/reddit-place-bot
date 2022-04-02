import axios from 'axios';

export default async function getCanvas() {
    const { data } = await axios.get('https://canvas.codes/canvas');

    return data;
}
