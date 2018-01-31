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
    'priority',
    'prototype' // this one seems to be an id
  ].forEach(key => {
    delete obj[key];
    for (const k in obj) {
      if (typeof obj[k] === 'object') {
        hax(obj[k]);
      }
    }
  });
  return obj;
};

[
  hax(findType(data.sections, 'MPSection')),
  hax(findType(data.sections, 'MPParagraphElement')),
  hax(findType(data.manuscript, 'MPParagraphStyle')),
  hax(findType(data.manuscript, 'MPBorderStyle')),
  hax(findType(data.manuscript, 'MPAuxiliaryObjectReferenceStyle')),
  hax(findType(data.manuscript, 'MPCaptionStyle')),
  hax(findType(data.manuscript, 'MPColor')),
  hax(findType(data.manuscript, 'MPFigureLayout')),
  hax(findType(data.manuscript, 'MPFigureStyle')),
  hax(findType(data.manuscript, 'MPPageLayout'))
].forEach(obj => {
  const valid = validate(obj);

  if (Array.isArray(valid)) {
    console.log('');
    console.log(`FAIL(${obj.objectType}) ✗`);
    console.log(valid);
    console.log('');
  } else {
    console.log(`PASS(${obj.objectType}) ✓`);
  }
});
