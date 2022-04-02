import { AxiosResponse } from 'axios';

export function getCookies (response: AxiosResponse) {
    return Object.fromEntries(
        response.headers['set-cookie']!.map(str => str.split(';')[0].split('='))
    );
}

export const serializeCookies = (cookies: Record<string, any>) =>
    Object.entries(cookies).map(c => c[0] + '=' + c[1]).join('; ');
