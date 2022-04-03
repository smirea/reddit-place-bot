import axios, { AxiosInstance } from 'axios';
import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import config from './config';
import type { Credentials } from './typeDefs';

import { COLORS } from './utils/constants';
import { serializeCookies } from './utils/cookies';
import login from './utils/login';

export default class Bot {
    graphqlClient?: AxiosInstance;
    credentials: Credentials;
    cooldownTime = 0;

    constructor(public user: string) {
        this.credentials = config.credentials.find(u => u.username === this.user)!;
        if (!this.credentials) throw new Error(`Invalid user "${user}", not in ".env" file`);
    }

    get available() { return Date.now() > this.cooldownTime; }

    async login() {
        // TODO❗: handle jwt expiration (1h) and refetch
        if (this.graphqlClient) return;

        const cookies = await login(this.credentials);
        const { sub } = jwt.decode(cookies.token_v2) as { sub: string };

        // tokens are only valid for 1 hour so force login before that
        setTimeout(() => { delete this.graphqlClient; }, 55 * 60e3);

        this.graphqlClient = axios.create({
            headers: {
                'authorization': `Bearer ${sub}`,
                cookie: serializeCookies(_.pick(cookies, 'token_v2')),
                'x-reddit-loid': cookies.loid,
                'x-reddit-session': cookies.session_tracker,
            },
        });
    }

    async graphql(payload: { operationName: string; variables: Record<string, any>; query: string }) {
        await this.login();
        return this.graphqlClient!.post('https://gql-realtime-2.reddit.com/query', payload);
    }

    async setPixel({ x, y, color }: { x: number; y: number; color: keyof typeof COLORS }): Promise<{ ok: boolean; error?: any; }> {
        if (!this.available) return { ok: false, error: 'not available, cooldown' }

        // support multiple canvases
        const canvasIndex = config.place.width * Math.floor(y / 1000) + Math.floor(x / 1000);
        const originalX = x;
        const originalY = y;
        x = x % 1000;
        y = y % 1000;

        console.log(
            '%s Placing a %s tile on %s x %s (canvas %s)',
            chalk.gray(`[Bot ${this.credentials.username.padEnd(20)}]`),
            chalk.bold(COLORS[color].name.padEnd(12)),
            chalk.cyan(String(originalX).padStart(4)),
            chalk.cyan(String(originalY).padStart(4)),
            chalk.cyan(canvasIndex),
        );

        try {
            this.cooldownTime = Date.now() + 5 * 60e3;

            const { data } = await this.graphql({
                operationName: 'setPixel',
                variables: {
                    input: {
                        actionName: 'r/replace:set_pixel',
                        PixelMessageData: {
                            coordinate: { x, y },
                            colorIndex: COLORS[color].id,
                            canvasIndex,
                        },
                    },
                },
                query: 'mutation setPixel($input: ActInput!) {\n  act(input: $input) {\n    data {\n      ... on BasicMessage {\n        id\n        data {\n          ... on GetUserCooldownResponseMessageData {\n            nextAvailablePixelTimestamp\n            __typename\n          }\n          ... on SetPixelResponseMessageData {\n            timestamp\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
            });

            if (data.errors?.length) {
                const errors: Array<{ message: string; extensions: Record<string, any> }> = data.errors;
                const ratelimited = errors.find(x => x.message === 'Ratelimited');
                let error: any = errors;

                if (ratelimited) {
                    this.cooldownTime = ratelimited.extensions.nextAvailablePixelTs * 1000;
                    error = 'ratelimited until: ' + new Date(this.cooldownTime);
                }

                return { ok: false, error };
            }

            return { ok: true };
        } catch (ex) {
            console.error(ex);
            console.error(ex.response.data);
            return { ok: false, error: ex.response?.data ?? ex };
        }
    }
}
