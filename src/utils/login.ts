import axios from 'axios';
import qs from 'querystring';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

import type { Credentials, LoginCookies } from 'src/typeDefs';
import { getCookies, serializeCookies } from './cookies';
import config from '../config';

interface CachedSession {
    time: number;
    cookies: LoginCookies;
}

export default async function login({ username, password }: Credentials): Promise<LoginCookies> {
    const cacheFile = path.join(config.cacheDir, 'session_' + username + '.json');

    if (fs.existsSync(cacheFile)) {
        const cache = require(cacheFile) as CachedSession;
        if (cache.time + 0.9 * 3600e3 <= Date.now()) return cache.cookies;
    }

    const response = await axios.get('https://www.reddit.com/login', { withCredentials: true });
    const [, csrf] = response.data.match(/name="csrf_token" value="([a-z\d]+)"/);
    const loggedOut = getCookies(response);

    const loginResponse = await axios.post(
        'https://www.reddit.com/login',
        qs.stringify({
            username,
            password,
            csrf_token: csrf,
            otp: '',
            dest: 'https://www.reddit.com',
        }),
        {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                cookie: serializeCookies(loggedOut),
            },
        }
    );

    const apiResponse = await axios.get('https://www.reddit.com/r/place?cx=10&cy=10&px=18', {
        headers: {
            cookie: serializeCookies({
                ...loggedOut,
                ...getCookies(loginResponse),
            }),
        }
    });

    const token = jwt.decode(getCookies(apiResponse).token_v2) as { loggedIn: boolean };
    if (!token.loggedIn) throw new Error(`Could not log in as '${username}'`);

    const cookies = {
        ...loggedOut,
        ...getCookies(loginResponse),
        ...getCookies(apiResponse),
    };

    const cacheData: CachedSession = {
        time: Date.now(),
        cookies,
    };

    fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 4));

    return cookies;
}
