const fs = require('fs');
const Ajv = require('ajv');
const schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'));
const sectionSchema = JSON.parse(fs.readFileSync('definitions/section.json', 'utf8'));

const ajv = new Ajv({
  schemaId: 'id',
  schemas: [ schema, sectionSchema ]
});

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

const data = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));

const valid = ajv.validate('base', data);

if (!valid) {
  console.log(ajv.errors);
} else {
  console.log('Supposedly fine');
}
