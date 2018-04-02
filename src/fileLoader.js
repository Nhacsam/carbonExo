// @flow
import { mapValues } from 'lodash';
import util from 'util';
import fs from 'fs';

type ConfigType = {
  mountains: {
    x: number,
    y: number,
  }[],
  map: {
    width: number,
    height: number,
  },
  adventurers: {
    name: string,
    x: number,
    y: number,
    direction: string,
    path: string,
  }[],
  treasures: {
    x: number,
    y: number,
    quantity: number,
  }[],
};

const readFile = util.promisify(fs.readFile);

function mapResults<T>(regex: RegExp, input: string, callback: (string[]) => T): T[] {
  let match;
  let montains = [];
  while ((match = regex.exec(input)) !== null) {
    montains.push(callback(match));
  }
  return montains;
}

function parseMountainsLines(input: string) {
  const regex = /^M - ([0-9]+) - ([0-9]+)$/gm;
  return mapResults(regex, input, match => ({
    x: Number(match[1]),
    y: Number(match[2]),
  }));
}

function parseMapLines(input: string) {
  const regex = /^C - ([0-9]+) - ([0-9]+)$/m;
  let match = regex.exec(input);
  if (!match) {
    return {};
  }
  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
}

function parseAdventurerLines(input: string) {
  const regex = /^A - ([A-Za-z]+) - ([0-9]+) - ([0-9]+) - ([A-Z]) - ([A-Z]+)$/gm;
  return mapResults(regex, input, match => ({
    name: match[1],
    x: Number(match[2]),
    y: Number(match[3]),
    direction: match[4],
    path: match[5],
  }));
}

function parseTreasureLines(input: string) {
  const regex = /^T - ([0-9]+) - ([0-9]+) - ([0-9]+)$/gm;
  return mapResults(regex, input, match => ({
    x: Number(match[1]),
    y: Number(match[2]),
    quantity: Number(match[3]),
  }));
}

const LINE_PARSERS = {
  mountains: parseMountainsLines,
  map: parseMapLines,
  adventurers: parseAdventurerLines,
  treasures: parseTreasureLines,
};

function parseFile(lines) {
  return mapValues(LINE_PARSERS, (parser: string => Object[]) => parser(lines));
}

export async function loadFile(path: string): Promise<ConfigType> {
  const fileContent = await readFile(path, 'utf8');
  return parseFile(fileContent);
}
