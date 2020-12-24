const { readFile } = require('../helpers/read');

const parse = (input) => {
  const steps = [];

  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    const step = [];

    for (let j = 0; j < line.length; j++) {
      const c = line.charAt(j);
      if (c === 'e') {
        step.push([1, -1, 0]);
      } else if (c === 'w') {
        step.push([-1, 1, 0]);
      } else {
        const m = `${c}${line.charAt(j + 1)}`;
        if (m === 'ne') {
          step.push([1, 0, -1]);
        } else if (m === 'se') {
          step.push([0, -1, 1]);
        } else if ( m === 'sw') {
          step.push([-1, 0, 1]);
        } else {
          step.push([0, 1, -1]);
        }
        j++;
      }
    }

    steps.push(step);
  }

  return steps;
};

const partOne = (steps) => {
  const black = new Set();

  for (let i = 0; i < steps.length; i++) {
    const pos = [0, 0, 0];

    for (let j = 0; j < steps[i].length; j++) {
      pos[0] += steps[i][j][0];
      pos[1] += steps[i][j][1];
      pos[2] += steps[i][j][2];
    }

    const key = `${pos[0]},${pos[1]},${pos[2]}`
    if (black.has(key)) {
      black.delete(key);
    } else {
      black.add(key);
    }
  }

  return black;
};

const toStr = (x,y,z) => `${x},${y},${z}`;
const toArray = (key) => key.split(',').map(Number);

const partTwo = (startingBlack) => {
  const DIRS = [ [1, -1, 0], [0, -1, 1], [-1, 0, 1], [-1, 1, 0], [0, 1, -1], [1, 0, -1] ];
  let i = 0;

  let black = new Set(Array.from(startingBlack));

  while (i < 100) {
    let nextBlack = new Set();
    let toCheck = new Set();

    // check 6 spaces around current black tiles
    for (const key of black) {
      const [x,y,z] = toArray(key);
      toCheck.add(key);

      for (let i = 0; i < DIRS.length; i++) {
        const [dx, dy, dz] = DIRS[i];
        toCheck.add(toStr(x+dx, y+dy, z+dz));
      }
    }

    for (const key of toCheck) {
      const [x,y,z] = toArray(key);
      let count = 0;

      for (let i = 0; i < DIRS.length; i++) {
        const [dx, dy, dz] = DIRS[i];
        const key = toStr(x+dx, y+dy, z+dz);
        if (black.has(key)) {
          count++;
        }
      }

      if (black.has(key) && (count === 1 || count == 2)) {
        nextBlack.add(key);
      } else if (!black.has(key) && count === 2) {
        nextBlack.add(key);
      }
    }

    black = nextBlack;
    i++; 
  }


  return black.size;
};

const steps = parse(readFile('24.txt'));
const blackTiles = partOne(steps);
console.log('Part one:', blackTiles.size);
console.log('Part two:', partTwo(blackTiles));