const { readFileToGrid } = require('../helpers/read');

const GRID = readFileToGrid('11.txt');

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
  ].filter(([r, c]) => r >= 0 && r < grid.length && c >= 0 && c < grid[0].length && grid[r][c] === '#').length;

const numOccupied2 = (grid, r, c) => {
  let seats = 0;
  let cc = c;
  let rr = r;
  
  // left
  cc = c - 1;
  while (true) {
    if (cc < 0 || grid[r][cc] === 'L') break;
    if (grid[r][cc] === '#') { seats++; break; }
    cc--;
  }

  // right
  cc = c;
  cc = c + 1;
  while (true) {
    if (cc >= grid[0].length || grid[r][cc] === 'L') break;
    if (grid[r][cc] === '#') { seats++; break; }
    cc++;
  }

  // up
  rr = r - 1;
  while (true) {
    if (rr < 0 || grid[rr][c] === 'L') break;
    if (grid[rr][c] === '#') { seats++; break; }
    rr--;
  }

  // down
  rr = r;
  rr = r + 1;
  while (true) {
    if (rr >= grid.length || grid[rr][c] === 'L') break;
    if (grid[rr][c] === '#') { seats++; break; }
    rr++;
  }

  // up and left
  rr = r;
  cc = c;
  rr = r - 1;
  cc = c - 1;
  while (true) {
    if (rr < 0 || cc < 0 || grid[rr][cc] === 'L') break;
    if (grid[rr][cc] === '#') { seats++; break; }
    rr--;
    cc--;
  }

  // up and right
  rr = r;
  cc = c;
  rr = r - 1;
  cc = c + 1;
  while (true) {
    if (rr < 0 || cc >= grid[0].length || grid[rr][cc] === 'L') break;
    if (grid[rr][cc] === '#') { seats++; break; }
    rr--;
    cc++;
  }

  // down and left
  rr = r;
  cc = c;
  rr = r + 1;
  cc = c - 1;
  while (true) {
    if (rr >= grid.length || cc < 0 || grid[rr][cc] === 'L') break;
    if (grid[rr][cc] === '#') { seats++; break; }
    rr++;
    cc--;
  }

  // down and right
  rr = r;
  cc = c;
  rr = r + 1;
  cc = c + 1;
  while (true) {
    if (rr >= grid.length || cc >= grid[0].length || grid[rr][cc] === 'L') break;
    if (grid[rr][cc] === '#') { seats++; break; }
    rr++;
    cc++;
  }

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