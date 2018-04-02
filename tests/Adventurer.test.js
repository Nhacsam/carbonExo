// @flow
import Adventurer from '../src/Adventurer';

const expectAventurerInfo = (adventurer, x, y, direction, path) => {
  expect(adventurer.x).toBe(x);
  expect(adventurer.y).toBe(y);
  expect(adventurer.direction).toBe(direction);
  expect(adventurer.path).toBe(path);
};

describe('Adventurer', () => {
  it('should return the next coordinate', () => {
    const adventurer = new Adventurer({
      name: 'Lara',
      x: 1,
      y: 1,
      direction: 'S',
      path: 'AADADAGGA',
    });

    expectAventurerInfo(adventurer, 1, 1, 'S', 'AADADAGGA');
    expect(adventurer.getNextCoordinate()).toEqual({ x: 1, y: 2 });

    adventurer.move();
    expectAventurerInfo(adventurer, 1, 2, 'S', 'ADADAGGA');
    expect(adventurer.getNextCoordinate()).toEqual({ x: 1, y: 3 });

    adventurer.move();
    expectAventurerInfo(adventurer, 1, 3, 'S', 'DADAGGA');
    expect(adventurer.getNextCoordinate()).toEqual({ x: 1, y: 3 });

    adventurer.move();
    expectAventurerInfo(adventurer, 1, 3, 'O', 'ADAGGA');
    expect(adventurer.getNextCoordinate()).toEqual({ x: 0, y: 3 });

    adventurer.move();
    expectAventurerInfo(adventurer, 0, 3, 'O', 'DAGGA');
    expect(adventurer.getNextCoordinate()).toEqual({ x: 0, y: 3 });

    adventurer.move();
    expectAventurerInfo(adventurer, 0, 3, 'N', 'AGGA');
    expect(adventurer.getNextCoordinate()).toEqual({ x: 0, y: 2 });

    adventurer.move();
    expectAventurerInfo(adventurer, 0, 2, 'N', 'GGA');
    expect(adventurer.getNextCoordinate()).toEqual({ x: 0, y: 2 });

    adventurer.move();
    expectAventurerInfo(adventurer, 0, 2, 'O', 'GA');
    expect(adventurer.getNextCoordinate()).toEqual({ x: 0, y: 2 });

    adventurer.move();
    expectAventurerInfo(adventurer, 0, 2, 'S', 'A');
    expect(adventurer.getNextCoordinate()).toEqual({ x: 0, y: 3 });

    adventurer.move();
    expectAventurerInfo(adventurer, 0, 3, 'S', '');
  });

  it('should skip his turn', () => {
    const adventurer = new Adventurer({
      name: 'Lara',
      x: 0,
      y: 0,
      direction: 'E',
      path: 'AAAEAA',
    });

    adventurer.move();
    adventurer.skip();
    adventurer.move();
    adventurer.move();
    adventurer.skip();
    adventurer.move();
    expectAventurerInfo(adventurer, 2, 1, 'S', '');
  });
  it('should export the final config', () => {
    const adventurer = new Adventurer({
      name: 'Lara',
      x: 1,
      y: 1,
      direction: 'S',
      path: 'AADADAGGAD',
    });

    for (let i = 0; i < 10; i++) {
      adventurer.move();
    }
    adventurer.takeTreasure();
    adventurer.takeTreasure();
    adventurer.takeTreasure();
    expect(adventurer.getFinalConfig()).toEqual({
      name: 'Lara',
      x: 0,
      y: 3,
      direction: 'O',
      treasures: 3,
    });
  });
});
