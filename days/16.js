const { readFile } = require('../helpers/read');

const input = readFile('16.txt');
const rules = {};
let your = [];
let nearby = [];

let breaks = 0;
for (let i = 0; i < input.length; i++) {
  const line = input[i];

  if (line === '') {
    breaks++;
    continue;
  }

  if (breaks === 0) {
    let [name, ranges] = line.split(': ');
    let [r1, r2] = ranges.split(' or ');
    r1 = r1.split('-').map(Number);
    r2 = r2.split('-').map(Number);

    rules[name] = [r1, r2];
  } else if (breaks === 1 && line.indexOf('your') === -1) {
    your = line.split(',').map(Number);
  } else if (breaks === 2 && line.indexOf('nearby') === -1) {
    t = line.split(',').map(Number);
    nearby.push(t);
  }
}

const partOne = (rules, nearby) => {
  const ranges = Object.values(rules);
  const invalid = new Set();
  let errorRate = 0;

  for (let i = 0; i < nearby.length; i++) {
    const ticket = nearby[i];
    for (let j = 0; j < ticket.length; j++) {
      const n = ticket[j];
      let valid = false;
      for (const [r1, r2] of ranges) {
        if (valid) {
          continue;
        }

        if ((n >= r1[0] && n <= r1[1]) || (n >= r2[0] && n <= r2[1])) {
          valid = true;
        }
      }
      if (!valid) {
        errorRate += n;
        invalid.add(i);
      }
    }
  }

  return { errorRate, invalid: Array.from(invalid) };
};

const partTwo = (rules, valid, your) => {
  const ruleKeys = Object.keys(rules);
  const TICKET_LENGTH = valid[0].length;

  // [rule index] => [ticket index]
  const mapping = {};

  for (let i = 0; i < TICKET_LENGTH; i++) {
    for (let j = 0; j < ruleKeys.length; j++) {
      // what rule matches all of these indexes
      let match = true;
      const [r1, r2] = rules[ruleKeys[j]];

      for (let k = 0; k < valid.length; k++) {
        const n = valid[k][i];

        if (n < r1[0] || n > r2[1] || (n > r1[1] && n < r2[0])) {
          match = false;
        }
      }

      if (match) {
        if (!mapping[j]) { mapping[j] = [];}
        mapping[j].push(i)
      }
    }
  }

  const sortedMap = Object.entries(mapping).sort((a, b) => a[1].length - b[1].length);
  const finalMapping = {};

  for (let i = 0; i < sortedMap.length; i++) {
    const [rule, cols] = sortedMap[i];
    
    if (cols.length === 1) {
      finalMapping[rule] = cols[0];
    }

    for (let j = 0; j < sortedMap.length; j++) {
      sortedMap[j][1] = sortedMap[j][1].filter(n => n !== cols[0]);
    }    
  }

  // departures are [0,5] in our rules
  let p = 1;
  for (let i = 0; i < 6; i++) {
    p *= your[finalMapping[i]];
  }

  return p;
};


const { errorRate, invalid } = partOne(rules, nearby);
console.log('Part one:', errorRate);

const valid = nearby.filter((_, i) => !invalid.includes(i));
console.log('Part two:', partTwo(rules, valid, your));

