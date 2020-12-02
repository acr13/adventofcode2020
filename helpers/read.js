const fs = require('fs');

const readFile = (fileName) => {
  const contents = [];

  try {
    const data = fs.readFileSync(`./input/${fileName}`, 'UTF-8');
    data
      .split(/\r?\n/)
      .map(line => contents.push(line));
  } catch (err) {
    console.error(err);
  }

  return contents;
};

const readFileToIntegers = (fileName) =>
  readFile(fileName).map(s => parseInt(s));

module.exports = {
  readFile,
  readFileToIntegers,
};
