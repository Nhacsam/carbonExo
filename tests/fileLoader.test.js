import path from 'path';
import { loadFile } from '../src/fileLoader';

describe('FileLoader', () => {
  it('should load the content of the file', () => {
    return loadFile(path.join(__dirname, './testFiles/demoMap.txt')).then(result => {
      expect(result).toEqual({
        map: { width: 3, height: 4 },
        mountains: [{ x: 1, y: 0 }, { x: 2, y: 1 }],
        treasures: [{ x: 0, y: 3, quantity: 2 }, { x: 1, y: 3, quantity: 3 }],
        adventurers: [
          {
            name: 'Lara',
            x: 1,
            y: 1,
            direction: 'S',
            path: 'AADADAGGA',
          },
        ],
      });
    });
  });
});
