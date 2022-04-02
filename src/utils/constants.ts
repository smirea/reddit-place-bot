const COLORS_BY_ID = {
    1: {
        id: 1,
        name: 'dark red',
        color: 'rgb(190, 0, 57)',
    },
    2: {
        id: 2,
        name: 'red',
        color: 'rgb(255, 69, 0)',
    },
    3: {
        id: 3,
        name: 'orange',
        color: 'rgb(255, 168, 0)',
    },
    4: {
        id: 4,
        name: 'yellow',
        color: 'rgb(255, 214, 53)',
    },
    6: {
        id: 6,
        name: 'dark green',
        color: 'rgb(0, 163, 104)',
    },
    7: {
        id: 7,
        name: 'green',
        color: 'rgb(0, 204, 120)',
    },
    8: {
        id: 8,
        name: 'light green',
        color: 'rgb(126, 237, 86)',
    },
    9: {
        id: 9,
        name: 'dark teal',
        color: 'rgb(0, 117, 111)',
    },
    10: {
        id: 10,
        name: 'teal',
        color: 'rgb(0, 158, 170)',
    },
    12: {
        id: 12,
        name: 'dark blue',
        color: 'rgb(36, 80, 164)',
    },
    13: {
        id: 13,
        name: 'blue',
        color: 'rgb(54, 144, 234)',
    },
    14: {
        id: 14,
        name: 'light blue',
        color: 'rgb(81, 233, 244)',
    },
    15: {
        id: 15,
        name: 'indigo',
        color: 'rgb(73, 58, 193)',
    },
    16: {
        id: 16,
        name: 'periwinkle',
        color: 'rgb(106, 92, 255)',
    },
    18: {
        id: 18,
        name: 'dark purple',
        color: 'rgb(129, 30, 159)',
    },
    19: {
        id: 19,
        name: 'purple',
        color: 'rgb(180, 74, 192)',
    },
    22: {
        id: 22,
        name: 'pink',
        color: 'rgb(255, 56, 129)',
    },
    23: {
        id: 23,
        name: 'light pink',
        color: 'rgb(255, 153, 170)',
    },
    24: {
        id: 24,
        name: 'dark brown',
        color: 'rgb(109, 72, 47)',
    },
    25: {
        id: 25,
        name: 'brown',
        color: 'rgb(156, 105, 38)',
    },
    27: {
        id: 27,
        name: 'black',
        color: 'rgb(0, 0, 0)',
    },
    29: {
        id: 29,
        name: 'gray',
        color: 'rgb(137, 141, 144)',
    },
    30: {
        id: 30,
        name: 'light gray',
        color: 'rgb(212, 215, 217)',
    },
    31: {
        id: 31,
        name: 'white',
        color: 'rgb(255, 255, 255)',
    },
} as const;

export const COLORS = {
    1: COLORS_BY_ID[1],
    2: COLORS_BY_ID[2],
    3: COLORS_BY_ID[3],
    4: COLORS_BY_ID[4],
    6: COLORS_BY_ID[6],
    7: COLORS_BY_ID[7],
    8: COLORS_BY_ID[8],
    9: COLORS_BY_ID[9],
    10: COLORS_BY_ID[10],
    12: COLORS_BY_ID[12],
    13: COLORS_BY_ID[13],
    14: COLORS_BY_ID[14],
    15: COLORS_BY_ID[15],
    16: COLORS_BY_ID[16],
    18: COLORS_BY_ID[18],
    19: COLORS_BY_ID[19],
    22: COLORS_BY_ID[22],
    23: COLORS_BY_ID[23],
    24: COLORS_BY_ID[24],
    25: COLORS_BY_ID[25],
    27: COLORS_BY_ID[27],
    29: COLORS_BY_ID[29],
    30: COLORS_BY_ID[30],
    31: COLORS_BY_ID[31],
    'dark red': COLORS_BY_ID[1],
    'red': COLORS_BY_ID[2],
    'orange': COLORS_BY_ID[3],
    'yellow': COLORS_BY_ID[4],
    'dark green': COLORS_BY_ID[6],
    'green': COLORS_BY_ID[7],
    'light green': COLORS_BY_ID[8],
    'dark teal': COLORS_BY_ID[9],
    'teal': COLORS_BY_ID[10],
    'dark blue': COLORS_BY_ID[12],
    'blue': COLORS_BY_ID[13],
    'light blue': COLORS_BY_ID[14],
    'indigo': COLORS_BY_ID[15],
    'periwinkle': COLORS_BY_ID[16],
    'dark purple': COLORS_BY_ID[18],
    'purple': COLORS_BY_ID[19],
    'pink': COLORS_BY_ID[22],
    'light pink': COLORS_BY_ID[23],
    'dark brown': COLORS_BY_ID[24],
    'brown': COLORS_BY_ID[25],
    'black': COLORS_BY_ID[27],
    'gray': COLORS_BY_ID[29],
    'light gray': COLORS_BY_ID[30],
    'white': COLORS_BY_ID[31],
} as const;