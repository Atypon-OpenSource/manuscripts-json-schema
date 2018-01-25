const fs = require('fs');
const { join } = require('path');
const Ajv = require('ajv');
const ajvMergeFeature = require('ajv-merge-patch/keywords/merge');

const ajv = new Ajv({ sourceCode: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
ajvMergeFeature(ajv);

const DEFINITION_DIR = 'definitions';

const schemas = new Map();

// add all the schemas
fs.readdirSync(DEFINITION_DIR).forEach(path => {
  const schemaPath = join(DEFINITION_DIR, path);
  const file = fs.readFileSync(schemaPath, 'utf8');
  const schema = JSON.parse(file);
  schemas.set(path, schema);
  ajv.addSchema(schema);
});

module.exports = {
  ajv,
  schemas
};
