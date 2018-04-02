// @flow
import type { ConfigType } from './fileLoader';

const types = {
  MONTAIN: 'MONTAIN',
  TREASURE: 'TREASURE',
  LAND: 'LAND',
  OUT: 'OUT',
};

type TileType = {
  type: $PropertyOf<typeof types>,
  obstacle: boolean,
  quantity: number,
};

export default class Map {
  static LAND = {
    type: types.LAND,
    obstacle: false,
  };

  static MONTAIN = {
    type: types.MONTAIN,
    obstacle: true,
  };

  static TREASURE = {
    type: types.TREASURE,
    obstacle: false,
    quantity: 0,
  };

  static OUT = {
    type: types.OUT,
    obstacle: true,
  };

  map: {
    [number]: {
      [number]: TileType,
    },
  };

  width: number;
  height: number;
  initialConfig: ConfigType;

  constructor(config: ConfigType) {
    this.map = {};
    this.initialConfig = config;
    if (!config.map) {
      throw Error('Map config is mandatory');
    }

    this.width = config.map.width;
    this.height = config.map.height;

    if (config.mountains) {
      config.mountains.map(({ x, y }) => {
        this._addAt(x, y, Map.MONTAIN);
      });
    }
    if (config.treasures) {
      config.treasures.map(({ x, y, quantity }) => {
        this._addAt(x, y, {
          ...Map.TREASURE,
          quantity,
        });
      });
    }
  }

  _addAt(x: number, y: number, tile: TileType) {
    if (!this.map[x]) {
      this.map[x] = {};
    }
    this.map[x][y] = tile;
  }

  at(x: number, y: number): TileType {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return Map.OUT;
    }

    if (!this.map[x] || !this.map[x][y]) {
      return Map.LAND;
    }
    return this.map[x][y];
  }

  isBlocked(x: number, y: number): boolean {
    return this.at(x, y).obstacle;
  }

  isTreasure(x: number, y: number): boolean {
    return this.at(x, y).type === types.TREASURE;
  }

  takeTreasure(x: number, y: number) {
    if (!this.isTreasure(x, y)) {
      return;
    }

    const treasure = this.at(x, y);
    if (treasure.quantity <= 0) {
      console.error('Unexpected Treasure with 0 quantity', this.map);
      return;
    }

    if (treasure.quantity === 1) {
      this._addAt(x, y, Map.LAND);
      return;
    }

    this._addAt(x, y, {
      ...treasure,
      quantity: treasure.quantity - 1,
    });
  }

  getFinalMapConfig() {
    const treasures = [];

    this.initialConfig.treasures.forEach(({ x, y }) => {
      if (!this.isTreasure(x, y)) {
        return;
      }
      const treasureTile = this.at(x, y);
      const treasure = {
        x,
        y,
        quantity: treasureTile.quantity,
      };
      treasures.push(treasure);
    });

    return {
      map: { width: this.width, height: this.height },
      mountains: this.initialConfig.mountains,
      treasures,
    };
  }
}
