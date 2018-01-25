const { ajv } = require('./validate');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));

function testType(schema, type, object) {
  const valid = ajv.validate(schema, object);

  if (!valid) {
    console.log(type + ': ✗');
    console.log(ajv.errors);
  } else {
    console.log(type + ': ✓');
  }
}

const findType = (objects, type) => objects.find(x => x.objectType === type);

[
  [
    'mp-section.json',
    'MPSection',
    findType(data.sections, 'MPSection')
  ],
  [
    'mp-paragraph-element.json',
    'MPParagraphElement',
    findType(data.sections, 'MPParagraphElement')
  ],
  // [
    // 'mp-paragraph-style.json',
    // 'MPParagraphStyle',
    // findType(data.manuscript, 'MPParagraphStyle')
  // ],
].forEach(args => testType(...args));
