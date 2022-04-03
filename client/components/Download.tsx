import { useState } from 'react';
import type { DesignData } from '../../src/typeDefs';
import { downloadBlob } from '../utils/download';

const Download: React.FC<{ data: DesignData }> = ({ data }) => {
    const [name, setName] = useState('');
    // const [originX, setOriginX] = useState(0);
    // const [originY, setOriginY] = useState(0);
    const width = data[0].length;
    const height = data.length;

    const handleDownload = () => {
        const boundingBox = [width, height, -1, -1];
        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                if (data[y][x] == null) continue;
                if (x < boundingBox[0]) boundingBox[0] = x;
                if (x >= boundingBox[2]) boundingBox[2] = x + 1;
                if (y < boundingBox[1]) boundingBox[1] = y;
                if (y >= boundingBox[3]) boundingBox[3] = y + 1;
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
            `bot-design_${name}_size-${cropWidth}x${cropHeight}.json`,
            'application/json',
            JSON.stringify(croppedData),
        );

        setName('');
        // setOriginX(0);
        // setOriginY(0);
    }

    return <div className='download'>
        <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='name'
        />
        {/* <div className='origin'>
            <div>X:</div>
            <input
                type='number'
                value={originX}
                onChange={e => setOriginX(parseInt(e.target.value, 10))}
                placeholder='X'
                size={4}
                min={0}
                max={1999}
                step={1}
            />
            <div>Y:</div>
            <input
                type='number'
                value={originY}
                onChange={e => setOriginY(parseInt(e.target.value, 10))}
                placeholder='Y'
                size={4}
                min={0}
                max={1999}
                step={1}
            />
        </div> */}
        <button type='button' onClick={handleDownload}>Export</button>
        <div>
            After exporting, make sure to edit the <b>.env</b> file and add the path and origin
        </div>
    </div>
}

export default Download;
