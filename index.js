const fs = require('fs');
const Ajv = require('ajv');
const schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'));

const ajv = new Ajv({schemaId: 'id'});

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

const data = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));
const valid = ajv.validate(schema, data);

if (!valid) {
  console.log(ajv.errors);
} else {
  console.log('Supposedly fine');
}
