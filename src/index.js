// @flow
import launchGame from './gameLauncher';

if (process.argv.length < 4) {
  console.log('Usage : ./index.js inputFile outputFile');
  process.exit();
}
launchGame(process.argv[2], process.argv[3]).then(
  () => console.log('Finished'),
  e => console.error(e)
);
