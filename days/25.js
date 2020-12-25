const cardPK = 6270530;
const doorPK = 14540258

const transform = (subject, n) => (n * subject) % 20201227;

const loopSize = (subject, pk) => {
  let i = 0;
  let n = 1;

  while (n !== pk) {
    n = transform(subject, n);
    i++;
  }

  return i;
};

const cardLoopSize = loopSize(7, cardPK);
const doorLoopSize = loopSize(7, doorPK);

const cardEncKey = [...Array(doorLoopSize)].reduce((acc) => transform(cardPK, acc), 1);
const doorEncKey = [...Array(cardLoopSize)].reduce((acc) => transform(doorPK, acc), 1);

if (cardEncKey !== doorEncKey) {
  console.log('Try again :(')
  return;
}

console.log('Congrats! :)')
console.log('Part one:', cardEncKey);