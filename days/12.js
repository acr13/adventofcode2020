const { readFile } = require('../helpers/read');

// north, east, south, west
const DIRECTIONS = ['N', 'E', 'S', 'W'];
const DELTAS = {
  N: [1, 1],
  E: [0, 1],
  S: [1, -1],
  W: [0, -1],
};

// there has to be a fucking better way
const turn = (turn, current, deg) => {
  let steps = deg / 90;
  let newDir = current;

  while (steps > 0) {
    steps--;

    if (turn === 'L') {
      newDir--;
      if (newDir === -1) {
        newDir = 3;
      }
    } else {
      newDir++;
      if (newDir === DIRECTIONS.length) {
        newDir = 0;
      }
    }
  }

  return newDir;
};

const partOne = (input) => {
  const ship = [0, 0, 1];

  for (let i = 0; i < input.length; i++) {
    const d = input[i].charAt(0);
    const n = parseInt(input[i].substr(1));

    if (['N', 'S', 'E', 'W'].includes(d)) {
      const delta = DELTAS[d];
      ship[delta[0]] += n * delta[1];
    } else if (d === 'F') {
      const delta = DELTAS[DIRECTIONS[ship[2]]];
      ship[delta[0]] += n * delta[1];
    } else if (d === 'R') {
      ship[2] = turn('R', ship[2], n);
    } else if (d === 'L') {
      ship[2] = turn('L', ship[2], n);
    } else {
      console.error('bad?', d, n);
    }
  }

  return Math.abs(ship[0]) + Math.abs(ship[1]);
};

const rotate = (ax, ay, bx, by, angle) => {
  const rad = (Math.PI / 180) * angle,
    cos = Math.cos(rad),
    sin = Math.sin(rad),
    run = bx - ax,
    rise = by - ay,
    cx = (cos * run) + (sin * rise) + ax,
    cy = (cos * rise) - (sin * run) + ay;

  return [Math.round(cx), Math.round(cy)];
}

const partTwo = (input) => {
  const ship = [0, 0, 1];
  const wp = [10, 1];

  for (let i = 0; i < input.length; i++) {
    const d = input[i].charAt(0);
    const n = parseInt(input[i].substr(1));

    if (['N', 'S', 'E', 'W'].includes(d)) {
      const delta = DELTAS[d];
      wp[delta[0]] += n * delta[1];
    } else if (d === 'F') {
      const delta = DELTAS[DIRECTIONS[ship[2]]];
      ship[delta[0]] += n * delta[1] * wp[delta[0]];
      ship[delta[1]] += n * delta[1] * wp[delta[1]];
    } else if (d === 'R') {
      const [x, y] = rotate(0, 0, wp[0], wp[1], n);
      wp[0] = x;
      wp[1] = y;
    } else if (d === 'L') {
      const [x, y] = rotate(0, 0, wp[0], wp[1], n * -1);
      wp[0] = x;
      wp[1] = y;
    }
  }
  
  return Math.abs(ship[0]) + Math.abs(ship[1]);
};  


const input = readFile('12.txt');
console.log('Part one:', partOne(input));
console.log('Part two:', partTwo(input));