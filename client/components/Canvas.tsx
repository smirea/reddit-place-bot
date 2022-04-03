import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { COLORS } from '../../src/utils/constants';
import type { ColorId, DesignData } from '../../src/typeDefs';
import Download from './Download';

const Canvas: React.FC = () => {
    const [pixelSize, setPixelSize] = useState<'S' | 'M' | 'L'>('L');
    const [width, setWidth] = useState(50);
    const [height, setHeight] = useState(50);
    const [swatch, setSwatch] = useState<ColorId | null>(COLORS.yellow.id);
    const [painting, setPainting] = useState(false);
    const [data, setData] = useState<DesignData>([]);

    useEffect(() => {
        setData(
            _.range(height).map(() => new Array(width).fill(null))
        );
    }, [width, height]);

    const paint = (x: number | string, y: number | string) => {
        if (x == null || y == null || data[y][x] === swatch) return;
        const newData = [...data];
        newData[y] = [...newData[y]];
        newData[y][x] = swatch;
        setData(newData);
    }

    const onMouseDown = (event: any) => {
        const { x, y } = event.target?.dataset || {};
        setPainting(true);
        paint(x, y);
    };

    const onMouseMove = (event: any) => {
        if (!painting) return;
        const { x, y } = event.target?.dataset || {};
        paint(x, y)
    };

    const onMouseLeave = () => {
        setPainting(false);
    };

    if (!data.length) return null;

    return <div>
        <div className='swatches'>
            <div
                className='swatch'
                style={{ backgroundColor: '#eef' }}
                onClick={() => setSwatch(null)}
                data-selected={swatch === null}
                data-color='empty'
                draggable='false'
            />

            {_.uniqBy(Object.values(COLORS), 'id').map(clr =>
                <div
                    key={clr.id}
                    className='swatch'
                    style={{ backgroundColor: clr.color }}
                    onClick={() => setSwatch(clr.id)}
                    data-selected={clr.id === swatch}
                    data-color={clr.name}
                    draggable='false'
                />
            )}
        </div>

        <div style={{ display: 'flex' }}>
            <div
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseLeave}
                className='canvas'
                style={{
                    gridTemplateColumns: `repeat(${width}, auto)`,
                }}
                data-pixel-size={pixelSize}
            >
                {data.map((rows, y) =>
                    rows.map((id, x) =>
                        getPixel(x, y, id == null ? null : COLORS[id].color)
                    )
                ).flat()}
            </div>

            <div className='actions'>
                <Download data={data} />
            </div>
        </div>
    </div>
}

export default Canvas;

const getPixel = _.memoize(
    (x: number, y: number, color: string | string) =>
        <div
            key={`${x}-${y}`}
            className='pixel'
            style={color == null ? null : { backgroundColor: color }}
            data-x={x}
            data-y={y}
            data-blank={color == null}
            draggable='false'
        />,
    (x, y, color) => '' + x + '-' + y + '-' + color,
);
