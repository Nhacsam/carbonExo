import path from 'path';
import fs from 'fs';
import util from 'util';

import Map from '../src/Map';
import Adventurer from '../src/Adventurer';
import launchGame, { runTurns } from '../src/gameLauncher';

const readFile = util.promisify(fs.readFile);

describe('gameLauncher', () => {
  it('should compute the adventurers move', () => {
    const adventurer = new Adventurer({
      name: 'Lara',
      x: 1,
      y: 1,
      direction: 'S',
      path: 'AADADAGGA',
    });
    const map = new Map({
      map: { width: 3, height: 4 },
      mountains: [{ x: 1, y: 0 }, { x: 2, y: 1 }],
      treasures: [{ x: 0, y: 3, quantity: 2 }, { x: 1, y: 3, quantity: 3 }],
    });

    runTurns(map, [adventurer]);

    expect(adventurer.getFinalConfig()).toEqual({
      name: 'Lara',
      x: 0,
      y: 3,
      direction: 'S',
      treasures: 3,
    });
    expect(map.getFinalMapConfig()).toEqual({
      map: { width: 3, height: 4 },
      mountains: [{ x: 1, y: 0 }, { x: 2, y: 1 }],
      treasures: [{ x: 1, y: 3, quantity: 2 }],
    });
  });

  it('should launch the game', async () => {
    const output = path.join(__dirname, './outputs/demoResult.txt');
    try {
      await util.promisify(fs.unlink)(output);
    } catch (e) {}
    await launchGame(path.join(__dirname, './testFiles/demoMap.txt'), output);

    const result = await readFile(output);
    const expectedResult = await readFile(path.join(__dirname, './expected/demoMap.txt'));
    expect(result.toString()).toEqual(expectedResult.toString());
  });

  it('should handle block correctly', async () => {
    const output = path.join(__dirname, './outputs/blockingResult.txt');
    try {
      await util.promisify(fs.unlink)(output);
    } catch (e) {}
    await launchGame(path.join(__dirname, './testFiles/blokingMap.txt'), output);

    const result = await readFile(output);
    const expectedResult = await readFile(path.join(__dirname, './expected/blokingMap.txt'));
    expect(result.toString()).toEqual(expectedResult.toString());
  });
});
