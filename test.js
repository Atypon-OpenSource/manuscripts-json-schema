const fs = require('fs');
const { ajv, validate } = require('./validate');

const data = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));

const findType = (objects, type) => objects.find(x => x.objectType === type);

const hax = (obj) => {
  [ 'locked', 'collection' ].forEach(key => {
    delete obj[key];
  });

  return obj;
};

const tests = [
  hax(findType(data.sections, 'MPSection')),
  findType(data.sections, 'MPParagraphElement'),
  // hax(findType(data.manuscript, 'MPParagraphStyle'))
];

const valid = validate(tests);

if (!valid) {
  console.log('FAIL ✗');
  console.log(validate.errors);
} else {
  console.log('PASS ✓');
}
