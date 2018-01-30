const fs = require('fs');
const Ajv = require('ajv');
const mash = require('./mash');
const { getSchema, getSchemas } = require('./getSchema');

const ajv = new Ajv({ sourceCode: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

// We can just add scalar schemas to ajv.
getSchemas('scalars').forEach(schema => ajv.addSchema(schema));

// Get all the schemas we actually care about.
const derivedSchemas = getSchemas('derived');

// Add them (after a MASH).
derivedSchemas.forEach(schema => ajv.addSchema(mash(schema)));

// Lets build a master schema which accepts any of the derived schemas.
const mainSchema = {
  $id: 'schema.json',
  type: 'array',
  items: {
    anyOf: derivedSchemas.map(name => ({ $ref: `${name.$id}#` }))
  }
};

const validate = ajv.compile(mainSchema);

module.exports = { ajv, validate };
