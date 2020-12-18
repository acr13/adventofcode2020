const { readFile } = require('../helpers/read');

const PARENS_RE = /\(([^()]+)\)/;
const ORDERED_RE = /(\d+) (\*|\+) (\d+)/;
const ADD_RE = /(\d+) \+ (\d+)/;
const MULT_RE = /(\d+) \* (\d+)/;

String.prototype.replaceRecursive = function (re, f) {
  let match = null;
  let str = this.toString();
 
  while ((match = str.match(re)) !== null) {
    str = str.replace(match[0], f(match));
  }

  return str;
}

const evaluate = (str, p2) => {
  const s = str.replaceRecursive(PARENS_RE, (match) => evaluate(match[1], p2));
  if (p2) {
    return parseInt(
      s.replaceRecursive(ADD_RE, (match) => parseInt(match[1]) + parseInt(match[2]))
       .replaceRecursive(MULT_RE, (match) => parseInt(match[1]) * parseInt(match[2]))
    );
  }
  return parseInt(s.replaceExhaustive(ORDERED_RE, (match) => eval(match[0])));
};


const input = readFile('18.txt');
const p1 = input.reduce((sum, line) => sum + evaluate(line, false), 0);
console.log('Part one:', p1);
const p2 = input.reduce((sum, line) => sum + evaluate(line, true), 0);
console.log('Part two:', p2);
