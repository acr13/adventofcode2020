const { readFile } = require('../helpers/read.js');

// const rules = [
//   '1-3 a: abcde',
//   '1-3 b: cdefg',
//   '2-9 c: ccccccccc'
// ]
const rules = readFile('2.txt');

const partOne = (rules) => {
  let valid = 0;

  for (let i = 0; i < rules.length; i++) {
    const parts = rules[i].split(' ');
    const [min, max] = parts[0].split('-').map(Number);
    const needle = parts[1].charAt(0);
    const haystack = parts[2];
    const times = haystack.split(needle).length - 1;

    if (times >= min && times <= max) {
      valid++
    }
  }

  return valid;
};

const partTwo = (rules) => {
  let valid = 0;

  for (let i = 0; i < rules.length; i++) {
    const parts = rules[i].split(' ');
    const [a, b] = parts[0].split('-').map(Number);
    const needle = parts[1].charAt(0);
    const haystack = parts[2];
    
    if (
        (haystack.charAt(a - 1) === needle && haystack.charAt(b - 1) !== needle) ||
        (haystack.charAt(a - 1) !== needle && haystack.charAt(b - 1) === needle)
     ) {
      valid++;
    }
  }

  return valid;
};

console.log('Part one:', partOne(rules));
console.log('Part two:', partTwo(rules));
