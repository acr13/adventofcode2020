const { readFile } = require('../helpers/read');

// returns a map of { [id] => [2d grid] }
const parse = (input) => {
  const tiles = {};
  let id = -1;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === '') {
      continue;
    } else if (input[i].indexOf('Tile') !== -1) {
      const [, right] = input[i].split(' ');
      id = Number(right.substring(0, right.length - 1));
      tiles[id] = [];
    } else {
      tiles[id].push(input[i].split(''));
    }
  }

  return tiles;
};

const reverse = (str) => str.split('').reverse().join('');

// given a tile and a side [0,1,2,3] return that edge
const edge = (tile, side) => {
  if (side === 0) { // north
    return tile[0].join('');
  } else if (side === 1) { // east
    let right = '';
    for (let i = 0; i < tile.length; i++) {
      right += tile[i][tile[0].length - 1];
    }
    return right;
  } else if (side === 2) { // south
    return tile[tile.length - 1].join('');
  } else { // side === 3 // west
    let left = '';
    for (let i = 0; i < tile.length; i++) {
      left += tile[i][0];
    }
    return left;
  }
};

// corners will have 2 unique edges
// returns map of { [id] => [direction of matching side] }
// ex { [1234] => [0, 1] } (this piece has matches on the north and east, or this is the bottom left corner)
// DIRS
//  0 - north
//  1 - east
//  2 - south
//  3 - west
const getCorners = (tiles) => {
  const corners = {};
  const matchingSides = {};
  const entries = Object.entries(tiles);

  // for every pair of tiles check if edges match (keep count)
  for (let i = 0; i < entries.length; i++) {
    const [idA, tileA] = entries[i];
    for (let j = 0; j < entries.length; j++) {
      if (i !== j) {
        const [idB, tileB] = entries[j];
        
        // all directions
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            const edgeA = edge(tileA, i);
            const edgeB = edge(tileB, j);

            if (edgeA === edgeB || edgeA === reverse(edgeB)) {
              if (!matchingSides[idA]) { matchingSides[idA] = new Set(); }
              if (!matchingSides[idB]) { matchingSides[idB] = new Set(); }
              matchingSides[idA].add(i);
              matchingSides[idB].add(j);
            }
          }
        }
      }
    }
  }

  // corners will have matches in 2 directions
  const tileIds = Object.keys(matchingSides);
  for (let i = 0; i < tileIds.length; i++) {
    const id = tileIds[i];
    if (matchingSides[id].size === 2) {
      corners[id] = Array.from(matchingSides[id]);
    }
  }

  return corners;
};

// 90 degrees clockwise
const rotate = (tile) => tile[0].map((_, index) => tile.map(row => row[index]).reverse())

// vertically
const flip = (tile) => {
  const R = tile.length;
  const C = tile[0].length;
  const flipped = [];

  for (let i = 0; i < R; i++) {
    flipped.push([]);
    for (let j = 0; j < C; j++) {
      flipped[i].push(tile[i][j]);
    }
  }

  return flipped.reverse();
};

const permutations = (tile) => {
  const perms = [];
  let current = tile;

  for (let i = 0; i < 4; i++) {
    current = rotate(current);
    perms.push(current);
  }
  current = flip(current);
  for (let i = 0; i < 4; i++) {
    current = rotate(current);
    perms.push(current);
  }

  return perms;
};

// annoying but, with any corner we can get to the top left permutation
const getTopLeft = (tiles, corners) => {
  const id = Object.keys(corners)[0];
  let tile = tiles[id];

  // north and east
  if (corners[id].includes(0) && corners[id].includes(1)) {
    tile = rotate(tile);
  } else if (corners[id].includes(0) && corners[id].includes(3)) { // north and west
    tile = rotate(rotate(tile));
  } else if (corners[id].includes(2) && corners[id].includes(3)) { // south and west
    tile = rotate(rotate(rotate(tile)));
  }

  // if the corner we picked matched south and east, our job is done
  return { id, tile };
};

// for this tile (tileA) and this side (sideA), find a tile in tiles that a edge (sideB) matches sideA
// ex: matchTile(tileA, 1, tiles, 3) (match the east of tile A to the West of tileB)
const matchTile = (tileA, sideA, tiles, sideB) => {
  const edgeA = edge(tileA, sideA);

  // this tile is already filtered out so dont need to worry
  for (let i = 0; i < tiles.length; i++) {
    const [idB, tileB] = tiles[i];
    const perms = permutations(tileB);
    for (let j = 0; j < perms.length; j++) {
      const edgeB = edge(perms[j], sideB);
      if (edgeA === edgeB) {
        return { id: idB, tile: perms[j] };
      }
    }
  }

  console.log('WTF!!!!!!');
  return {};
};

const trimEdges = (tile) => {
  const R = tile.length - 1; // 1 less!!
  const C = tile[0].length - 1; // 1 less!!
  const newTile = [];

  for (let i = 1; i < R; i++) {
    const row = [];
    for (let j = 1; j < C; j++) {
      row.push(tile[i][j]);
    }
    newTile.push(row);
  }

  return newTile;
};

const addTileToGridRow = (grid, tile, offset) => {
  for (let r = 0; r < tile.length; r++) {
    for (let c = 0; c < tile[r].length; c++) {
      grid[r + offset].push(tile[r][c]);
    }
  }
};

const addTileToGridNextRow = (grid, tile) => {
  // find the empty row
  let start = 0;
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].length === 0) {
      start = i;
      break;
    }
  }

  for (let r = 0; r < tile.length; r++) {
    for (let c = 0; c < tile[r].length; c++) {
      grid[r + start].push(tile[r][c]);
    }
  }
};

// This is literal garbage
const makeGrid = (tiles, corners) => {
  const grid = [];
  const SIZE = Math.sqrt(Object.keys(tiles).length);
  const NUM_ROWS = SIZE * 8; // tile minus top and bottom row
  for (let i = 0; i < NUM_ROWS; i++) {
    grid.push([]);
  }

  const { id: topLeftId, tile: topLeftTile } = getTopLeft(tiles, corners);
  let possibleTiles = Object.entries(tiles).filter(tile => tile[0] !== topLeftId);
  let currentTile = topLeftTile;
  let firstInRow = topLeftTile;
  let offset = 0;
  
  addTileToGridRow(grid, trimEdges(currentTile), offset);

  let matched = 0;

  while (possibleTiles.length > 0) {
    if (matched < (SIZE - 1)) {
      // match a tile to the right (current east, next tile west)
      const { id: idMatch, tile: tileMatch } = matchTile(currentTile, 1, possibleTiles, 3);
      possibleTiles = possibleTiles.filter(tile => tile[0] !== idMatch);
      addTileToGridRow(grid, trimEdges(tileMatch), offset);
      currentTile = tileMatch;
      matched++;
    } else { // we're at the end of a row
      const { id: idMatch, tile: tileMatch } = matchTile(firstInRow, 2, possibleTiles, 0);
      possibleTiles = possibleTiles.filter(tile => tile[0] !== idMatch);
      addTileToGridNextRow(grid, trimEdges(tileMatch));
      currentTile = tileMatch;
      firstInRow = tileMatch;
      matched = 0;
      offset += 8;
    }
  }

  return grid;
};

const countMonsters = (grid, monster) => {
  const monsterHeight = monster.length;
  const monsterWidth = monster[0].length;
  const deltas = [];

  for (let r = 0; r < monster.length; r++) {
    for (let c = 0; c < monster[r].length; c++) {
      if (monster[r].charAt(c) === '#') {
        deltas.push([r, c]);
      }
    }
  }

  const perms = permutations(grid);
  const length = grid.length;
  for (let i = 0; i < perms.length; i++) {
    const img = perms[i];
    let count = 0;
    for (let r = 0; r < length - monsterHeight; r++) {
      for (let c = 0; c < length - monsterWidth; c++) {
        const match = deltas.every(([dr, dc]) => img[r + dr][c + dc] === '#');
        if (match) {
          count++;
        }
      }
    }

    if (count > 0) {
      return count;
    }
  }

  return -1;
};

const tiles = parse(readFile('20.txt'));
const corners = getCorners(tiles);
const p1 = Object.keys(corners).map(Number).reduce((p, n) => p * n, 1);
console.log('Part one:', p1);

const grid = makeGrid(tiles, corners);
// print(grid);
const MONSTER_PATTERN = [
  '                  # ',
  '#    ##    ##    ###',
  ' #  #  #  #  #  #   '
];
const monster = 15; // 15 hashes
const monsterCount = countMonsters(grid, MONSTER_PATTERN);
// console.log('monster count', monsterCount);

let water = 0;
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
    if (grid[i][j] === '#') {
      water++;
    }
  }
}

const p2 = water - (monster * monsterCount);
console.log('Part two:', p2);