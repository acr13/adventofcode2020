const { readFileToGrid } = require('../helpers/read');

const GRID = readFileToGrid('11.txt');
const R = GRID.length;
const C = GRID[0].length;

const numOccupied = (grid, r, c) =>
  [
    [r - 1, c - 1],
    [r - 1, c],
    [r - 1, c + 1],
    [r, c - 1],
    [r, c + 1],
    [r + 1, c - 1],
    [r + 1, c],
    [r + 1, c + 1],
  ].filter(([r, c]) => r >= 0 && r < R && c >= 0 && c < C && grid[r][c] === '#').length;

const findOccupiedSeatInThisDirection = (grid, r, c, diff) => {
  let rr = r + diff[0];
  let cc = c + diff[1];

  while (true) {
    if (rr < 0 || cc < 0 || rr >= R || cc >= C || grid[rr][cc] === 'L') {
      return 0;
    }
    if (grid[rr][cc] === '#') {
      return 1;
    }

    rr += diff[0];
    cc += diff[1];
  }
};

const numOccupied2 = (grid, r, c) => {
  let seats = 0;
  
  // left, right, up, down
  seats += findOccupiedSeatInThisDirection(grid, r, c, [0, -1]);
  seats += findOccupiedSeatInThisDirection(grid, r, c, [0, 1]);
  seats += findOccupiedSeatInThisDirection(grid, r, c, [-1, 0]);
  seats += findOccupiedSeatInThisDirection(grid, r, c, [1, 0]);

  // UL, UR, DL, DR
  seats += findOccupiedSeatInThisDirection(grid, r, c, [-1, -1]);
  seats += findOccupiedSeatInThisDirection(grid, r, c, [-1, 1]);
  seats += findOccupiedSeatInThisDirection(grid, r, c, [1, -1]);
  seats += findOccupiedSeatInThisDirection(grid, r, c, [1, 1]);

  return seats;
}

const run = (grid) => {
  let seats = 0;

  const g = grid.map((row, r) => {
    return row.map((cell, c) => {
      const n = numOccupied2(grid, r, c); // Part one = numOccupied(grid, r, c);
      if (cell === 'L' && n === 0) {
        seats++;
        return '#';
      } else if (cell === '#' && n >= 5) { // Part one = 4
        return 'L';
      } else if (cell === '#') {
        seats++;
      }
      

      return cell;
    }); 
  });

  return { grid: g, seats };
};

let last = 0;
let lastGrid = GRID;

while (true) {
  const { grid, seats } = run(lastGrid);

  if (seats === last) {
    console.log(seats); // 2424, 2208
    return;
  }

  last = seats;
  lastGrid = grid;
}