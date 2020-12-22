const { readFile } = require('../helpers/read');

const partOne = (answers) => {
  let sum = 0;
  let yes = new Set();

  for (let i = 0; i < answers.length; i++) {
    if (answers[i] === '') {
      sum += yes.size;
      yes = new Set();
    } else {
      const letters = answers[i].split('');
      
      for (let j = 0; j < letters.length; j++) {
        yes.add(letters[j]);
      }
    }
  }

  return sum;
};

const partTwo = (answers) => {
  let sum = 0;
  let yes = {};
  let n = 0;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i] === '') {
      // get all the keys where yes[key] === n
      const keys = Object.keys(yes);
      for (let j = 0; j < keys.length; j++) {
        if (yes[keys[j]] === n) {
          sum++;
        }
      }
      yes = {};
      n = 0;
    } else {
      const letters = answers[i].split('');
      
      for (let j = 0; j < letters.length; j++) {
        if (!yes[letters[j]]) { yes[letters[j]] = 0; }
        yes[letters[j]]++;
      }

      n++; // people per group
    }
  }

  return sum;
};

const answers =  readFile('6.txt');
console.log('Part one:', partOne(answers));
console.log('Part two:', partTwo(answers));