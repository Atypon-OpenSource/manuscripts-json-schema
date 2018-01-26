const fs = require('fs');
const { join } = require('path');
const Ajv = require('ajv');
const ajvMergeFeature = require('ajv-merge-patch/keywords/merge');
const deref = require('json-schema-deref-sync');

const ajv = new Ajv({ sourceCode: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
ajvMergeFeature(ajv);

const schemaPath = join('definitions', 'schema.json');
const file = fs.readFileSync(schemaPath, 'utf8');

const schema = deref(JSON.parse(file), {
  baseFolder: 'definitions',
  failOnMissing: true
});

ajv.addSchema(schema);

const validate = ajv.compile(schema);

module.exports = { ajv, validate };
