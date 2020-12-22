const { readFile } = require('../helpers/read');

const parse = (input) => {
  const sets = new Map();
  const counts = {};
  const all = new Set();

  for (let i = 0; i < input.length; i++) {
    let [ingredients, allergens] = input[i].split(' (contains');
    allergens = allergens.substring(1, allergens.length - 1).split(', ');
    ingredients = ingredients.split(' ');

    const possible = new Set();
    ingredients.forEach(i => {
      if (!counts[i]) { counts[i] = 0; }
      counts[i]++;

      possible.add(i)
      all.add(i);
    });

    for (const allergen of allergens) {
      if (sets.has(allergen)) {
        const intersection = new Set([...sets.get(allergen)].filter(i => possible.has(i)));
        sets.set(allergen, intersection);
      } else {
        sets.set(allergen, new Set(Array.from(possible)));
      }
    }
  }

  return { sets, counts, all };
};

const partOne = (input) => {
  const { sets, counts, all } = parse(input);
  let allergens = [];
  let sum = 0;

  // union all possible allergen sets 
  for (const allergenSet of sets.values()) {
    allergens = [...allergens, ...allergenSet];
  }

  // difference the allergen set with 'all' ingredients to get 'non allergens'
  allergens = new Set(allergens);
  const diff = new Set([...all].filter(i => !allergens.has(i)));

  for (const d of diff.values()) { sum += counts[d];}
  return sum;
};

const partTwo = (input) => {
  const { sets } = parse(input);
  const mapOfSets = {};

  for (const [allergen, ingredients] of sets.entries()) {
    mapOfSets[allergen] = Array.from(ingredients)
  }

  const allergens = Object.entries(mapOfSets).sort((a, b) => a[1].length - b[1].length)
  
  for (let i = 0; i < allergens.length; i++) {
    const [, ingredients] = allergens[i];

    if (ingredients.length === 1) {
      for (let j = 0; j < allergens.length; j++) {
        if (i !== j) {
          allergens[j][1] = allergens[j][1].filter(a => a !== ingredients[0]);
        }
      }
    }

    // weird case need to filter last one
    if (i === allergens.length - 1) {
      for (let j = 0; j < allergens[i][1].length; j++) {
        let found = false;
        const allergen = allergens[i][1][j];

        // for each other thing...
        let k = 0;
        while (!found && k < allergens.length) {
          if (k !== i && allergens[k][1].includes(allergen)) {
            allergens[i][1] = allergens[i][1].filter(a => a !== allergen);
            found = true;
          }
          k++;
        }
      }
    }
  }

  allergens.sort((a, b) => a[0].localeCompare(b[0]));
  return allergens.map(a => a[1]).join(',');
}

const input = readFile('21.txt');
console.log('Part one:', partOne(input));
console.log('Part two:', partTwo(input));