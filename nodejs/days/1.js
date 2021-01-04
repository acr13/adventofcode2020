const { readFileToIntegers } = require('../helpers/read.js');

const TARGET = 2020;

const partOne = (numbers) => {
  const hash = {};

  for (let i = 0; i < numbers.length; i++) {
    hash[numbers[i]] = i;
  }

  for (let i = 0; i < numbers.length; i++) {
    const diff = TARGET - numbers[i];
    if (hash[diff] && hash[diff] !== i) {
      return numbers[i] * numbers[hash[diff]];
    }
  }
};

// for each i, use 2 pointers to find the sum in the rest of the array
const partTwo = (numbers) => {
  for (let i = 0; i < numbers.length - 2; i++) {
    let left = i + 1;
    let right = numbers.length - 1;

    while (left < right) {
      const sum = numbers[i] + numbers[left] + numbers[right];
      if (sum === TARGET) {
        return numbers[i] * numbers[left] * numbers[right];
      } else if (sum < TARGET) {
        left++;
      } else { // sum > TARGET
        right--;
      }
    }
  }
};

const contents = readFileToIntegers('1.txt');
contents.sort((a, b) => a - b);
const numbers = [...new Set(contents)];

console.log('Part one:', partOne(numbers));
console.log('Part two:', partTwo(numbers));
