// @flow

type ConfigType = {
  name: string,
  x: number,
  y: number,
  direction: string,
  path: string,
};

export default class Adventurer {
  static directionWheel = ['N', 'E', 'S', 'O'];

  name: string;
  x: number;
  y: number;
  direction: string;
  path: string;
  treasures: number;

  constructor(config: ConfigType) {
    this.name = config.name;
    this.x = config.x;
    this.y = config.y;
    this.direction = config.direction;
    this.path = config.path;
    this.treasures = 0;
  }

  getNextCoordinate() {
    if (!this.path.length) {
      return { x: this.x, y: this.y };
    }
    const nextMove = this.path[0];
    if (nextMove !== 'A') {
      return { x: this.x, y: this.y };
    }

    switch (this.direction) {
      case 'S':
        return { x: this.x, y: this.y + 1 };
      case 'N':
        return { x: this.x, y: this.y - 1 };
      case 'O':
        return { x: this.x - 1, y: this.y };
      case 'E':
        return { x: this.x + 1, y: this.y };
    }
    console.error('Unexpected Direction', this.direction);
    return { x: this.x, y: this.y };
  }

  willMove() {
    if (!this.path.length) {
      return false;
    }
    const nextMove = this.path[0];
    return nextMove === 'A';
  }

  move() {
    if (this.willMove()) {
      this._changePosition();
    } else {
      this._turn();
    }
    this._goToNextTurn();
  }

  skip() {
    this._goToNextTurn();
  }

  hasEnded() {
    return this.path === '';
  }

  takeTreasure() {
    this.treasures++;
  }

  getFinalConfig() {
    return {
      name: this.name,
      x: this.x,
      y: this.y,
      direction: this.direction,
      treasures: this.treasures,
    };
  }

  _changePosition() {
    const coordinate = this.getNextCoordinate();
    this.x = coordinate.x;
    this.y = coordinate.y;
  }

  _turn() {
    const nextMove = this.path[0];
    const rotationDirection = nextMove === 'G' ? -1 : 1;
    const directionIndex = Adventurer.directionWheel.indexOf(this.direction);
    const nextDirection =
      directionIndex + rotationDirection === -1 ? 3 : (directionIndex + rotationDirection) % 4;
    this.direction = Adventurer.directionWheel[nextDirection];
  }

  _goToNextTurn() {
    this.path = this.path.substring(1);
  }
}
