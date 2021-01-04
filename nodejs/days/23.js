const partOne = (list) => {
  let cups = [...list];
  const MAX = cups.length;
  let i = 0;

  while (i < 100) {
    const nextThree = cups.slice(1, 4);
    const remaining = [cups[0]].concat(cups.slice(4));

    let cur = cups[0] - 1;
    while (true) {
      if (cur <= 0) { cur = MAX; }

      if (remaining.indexOf(cur) !== -1) {
        break;
      }

      cur--;
    }

    const pos = remaining.indexOf(cur);
    cups = remaining.slice(0, pos + 1)
      .concat(nextThree)
      .concat(remaining.slice(pos + 1));

    cups.push(cups.shift()); // move the list so our current index is 0
    i++;
  }

  return [...cups.slice(cups.indexOf(1) + 1), ...cups.slice(0, cups.indexOf(1))].join('');
};

const partTwo = (list, steps) => {
  let cups = [...list];
  const MAX = cups.length;

  // make a linked list...
  for (let i = MAX + 1; i <= 1000000; i++) { cups.push(i); }
  cups = cups.map(value => ({ value }));
  cups = cups.map((obj, idx) => {
    obj.next = idx === cups.length - 1 ? cups[0] : cups[idx + 1];
    return obj;
  });

  // hashmap of { [value] => [obj] }
  const MAP = new Map(cups.map(x => [x.value, x]));

  let head = cups[0];

  for (let i = 0; i < steps; i++) {
    // debug
    // if (i % 1000 === 0) { console.log("  " + (i / (steps / 100)).toFixed(2) + "%\r"); }

    const nextThree = [head.next.value, head.next.next.value, head.next.next.next.value];
    const nextThreeHead = head.next;
    head.next = head.next.next.next.next;

    let cur = head.value - 1;
    while (true) {
      while (nextThree.includes(cur)) cur--;
      if (cur <= 0) { cur = cups.length; }
      while (nextThree.includes(cur)) cur--;

      const pos = MAP.get(cur);
      if (pos) {
        nextThreeHead.next.next.next = pos.next;
        pos.next = nextThreeHead;
        break;
      }

      cur--;
    }

    head = head.next;
  }

  const one = MAP.get(1);
  return one.next.value * one.next.next.value;
};

console.log('Part one:', partOne([5,6,2,8,9,3,1,4,7]));
console.log('Part two:', partTwo([5,6,2,8,9,3,1,4,7], 10000000));
