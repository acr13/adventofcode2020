const { readFile } = require('../helpers/read');

// create a hash of state:
// { 'bright yellow': [ {name: 'light red', amount: 2}, {name: 'faded purple', amount: 5} ]
const getState = (bags) =>
  bags.reduce((state, rule) => {
    const r = rule.replace(/bags|bag/g, '');
    const parts = r.split(' contain ');
    const bag = parts[0].trim();

    const bags = parts[1].split(',')
      .map(s => s.replace(/\./g, ''))
      .map(s => s.trim());

    let children = null;

    if (!bags.includes('no other')) {
      children = bags.reduce((children, bag) => {
        const parts = bag.split(' ');
        const child = { name: `${parts[parts.length - 2]} ${parts[parts.length - 1]}`, amount: parseInt(parts[0]) };
        return children.concat(child);
      }, []);
    }

    state[bag] = children;
    return state;
  }, {});

// helper to find a bag in a bag
const pathToBag = (children, target) => {
  for (let i = 0; i < children.length; i++) {
    if (children[i].name === target) {
      return true;
    }
  }

  return false;
};

// "how many diff paths to this node"
const partOne = (state, target) => {
  const paths = new Set();
  const allBags = Object.keys(state);

  // build a list of things that point to our target (n = 1)
  for (let i = 0; i < allBags.length; i++) {
    const bag = allBags[i];
    if (state[bag] && pathToBag(state[bag], target)) {
      paths.add(bag);
    }
  }

  // continue looping to find what points to these starting points
  let madeMoves = true;
  while (madeMoves) {
    madeMoves = false;

    for (let node of paths) {
      for (let i = 0; i < allBags.length; i++) {
        const bag = allBags[i];
        if (state[bag] && pathToBag(state[bag], node) && !paths.has(bag)) {
          paths.add(bag);
          madeMoves = true;
        }
      }
    }
  }
  
  return paths.size;
};

const numOfBagsInBag = (state, target) => {
  if (!state[target]) {
    return 0;
  }

  const children = state[target];
  return children.reduce((sum, child) =>
    sum + (child.amount + (child.amount * numOfBagsInBag(state, child.name))), 0);
};

const state = getState(readFile('7.txt'));
console.log('Part one:', partOne(state, 'shiny gold'));
console.log('Part two:', numOfBagsInBag(state, 'shiny gold'));