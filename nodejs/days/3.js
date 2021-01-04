const { readFileToGrid } = require('../helpers/read.js');

const grid = readFileToGrid('3.txt');
const LENGTH = grid[0].length;
const TREE = '#';

const traverse = (grid, moves) => {
  let position = [0, 0];
  let treeProduct = 1;

  for (let i = 0; i < moves.length; i++) {
    const deltaRow = moves[i][0];
    const deltaCol = moves[i][1];
    let trees = 0;

    while (position[0] < grid.length) {
      if (grid[position[0]][position[1]] === TREE) {
        trees++;
      }

      position[0] = position[0] + deltaRow;
      position[1] = (position[1] + deltaCol) % LENGTH;
    }

    treeProduct *= trees;
    position = [0, 0];
  }

  return treeProduct;
};

console.log('Part one:', traverse(grid, [[1, 3]]));
console.log('Part two:', traverse(grid, [[1, 1], [1, 3], [1, 5], [1, 7], [2, 1]]));
