// @flow
import { loadFile, writeFinalFile } from '../src/fileLoader';
import Map from './Map';
import Adventurer from './Adventurer';

const hasAdventurerOnTile = (adventurers, x, y, adventurerToIgnore) => {
  return !!adventurers.find(
    adventurer => adventurer.x === x && adventurer.y === y && adventurer !== adventurerToIgnore
  );
};

export const runTurns = (map: Map, adventurers: Adventurer[]) => {
  let onePlayed = false;
  do {
    onePlayed = false;
    adventurers.forEach(adventurer => {
      if (adventurer.hasEnded()) {
        return;
      }
      onePlayed = true;
      const nextCoordinate = adventurer.getNextCoordinate();
      if (
        map.isBlocked(nextCoordinate.x, nextCoordinate.y) ||
        hasAdventurerOnTile(adventurers, nextCoordinate.x, nextCoordinate.y, adventurer)
      ) {
        adventurer.skip();
      } else {
        if (adventurer.willMove() && map.isTreasure(nextCoordinate.x, nextCoordinate.y)) {
          map.takeTreasure(nextCoordinate.x, nextCoordinate.y);
          adventurer.takeTreasure();
        }
        adventurer.move();
      }
    });
  } while (onePlayed);
};

const launchGame = async (configFile: string, finalFile: string): Promise<void> => {
  const config = await loadFile(configFile);

  const map = new Map(config);
  const adventurers = config.adventurers.map(adventurerConfig => {
    return new Adventurer(adventurerConfig);
  });
  runTurns(map, adventurers);

  const finalMapConfig = map.getFinalMapConfig();
  const finalAdventurersConfig = adventurers.map(adventurer => adventurer.getFinalConfig());
  return await writeFinalFile(finalFile, {
    ...finalMapConfig,
    adventurers: finalAdventurersConfig,
  });
};

export default launchGame;
