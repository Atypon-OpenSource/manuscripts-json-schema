import * as Ajv from 'ajv';
import mash from './mash';
import { bitmask } from './processors/scalars';
import { getSchemas, JsonSchema } from './getSchema';

export const generateSchemas = (filterFn?: (schemaId: string) => boolean) => {
  const ajv = new Ajv({ sourceCode: true });
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

  const pipeline = (fs: Array<(schema: JsonSchema) => JsonSchema>) => {
    return (schema: JsonSchema) => fs.reduce((acc, f) => f(acc), schema);
  };

  // Get all basic scalar schemas.
  const scalarSchemas = getSchemas('scalars').map(pipeline([bitmask]));

  // We can just add scalar schemas to ajv.
  scalarSchemas.forEach(schema => ajv.addSchema(schema));

  // Get all the schemas we actually care about.
  const concreteSchemas = getSchemas('concrete');

  // Mash them (recursively merge).
  const mashedSchemas = concreteSchemas
    .filter(schema => filterFn ? filterFn(schema.$id) : true)
    .map(mash);

  mashedSchemas.forEach(schema => ajv.addSchema(schema));

  // Fast way to ascertain if we support this objectType.
  const supportedObjectTypes = new Set<string>(mashedSchemas.map(x => x.$id));

  const sortObject = (obj: any) =>
    Object.keys(obj).sort().reduce((acc: any, k) => (acc[k] = obj[k], acc), {});

  const schemas = [...scalarSchemas, ...mashedSchemas].map(sortObject);

  return { supportedObjectTypes, schemas, ajv };
}
