const fs = require('fs');

const readFile = (fileName) => {
  const contents = [];

  try {
    const data = fs.readFileSync(`./input/${fileName}`, 'UTF-8')
      .split(/\r?\n/)
      .map(line => contents.push(line));
  } catch (err) {
    console.error(err);
  }

  return contents;
};

const readFileToIntegers = (fileName) =>
  readFile(fileName).map(s => parseInt(s));

const readFileToGrid = (fileName) => {
  const grid = [];

  try {
    const data = fs.readFileSync(`./input/${fileName}`, 'UTF-8')
      .split(/\r?\n/)
      .map(line => grid.push([...line.split('')]));
  } catch (err) {
    console.error(err);
  }

  return grid;
}

module.exports = {
  readFile,
  readFileToIntegers,
  readFileToGrid,
};
