import type { COLORS } from './utils/constants';

export interface Credentials {
    username: string;
    password: string;
}

export interface LoginCookies {
    token_v2: string;
    loid: string;
    session_tracker: string;
}

export type ColorId = typeof COLORS[keyof typeof COLORS]['id'];
