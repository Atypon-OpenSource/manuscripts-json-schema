import * as Ajv from 'ajv';
import { supportedObjectTypes } from './schemas';
import { getBuiltSchemas } from './getSchema';

const ajv = new Ajv();
getBuiltSchemas().forEach(schema => ajv.addSchema(schema))

// TODO: the return value of this is confusing.
export function validate(obj: any): Array<Ajv.ErrorObject> | null {
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
    return validate.errors || null;
  }
}
