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

export type ColorArr = [r: number, g: number, b: number, a: number];

export type DesignData = (ColorId | null)[][];

export interface Design {
    originX: number;
    originY: number;
    data: DesignData;
};

export interface BotJobDescription {
    x: number;
    y: number;
    color: ColorId;
}
