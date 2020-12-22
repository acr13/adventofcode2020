const { readFile } = require('../helpers/read');

const program = readFile('8.txt').map(line => line.split(' '));

const run = (program) => {
  const LENGTH = program.length;
  const seen = {};

  let i = 0;
  let acc = 0;

  while (i < LENGTH) {
    if (seen[i] > 0) {
      return { acc, isInfinite: true };
    }

    if (!seen[i]) { seen[i] = 0; }
    seen[i]++;

    const [inst, amt] = program[i];
    if (inst === 'acc') {
      acc += parseInt(amt);
    }

    inst === 'jmp' ? i += parseInt(amt) : i++;
  }

  return { acc, isInfinite: false };
};

const { acc } = run(program);
console.log('Part one:', acc);

for (let i = 0; i < program.length; i++) {
  const [inst] = program[i];
  if (inst === 'jmp' || inst === 'nop') {
    const copy = JSON.parse(JSON.stringify(program));
    copy[i] = inst === 'jmp' ? 'nop' : 'jmp'
    const { acc, isInfinite } = run(copy);
    if (!isInfinite) {
      console.log('Part two:', acc);
      break;
    }
  }
}
