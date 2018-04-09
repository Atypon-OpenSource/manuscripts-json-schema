import * as Ajv from 'ajv';
import mash from './mash';
import { getSchemas } from './getSchema';

export const ajv = new Ajv({ sourceCode: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

// Get all basic scalar schemas.
const scalarSchemas = getSchemas('scalars');

// We can just add scalar schemas to ajv.
scalarSchemas.forEach(schema => ajv.addSchema(schema))

// Get all the schemas we actually care about.
const concreteSchemas = getSchemas('concrete');

// Mash them (recursively merge).
const mashedSchemas = concreteSchemas.map(mash);

mashedSchemas.forEach(schema => ajv.addSchema(schema));

// Fast way to ascertain if we support this objectType.
export const supportedObjectTypes = new Set<string>(mashedSchemas.map(x => x.$id));


const sortObject = (obj: any) =>
  Object.keys(obj).sort().reduce((acc: any, k) => (acc[k] = obj[k], acc), {});

export const schemas = [...scalarSchemas, ...mashedSchemas].map(sortObject);

// TODO: the return value of this is currently: Option<Array<Error>>
// I'm pretty sure this is confusing.
export function validate(obj: any) {
  if (!obj || !obj.objectType) {
    throw 'InvalidOperation';
  }

  const schemaId = obj.objectType + '.json';

  // Quick lookup
  if (!supportedObjectTypes.has(schemaId)) {
    throw 'Unsupported schema: ' + schemaId;
  }

  // Get schema from ajv.
  const validate = ajv.getSchema(schemaId);
  // Run obj against schema in ajv.
  const valid = validate(obj);

  if (valid) {
    return null;
  } else {
    return validate.errors;
  }
}
