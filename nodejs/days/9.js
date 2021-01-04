const { readFileToIntegers } = require('../helpers/read');

const hasTwoSum = (numbers, target) => {
  const hash = {};

  for (let i = 0; i < numbers.length; i++) {
    hash[numbers[i]] = i;
  }

  for (let i = 0; i < numbers.length; i++) {
    const diff = target - numbers[i];
    if (hash[diff] && hash[diff] !== i) {
      return true;
    }
  }

  return false;
};

const partOne = (numbers, n) => {
  for (let i = n; i < numbers.length; i++) {
    if (!hasTwoSum(numbers.slice(i - n, i), numbers[i])) {
      return numbers[i];
    }
  }

  return -1;
};

const findContiguousSum = (numbers, target) => {
  let i = 0;
  while (i < numbers.length) {
    let j = i + 1;
    let sum = numbers[i];

    while (j < numbers.length) {
      sum += numbers[j];
      if (sum === target) {
        return numbers.slice(i, j + 1);
      }
      j++;
    }

    i++;
  }

  return [];
}

const partTwo = (numbers, target) => {
  const range = findContiguousSum(numbers, target);
  const sorted = range.sort((a, b) => a - b);

  return sorted[0] + sorted[sorted.length - 1];
};

const N = 25;
const xmas = readFileToIntegers('9.txt');
const p1 = partOne(xmas, N);
console.log('Part one:', p1);

const p2 = partTwo(xmas, p1);
console.log('Part two:', p2);
