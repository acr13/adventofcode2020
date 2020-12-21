const { readFile } = require('../helpers/read');

const parse = (input) => {
  const tiles = {};
  let id = -1;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === '') {
      continue;
    } else if (input[i].indexOf('Tile') !== -1) {
      const [left, right] = input[i].split(' ');
      id = Number(right.substring(0, right.length - 1));
      tiles[id] = [];
    } else {
      tiles[id].push(input[i].split(''));
    }
  }

  return tiles;
};

const getEdgesOfTile = (tile) => {
  const edges = [];

  // top 
  edges.push(tile[0].join(''));
  edges.push([...tile[0]].reverse().join(''))

  // bottom
  edges.push(tile[tile.length - 1].join(''));
  edges.push([...tile[tile.length - 1]].reverse().join(''));

  let left = '';
  let right = '';

  for (let i = 0; i < tile.length; i++) {
    left += tile[i][0];
    right += tile[i][tile.length - 1];
  }

  edges.push(left);
  edges.push(left.split('').reverse().join(''));
  edges.push(right);
  edges.push(right.split('').reverse().join(''));

  return edges;
};

const getCorners = (tiles) => {
  const corners = [];
  const entries = Object.entries(tiles);

  for (let i = 0; i < entries.length; i++) {
    const SEEN = new Set();

    for (let j = 0; j < entries.length; j++) {
      if (i !== j) {
        const [id, tile] = entries[j];
        getEdgesOfTile(tile).forEach(edge => SEEN.add(edge));
      }
    }

    const [id, tile] = entries[i];
    const unique = getEdgesOfTile(tile).filter(edge => !SEEN.has(edge)).length;
    // 8 possible - 2 unique edges means 4 (2x2) unique
    if (unique === 4) {
      corners.push(id);
    }
  }

  return corners;
};

const makeGrid = (tiles, corners) => {
  const grid = [];
  const topLeft = tiles[corners[0]];
  let possibleTiles = Object.entries(tiles).filter(tile => tile[0] !== corners[0]);

  while (possibleTiles.length > 0) {

  }
  
  console.log(topLeft);
  console.log(possibleTiles);

};

const tiles = parse(readFile('20.sample'));
const corners = getCorners(tiles);
console.log('Part one:', corners.reduce((p, n) => p * n, 1));

console.log(corners);
makeGrid(tiles, corners);
console.log('Part two:', 0);