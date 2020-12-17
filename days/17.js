const { readFile } = require('../helpers/read');

const toStr = (x,y,z,w) => `${x},${y},${z},${w}`;
const toArray = (key) => key.split(',').map(Number);

const run = (input) => {
  let active = new Set();

  for (let i = 0; i < input.length; i++) {
    const cells = input[i].split('');
    for (let j = 0; j < cells.length; j++) {
      if (cells[j] === '#') {
        active.add(toStr(i,j,0,0)); // x,y,z,w
      }
    }
  }

  let i = 0;
  while (i < 6) {
    i++;
    let nextActive = new Set();
    let toCheck = new Set();

    // check around active cells first
    // make a set of neighbour cells that are inactive but might switch
    for (const key of active) {
      const [x,y,z,w] = toArray(key);
      let count = 0;
      for (let xx = -1; xx < 2; xx++) {
        for (let yy = -1; yy < 2; yy++) {
          for (let zz = -1; zz < 2; zz++) {
            for (let ww = -1; ww < 2; ww++) {
              if (xx !== 0 || yy !== 0 || zz !== 0 || ww !== 0) {
                const newKey = toStr(x+xx, y+yy, z+zz, w+ww);
                if (active.has(newKey)) {
                  count++;
                } else {
                  toCheck.add(newKey);
                }
              }
            }
          }
        }
      }

      if (count === 2 || count === 3) {
        nextActive.add(key);
      }
    }

    for (const key of toCheck) {
      const [x,y,z,w] = toArray(key);
      let count = 0;
      for (let xx = -1; xx < 2; xx++) {
        for (let yy = -1; yy < 2; yy++) {
          for (let zz = -1; zz < 2; zz++) {
            for (let ww = -1; ww < 2; ww++) {
              const newKey = toStr(x+xx, y+yy, z+zz, w+ww);
              if (active.has(newKey)) {
                count++;
              }
            }
          }
        }
      }

      if (count === 3) {
        nextActive.add(key);
      }
    }

    active = nextActive;
  }

  return active.size;
};

const input = readFile('17.txt');
console.log('Part two:', run(input)); // p1 = 213
