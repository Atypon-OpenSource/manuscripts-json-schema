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

// Fast way to ascertain if we support this objectType.
const supportedObjectTypes = new Set();

// Add them (after a MASH).
derivedSchemas.forEach(schema => {
  const mashedSchema = mash(schema);
  ajv.addSchema(mashedSchema);
  supportedObjectTypes.add(schema.$id);
});

// TODO: the return value of this is currently: Option<Array<Error>>
// I'm pretty sure this is confusing.
function validate(obj) {
  if (!obj || !obj.objectType) {
    throw 'InvalidOperation';
  }

  const schemaId = obj.objectType + '.json';

  // Quick lookup
  if (!supportedObjectTypes.has(schemaId)) {
    throw 'Unsupported schema: ' + schemaId;
  }

  // Run obj against schema in ajv.
  const valid = ajv.validate(schemaId, obj);

  if (valid) {
    return null;
  } else {
    return ajv.errors;
  }
}

module.exports = { validate };
