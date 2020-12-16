const run = (numbers, target) => {
  const spoken = new Map();
  numbers.forEach((n, i) => spoken.set(n, i));

  let lastNumber = numbers[numbers.length - 1];
  let lastNumberIndex = numbers.length - 1;
  let lastNumberLastIndex = undefined;

  for (let i = numbers.length; i < target; i++) {
    let thisNumber;
    if (lastNumberLastIndex !== undefined) {
      thisNumber = lastNumberIndex - lastNumberLastIndex;
    } else {
      thisNumber = 0;
    }

    lastNumber = thisNumber;
    lastNumberIndex = i;
    lastNumberLastIndex = spoken.get(thisNumber);

    spoken.set(thisNumber, i);
  }

  return lastNumber;
};

console.log('Part one:', run([1,0,16,5,17,4], 2020));
console.log('Part two:', run([1,0,16,5,17,4], 30000000));
