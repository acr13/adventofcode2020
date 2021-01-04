const { readFile } = require('../helpers/read');

const input = readFile('13.txt');
const start = Number(input[0]);
const buses = input[1].split(',').filter(b => b !== 'x').map(Number);
const buses2 = input[1].split(',');

const partOne = (start, buses) => {
  let i = start;

  while (true) {
    for (let b = 0; b < buses.length; b++) {
      if (i % buses[b] === 0) {
        return (i - start) * buses[b];
      }
    }
    
    i++;
  }
};

const partTwo = (start, buses2) => {
  // keep the offset (index) BEFORE filtering out x's
  const buses = buses2.map((bus, i) => ({
    id: bus,
    offset: i,
  }))
  .filter(b => b.id !== 'x')
  .map(bus => ({ ...bus, id: Number(bus.id) }));

  const first = buses.shift(); // pop the first off
  let increment = first.id;
  let time = 0;
  
  // for each bus, line them up so they are in their position
  for (let i = 0; i < buses.length; i++) {
    const bus = buses[i];
    let remainder;
    do {
      time = time + increment;
      remainder = (time + bus.offset) % bus.id;
    } while (remainder !== 0)
    increment *= bus.id;
  }

  return time;
};

console.log('Part one:', partOne(start, buses));
console.log('Part two:', partTwo(start, buses2));
