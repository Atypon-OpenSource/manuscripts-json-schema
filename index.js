const fs = require('fs');
const { join } = require('path');
const Ajv = require('ajv');
const ajvMergeFeature = require('ajv-merge-patch/keywords/merge');

const ajv = new Ajv();
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
ajvMergeFeature(ajv);

const DEFINITION_DIR = 'definitions';

fs.readdirSync(DEFINITION_DIR).forEach(path => {
  const schemaPath = join(DEFINITION_DIR, path);
  const file = fs.readFileSync(schemaPath, 'utf8');
  ajv.addSchema(JSON.parse(file));
});

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
  [
    'mp-paragraph-style.json',
    'MPParagraphStyle',
    findType(data.manuscript, 'MPParagraphStyle')
  ],
].forEach(args => testType(...args));
