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
// const data = JSON.parse(fs.readFileSync('rnap.json', 'utf8'));

const getTypes = (type, objects) => {
  return objects
    .filter(x => x.objectType === type)
    .map(hax);
}

[].concat(
  getTypes('MPAffiliation', data.manuscript),
  getTypes('MPAuxiliaryObjectReference', data.manuscript),
  getTypes('MPAuxiliaryObjectReferenceStyle', data.manuscript),
  getTypes('MPBorderStyle', data.manuscript),
  getTypes('MPCaptionStyle', data.manuscript),
  getTypes('MPColor', data.manuscript),
  getTypes('MPColorScheme', data.manuscript),
  getTypes('MPFigureLayout', data.manuscript),
  getTypes('MPFigureStyle', data.manuscript),
  getTypes('MPPageLayout', data.manuscript),
  getTypes('MPParagraphElement', data.sections),
  getTypes('MPParagraphStyle', data.manuscript),
  getTypes('MPSection', data.sections)
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
