import * as Ajv from 'ajv';
import { generateSchemas } from './schemas';
import { getBuiltSchemas } from './getSchema';

const { supportedObjectTypes } = generateSchemas();

const ajv = new Ajv();
// Use the built schemas for consistency/correctness.
getBuiltSchemas().forEach((schema) => ajv.addSchema(schema));

// TODO: the return value of this is confusing.
export function validate(obj: any): Ajv.ErrorObject[] | null {
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
  /* @ts-ignore */
  const valid = validate(obj);

  if (valid) {
    return null;
  } else {
    /* @ts-ignore */
    return validate.errors || null;
  }
}
