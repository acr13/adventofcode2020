const { readFile } = require('../helpers/read')

const input = readFile('19.txt');
const rules = {};
const words = [];
let doneRules = false;

for (let i = 0; i < input.length; i++) {
  if (doneRules) {
    words.push(input[i]);
  } else if (input[i] === '') {
    doneRules = true;
  } else {
    const [left, right] = input[i].split(': ');
    if (right.indexOf('"') === 0) {
      rules[left] = right.substring(1, right.length - 1);
    } else if (right.indexOf('|') !== -1) {
      rules[left] = right.split(' | ').map(r => r.split(' '));
    } else {
      rules[left] = [right.split(' ')];
    }
  }
}

const test = (str, seq) => {
  if (str === '' && seq.length === 0) {
    return true;
  } else if (str === '' || seq.length === 0) {
    return false;
  }

  const rs = rules[seq[0]];
  if (typeof rs === 'string') {
    if (str.charAt(0) === rs) {
      return test(str.substr(1), seq.slice(1));
    }

    return false;
  }

  const newSeqs = rs.map(newSeq => [...newSeq].concat(seq.slice(1)));
  return newSeqs.some(s => test(str, s));
};

// P1 = 120
console.log('Part two:', words.reduce((sum, word) => test(word, rules['0'][0]) ? sum + 1 : sum, 0));