import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

axios.defaults.headers.common = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0',
};

if (false) {
    axios.interceptors.request.use(request => {
        console.log('Starting Request', request.method, request.url, request.data);
        return request
    });

    axios.interceptors.response.use(response => {
        console.log('Response', response.status);
        return response
    });
}

// NOTE: this will break when/if this project is ever built and run from dist/
const rootDir = path.join(__dirname, '../');
const cacheDir = path.join(rootDir, 'cache');

export default {
    rootDir,
    cacheDir,
    /**
     * Do not download the canvas image more that every X seconds
     */
    canvasRefreshFrequencySeconds: 15,
    credentials: (JSON.parse(process.env.BOT_CREDENTIALS!) as string[][])
        .map(([username, password]) => ({
            username,
            password,
        })),
} as const;
