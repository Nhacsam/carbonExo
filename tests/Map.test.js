import Map from '../src/Map';

describe('Map', () => {
  it('should build the map object', () => {
    const map = new Map({
      map: { width: 3, height: 4 },
      mountains: [{ x: 1, y: 0 }, { x: 2, y: 1 }],
      treasures: [{ x: 0, y: 3, quantity: 2 }, { x: 1, y: 3, quantity: 3 }],
    });
    expect(map.at(1, 0)).toEqual({
      type: 'MONTAIN',
      obstacle: true,
    });
    expect(map.at(0, 0)).toEqual({
      type: 'LAND',
      obstacle: false,
    });
    expect(map.at(1, 1)).toEqual({
      type: 'LAND',
      obstacle: false,
    });
    expect(map.at(0, 3)).toEqual({
      type: 'TREASURE',
      obstacle: false,
      quantity: 2,
    });
  });
  it('should detect out of map', () => {
    const OUT = { type: 'OUT', obstacle: true };
    const map = new Map({
      map: { width: 3, height: 4 },
    });
    expect(map.at(-1, 0)).toEqual(OUT);
    expect(map.at(0, -1)).toEqual(OUT);
    expect(map.at(3, 0)).toEqual(OUT);
    expect(map.at(0, 4)).toEqual(OUT);
  });
  it('should indicate if it is a blocked tile', () => {
    const map = new Map({
      map: { width: 3, height: 4 },
      mountains: [{ x: 1, y: 0 }, { x: 2, y: 1 }],
      treasures: [{ x: 0, y: 3, quantity: 2 }, { x: 1, y: 3, quantity: 3 }],
    });
    expect(map.isBlocked(1, 0)).toBe(true);
    expect(map.isBlocked(0, 0)).toBe(false);
    expect(map.isBlocked(0, 3)).toBe(false);
    expect(map.isBlocked(0, 4)).toBe(true);
  });

  it('should get if there is a treasure', () => {
    const map = new Map({
      map: { width: 3, height: 4 },
      mountains: [{ x: 1, y: 0 }, { x: 2, y: 1 }],
      treasures: [{ x: 0, y: 3, quantity: 2 }, { x: 1, y: 3, quantity: 3 }],
    });
    expect(map.isTreasure(1, 0)).toBe(false);
    expect(map.isTreasure(0, 0)).toBe(false);
    expect(map.isTreasure(0, 3)).toBe(true);
  });
  it('should allow to take treasures', () => {
    const map = new Map({
      map: { width: 3, height: 4 },
      mountains: [{ x: 1, y: 0 }, { x: 2, y: 1 }],
      treasures: [{ x: 0, y: 3, quantity: 2 }, { x: 1, y: 3, quantity: 3 }],
    });

    expect(map.isTreasure(0, 3)).toBe(true);
    expect(map.at(0, 3).quantity).toBe(2);

    map.takeTreasure(0, 3);
    expect(map.at(0, 3).quantity).toBe(1);

    map.takeTreasure(0, 3);
    expect(map.isTreasure(0, 3)).toBe(false);
    expect(map.at(0, 3)).toEqual({
      type: 'LAND',
      obstacle: false,
    });
  });

  it('should export the final map', () => {
    const map = new Map({
      map: { width: 3, height: 4 },
      mountains: [{ x: 1, y: 0 }, { x: 2, y: 1 }],
      treasures: [{ x: 0, y: 3, quantity: 2 }, { x: 1, y: 3, quantity: 1 }],
    });

    map.takeTreasure(0, 3);
    map.takeTreasure(1, 3);
    expect(map.getFinalMapConfig()).toEqual({
      map: { width: 3, height: 4 },
      mountains: [{ x: 1, y: 0 }, { x: 2, y: 1 }],
      treasures: [{ x: 0, y: 3, quantity: 1 }],
    });
  });
});
