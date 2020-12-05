const { readFile } = require('../helpers/read.js');

const row = (seat) => {
  let lo = 0;
  let hi = 127;

  for (let i = 0 ; i < 7; i++) {
    if (seat.charAt(i) === 'F') {
      hi = lo + Math.floor((hi - lo) / 2);
    } else {
      lo = hi - Math.floor((hi - lo) / 2)
    }
  }

  return lo;
};

const column = (seat) => {
  let lo = 0;
  let hi = 7;

  for (let i = 7 ; i < seat.length; i++) {
    if (seat.charAt(i) === 'L') {
      hi = lo + Math.floor((hi - lo) / 2);
    } else {
      lo = hi - Math.floor((hi - lo) / 2)
    }
  }

  return lo;
};

const seatId = (seat) => (row(seat) * 8) + column(seat);

const partTwo = (seatIds) => {
  for (let i = 0; i < seatIds.length - 1; i++) {
    if ((1 + seatIds[i]) !== seatIds[i + 1]) {
      return seatIds[i] + 1
    }
  }
};


const seats = readFile('5.txt');
const seatIds = seats.map(seat => seatId(seat)).sort((a,b) => a - b);

console.log('Part one:', seatIds[seatIds.length - 1]);
console.log('Part two:', partTwo(seatIds));
