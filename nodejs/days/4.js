const fs = require('fs');

const EYE_COLORS = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

const getPassports = (fileName) => {
  const passports = [ [] ];
  let data = null;

  try {
    data = fs.readFileSync(`./input/${fileName}`, 'UTF-8')
      .split(/\r?\n/);
  } catch (err) {
    console.error(err);
  }

  // find the empty lines and create a list of strings for each passport (gross)
  for (let i = 0 ; i < data.length; i++) {
    const line = data[i];

    if (line === '') {
      // rejig the last passport to be a string
      passports[passports.length - 1] = passports[passports.length - 1].reduce((s, val) => val += ' ' + s, '').trim();
      passports.push([]);
    } else {
      passports[passports.length - 1] = passports[passports.length - 1].concat(line);
    }
  }

  passports[passports.length - 1] = passports[passports.length - 1].reduce((s, val) => val += ' ' + s, '').trim();

  // convert those to objs
  const passportObjects = [];

  for (let i = 0; i < passports.length; i++) {
    const parts = passports[i].split(' ');

    const obj = parts.reduce((acc, val) => {
      const parts = val.split(':')
      acc[parts[0]] = parts[1];
      return acc;
    }, {});
    obj.numKeys = Object.keys(obj).length;

    passportObjects.push(obj);
  }

  return passportObjects;
};

const validValues = (obj) => {
  const heightType = obj.hgt.substr(-2);
  const height = parseInt(obj.hgt.slice(0, -2));

  if (heightType === 'cm') {
    if (height < 150 || height > 193) {
      return false;
    }
  } else if (heightType === 'in') {
    if (height < 59 || height > 76) {
      return false;
    }
  } else {
    return false;
  }

  if (obj.byr < 1920 || obj.byr > 2002) {
    return false;
  } else if (obj.iyr < 2010 || obj.iyr > 2020) {
    return false;
  } else if (obj.eyr < 2020 || obj.eyr > 2030) {
    return false;
  } else if (!EYE_COLORS.includes(obj.ecl)) {
    return false;
  } else if (obj.pid.length !== 9) {
    return false;
  } else if (obj.hcl.length !== 7) { // todo
    return false;
  }

  return true;
};

const partOne = (passports) => {
  let valid = 0;

  for (let i = 0; i < passports.length; i++) {
    const passport = passports[i];
    
    if (passport.numKeys >= 8) {
      valid++;
    } else if (passport.numKeys === 7 && !passport.cid) {
      valid++;
    }
  }

  return valid;
};

const partTwo = (passports) => {
  let valid = 0;

  for (let i = 0; i < passports.length; i++) {
    const passport = passports[i];
    
    if (passport.numKeys >= 8 && validValues(passport)) {
      valid++;
    } else if (passport.numKeys === 7 && !passport.cid && validValues(passport)) {
      valid++;
    }
  }

  return valid;
};

const passports = getPassports('4.txt');
console.log('Part one:', partOne(passports));
console.log('Part two:', partTwo(passports));
