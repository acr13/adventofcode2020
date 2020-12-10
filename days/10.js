const { readFileToIntegers } = require('../helpers/read');

const partOne = (numbers) => {
  let diffs = [0, 0, 0, 0];
  diffs[numbers[0]]++;

  for (let i = 0; i < numbers.length - 1; i++) {
    diffs[numbers[i + 1] - numbers[i]]++;
  }

  diffs[3]++;
  return diffs[1] * diffs[3];
};

const partTwo = (numbers) => {
  // hash of how many ways this number can get to the end
  // (only 1 way for the last number to finish (+3))
  const last = numbers[numbers.length - 1];
  const paths = { [last]: 1 };

  for (let i = numbers.length - 2; i >= 0; i--) {
    let sum = 0;
    for (let j = 1; j <= 3; j++) {
      sum += (paths[numbers[i] + j] || 0);
    }
    paths[numbers[i]] = sum;
  }

  // pretend we have a 0 at the start of the list
  return (paths[1] || 0) + (paths[2] || 0) + (paths[3] || 0);
};


const numbers = readFileToIntegers('10.txt').sort((a, b) => a - b);
console.log('Part one:', partOne(numbers));
console.log('Part two:', partTwo(numbers));
