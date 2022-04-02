import axios from 'axios';
import qs from 'querystring';
import jwt from 'jsonwebtoken';

import type { Credentials, LoginCookies } from 'src/typeDefs';
import { getCookies, serializeCookies } from './cookies';

export default async function login({ username, password }: Credentials): Promise<LoginCookies> {
    const response = await axios.get('https://www.reddit.com/login', { withCredentials: true });
    const [, csrf] = response.data.match(/name="csrf_token" value="([a-z\d]+)"/);
    const cookies = getCookies(response);

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
                cookie: serializeCookies(cookies),
            },
        }
    );

    const apiResponse = await axios.get('https://www.reddit.com/r/place?cx=10&cy=10&px=18', {
        headers: {
            cookie: serializeCookies({
                ...cookies,
                ...getCookies(loginResponse),
            }),
        }
    });

    const token = jwt.decode(getCookies(apiResponse).token_v2) as { loggedIn: boolean };
    if (!token.loggedIn) throw new Error(`Could not log in as '${username}'`);

    return {
        ...cookies,
        ...getCookies(loginResponse),
        ...getCookies(apiResponse),
    };
}
