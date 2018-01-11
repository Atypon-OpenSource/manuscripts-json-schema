const fs = require('fs');
const { join } = require('path');
const Ajv = require('ajv');

const DEFINITION_DIR = 'definitions';

const definitions = fs.readdirSync(DEFINITION_DIR).map(path => {
  return JSON.parse(fs.readFileSync(join(DEFINITION_DIR, path), 'utf8'));
});

const ajv = new Ajv({
  schemaId: 'id',
  schemas: definitions
});

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

const data = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));

const getOfType = type => data.sections.find(x => x.objectType === type);

const section = getOfType('MPSection');

const valid = ajv.validate('mp-section.json', section);

if (!valid) {
  console.log(ajv.errors);
} else {
  console.log('Supposedly fine');
}
