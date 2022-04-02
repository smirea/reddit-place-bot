import axios from 'axios';
import dotenv from 'dotenv';

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

export default {
    credentials: (JSON.parse(process.env.BOT_CREDENTIALS!) as string[][])
        .map(([username, password]) => ({
            username,
            password,
        })),
};
