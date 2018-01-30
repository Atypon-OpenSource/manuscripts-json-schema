const fs = require('fs');
const { validate } = require('./validate');

const data = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));

const findType = (objects, type) => objects.find(x => x.objectType === type);

// These are properties I couldn't immediately make sense of:
const hax = (obj) => {
  [
    'bundled',
    'locked',
    'collection',
    'prototype' // this one seems to be an id
  ].forEach(key => {
    delete obj[key];
  });
  return obj;
};

[
  hax(findType(data.sections, 'MPSection')),
  hax(findType(data.sections, 'MPParagraphElement')),
  hax(findType(data.manuscript, 'MPParagraphStyle')),
  hax(findType(data.manuscript, 'MPBorderStyle'))
].forEach(obj => {
  const valid = validate(obj);

  if (Array.isArray(valid)) {
    console.log(`FAIL(${obj.objectType}) ✗`);
    console.log(valid);
  } else {
    console.log(`PASS(${obj.objectType}) ✓`);
  }
  console.log('\n');
});
