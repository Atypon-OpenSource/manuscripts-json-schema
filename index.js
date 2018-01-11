const fs = require('fs');
const { join } = require('path');
const Ajv = require('ajv');

const DEFINITION_DIR = 'definitions';

const definitions = fs.readdirSync(DEFINITION_DIR).map(path => {
  return JSON.parse(fs.readFileSync(join(DEFINITION_DIR, path), 'utf8'));
});

const ajv = new Ajv({
  logger: false,
  schemaId: 'id',
  schemas: definitions
});

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

const data = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));

function testType(schema, type) {
  const valid = ajv.validate(
    schema,
    data.sections.find(x => x.objectType === type)
  );

  if (!valid) {
    console.log(ajv.errors);
  } else {
    console.log(type + ': ✓');
  }
}

[
  ['mp-section.json', 'MPSection'],
  ['mp-paragraph-element.json', 'MPParagraphElement'],
].forEach(args => testType(...args));
