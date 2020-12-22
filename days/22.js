const { readFile } = require('../helpers/read');

const parse = (input) => {
  const one = [];
  const two = [];
  let p1 = true;

  for (let i = 1; i < input.length; i++) {
    if (input[i] === '') { p1 = false; i++; continue; }
    const n = Number(input[i]);
    p1 ? one.push(n) : two.push(n);
  }

  return { one, two };
};

const score = (list) => list.reverse().reduce((sum, val, i) => sum + (val * (i + 1)), 0);

const play = (one, two) => {
  while (one.length > 0 && two.length > 0) {
    const card1 = one.shift();
    const card2 = two.shift();

    if (card1 > card2) {
      one.push(card1, card2);
    } else {
      two.push(card2, card1);
    }
  }

  if (one.length > 0) {
    return score(one);
  }

  return score(two);
};

const playRecursive = (one, two) => {
  const [_, list] = recursive(one, two, false);
	return score(list);
};

const recursive = (one, two) => {
  const seen = new Set();

  while (one.length > 0 && two.length > 0) {
    const state = one.join(',') + '|' + two.join(',');
    if (seen.has(state)) {
      return [1, one];
    }
    seen.add(state);

    const card1 = one.shift();
    const card2 = two.shift();

    let winner;
    if (one.length >= card1 && two.length >= card2) { // sub-game
      [winner] = recursive(one.slice(0, card1), two.slice(0, card2));
    } else {
      winner = card1 > card2 ? 1 : 2;
    }

    winner === 1 ? one.push(card1, card2) : two.push(card2, card1);
  }

  return one.length > 0 ? [1, one] : [2, two];
};

const { one, two } = parse(readFile('22.txt'));
console.log('Part one:', play([...one], [...two]));
console.log('Part two:', playRecursive([...one], [...two]));