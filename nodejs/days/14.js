const { readFile } = require('../helpers/read');

const program = readFile('14.txt');

const binary = (i) => (i >>> 0).toString(2).padStart(36, '0');
const sumValues = (mem) => Object.values(mem).reduce((s, v) => s + v, 0);
const maskNumber = (mask, number) => {
  const masked = new Array(mask.length).fill(0);

  for (let i = mask.length - 1; i >= 0; i--) {
    const b = mask.charAt(i);
    if (b === 'X') {
      masked[i] = number.charAt(i);
    } else {
      masked[i] = b;
    }
  }

  return parseInt(masked.join(''), 2);
};

const partOne = (program) => {
  const mem = {};
  let mask = '';

  for (let i = 0; i < program.length; i++) {
    const [left, right] = program[i].split(' = ');
    if (left === 'mask') {
      mask = right;
    } else {
      const address = left.substring(left.indexOf('[') + 1, left.lastIndexOf(']'));
      const number = binary(right);
      mem[address] = maskNumber(mask, number);
    }
  }

  return sumValues(mem);
};

const maskAddress = (mask, address) => {
  // 1 convert address to new addres with X's
  const masked = new Array(mask.length).fill(0);
  let xs = 0;

  for (let i = mask.length - 1; i >= 0; i--) {
    const b = mask.charAt(i);
    if (b === '1') {
      masked[i] = 1;
    } else if (b === '0') {
      masked[i] = address.charAt(i);
    } else {
      masked[i] = 'X';
      xs++;
    }
  }

  let addresses = [[...masked]];

  // convert all X's to numbers with or 0 1
  // keep looping until we've changed all of the X's.
  while (xs > 0) {
    let lastX = masked.lastIndexOf('X');
    let newAddresses = [];

    // for each address in the list, flip that bit and save
    const L = addresses.length;
    for (let i = 0; i < L; i++) {
      const addr = addresses.pop();

      for (let j = 0; j < 2; j++) {
        const clone = [...addr];
        clone[lastX] = j;
        masked[lastX] = 0; // hack to move on in the loop
        newAddresses.push([...clone]);
      }
    }

    
    addresses = newAddresses;
    xs--;
  }
  
  return addresses.map(a => a.join(''));
};

const partTwo = (program) => {
  const mem = {};
  let mask = '';

  for (let i = 0; i < program.length; i++) {
    const [left, right] = program[i].split(' = ');
    if (left === 'mask') {
      mask = right;
    } else {
      const address = binary(left.substring(left.indexOf('[') + 1, left.lastIndexOf(']')));
      const number = parseInt(right); // just write the val?

      const addresses = maskAddress(mask, address);
      addresses.forEach(addr => mem[addr] = number);
    }
  }

  return sumValues(mem);

};

console.log('Part one:', partOne(program));
console.log('Part two:', partTwo(program));
