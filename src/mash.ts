const merge = require('deepmerge')
import { getSchema } from './getSchema';

export default function mash(obj: any) {
  const { additionalProperties } = obj;
  if (obj.$mash) {
    const { sources } = obj.$mash;
    const merged = sources.reduce((acc: any, source: any) => {
      const schemaId = source.$ref.slice(0, -1);
      const schema = getSchema(schemaId);
      const mashed = mash(schema);
      const { objectType } = acc.properties;
      const merged = merge(mashed, acc);
      // We don't want array merging for this enum.
      if (objectType) {
        merged.properties.objectType = objectType;
      }
      return merged;
    }, obj.$mash.with);
    merged.$id = obj.$id;
    merged.title = obj.title;
    if (additionalProperties) {
      merged.additionalProperties = additionalProperties;
    }
    return merged;
  }
  return obj;
}
