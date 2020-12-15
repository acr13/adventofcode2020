const run = (numbers, target) => {
  const spoken = {};
  let turn = 1;
  let nextNumber = null;

  for (let i = 0; i < numbers.length; i++) {
    spoken[numbers[i]] = turn;
    nextNumber = numbers[i];
    turn++;
  }

  turn--;
  nextNumber = 0;

  while (turn < target - 1) {
    turn++;
    let prev = null;
    if (!spoken[nextNumber]) {
      prev = nextNumber;
      nextNumber = 0;
    } else {
      prev = nextNumber;
      nextNumber = turn - spoken[nextNumber];
    }

    spoken[prev] = turn;
  }

  return nextNumber;
}

console.log('Part one:', run([1,0,16,5,17,4], 2020));
console.log('Part two:', run([1,0,16,5,17,4], 30000000));
