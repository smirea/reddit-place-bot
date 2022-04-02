import axios, { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import config from './config';
import type { Credentials } from './typeDefs';

import { COLORS } from './utils/constants';
import { serializeCookies } from './utils/cookies';
import login from './utils/login';

export default class Bot {
    graphqlClient!: AxiosInstance;
    credentials: Credentials;

    constructor(public user: string) {
        this.credentials = config.credentials.find(u => u.username === this.user)!;
        if (!this.credentials) throw new Error(`Invalid user "${user}", not in ".env" file`);
    }

    async login() {
        // TODO❗: handle jwt expiration (1h) and refetch
        if (this.graphqlClient as any) return;

        const cookies = await login(this.credentials);
        const { sub } = jwt.decode(cookies.token_v2) as { sub: string };

        console.log(cookies, sub)

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
        return this.graphqlClient.post('https://gql-realtime-2.reddit.com/query', payload);
    }

    async setPixel({ x, y, color }: { x: number; y: number; color: keyof typeof COLORS }) {
        // support multiple canvases
        const canvasIndex = Math.floor(x / 1000);
        x = x % 1000;

        try {
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

            return data;
        } catch (ex) {
            console.log('㏒ | console.error(ex);');// ㏒
            console.error(ex);
            console.error(ex.response.data);
            return null;
        }
    }
}
