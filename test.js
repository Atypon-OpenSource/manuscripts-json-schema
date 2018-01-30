const fs = require('fs');
const { validate } = require('./validate');

const data = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));

const findType = (objects, type) => objects.find(x => x.objectType === type);

const hax = (obj) => {
  [ 'locked', 'collection' ].forEach(key => {
    delete obj[key];
  });
  return obj;
};

[
  hax(findType(data.sections, 'MPSection')),
  hax(findType(data.sections, 'MPParagraphElement')),
  hax(findType(data.manuscript, 'MPParagraphStyle'))
].forEach(obj => {
  const valid = validate(obj);

  if (valid) {
    console.log('PASS ✓');
  } else {
    console.log('FAIL ✗');
    console.log(valid);
  }
});

