const fs = require('fs');
const { validate } = require('./validate');

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

const data = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));

const getTypes = (objects, type) => {
  return objects
    .filter(x => x.objectType === type)
    .map(hax);
}

[].concat(
  getTypes(data.sections, 'MPSection'),
  getTypes(data.sections, 'MPParagraphElement'),
  getTypes(data.manuscript, 'MPParagraphStyle'),
  getTypes(data.manuscript, 'MPBorderStyle'),
  getTypes(data.manuscript, 'MPAuxiliaryObjectReferenceStyle'),
  getTypes(data.manuscript, 'MPCaptionStyle'),
  getTypes(data.manuscript, 'MPColor'),
  getTypes(data.manuscript, 'MPFigureLayout'),
  getTypes(data.manuscript, 'MPFigureStyle'),
  getTypes(data.manuscript, 'MPPageLayout'),
  getTypes(data.manuscript, 'MPColorScheme'),
  getTypes(data.manuscript, 'MPAffiliation')
).forEach(obj => {
  const valid = validate(obj);

  if (Array.isArray(valid)) {
    console.log('');
    console.log(`FAIL(${obj._id}) ✗`);
    console.log(valid);
    console.log('');
  } else {
    console.log(`PASS(${obj._id}) ✓`);
  }
});
