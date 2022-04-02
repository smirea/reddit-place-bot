import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { COLORS } from '../../src/utils/constants';
import type { ColorId } from '../../src/typeDefs';
import { downloadBlob } from '../utils/download';

type Data = (ColorId | null)[][];

const Canvas: React.FC = () => {
    const [pixelSize, setPixelSize] = useState<'S' | 'M' | 'L'>('L');
    const [width, setWidth] = useState(50);
    const [height, setHeight] = useState(50);
    const [swatch, setSwatch] = useState<ColorId>(COLORS.yellow.id);
    const [painting, setPainting] = useState(false);
    const [data, setData] = useState<Data>([]);

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

    const handleDownload = () => {
        const boundingBox = [width, height, -1, -1];
        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if (data[y][x] == null) continue;
                if (x < boundingBox[0]) boundingBox[0] = x;
                if (x > boundingBox[2]) boundingBox[2] = x + 1;
                if (y < boundingBox[1]) boundingBox[1] = y;
                if (y > boundingBox[3]) boundingBox[3] = y + 1;
            }
        }

        const cropWidth = boundingBox[2] - boundingBox[0];
        const cropHeight = boundingBox[3] - boundingBox[1];
        const croppedData = new Array(cropHeight).fill(null).map(() => new Array(cropWidth).fill(null));

        for (let y = boundingBox[1]; y < boundingBox[3]; ++y) {
            for (let x = boundingBox[0]; x < boundingBox[2]; ++x) {
                croppedData[y - boundingBox[1]][x - boundingBox[0]] = data[y][x];
            }
        }

        downloadBlob(
            `bot-image_${cropWidth}x${cropHeight}.json`,
            'application/json',
            JSON.stringify(croppedData),
        );
    }

    if (!data.length) return null;

    return <div>
        <div className='colors'>
            {_.uniqBy(Object.values(COLORS), 'id').map(clr =>
                <div
                    key={clr.id}
                    className='color'
                    style={{ backgroundColor: clr.color }}
                    onClick={() => setSwatch(clr.id)}
                    data-selected={clr.id === swatch}
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
                <button type='button' onClick={handleDownload}>Export</button>
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
