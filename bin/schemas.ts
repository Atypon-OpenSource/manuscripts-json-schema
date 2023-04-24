import { promises as fs } from 'fs';
import * as path from 'path';
import * as merge from 'deepmerge';

const SCHEMAS_DIR = 'schemas_src';

export interface JsonSchema {
  [key: string]: any;
}

async function mash(obj: any) {
  const { additionalProperties } = obj;
  if (obj.$mash) {
    const { sources } = obj.$mash;
    const merged = await sources.reduce(async (promise: Promise<any>, source: any) => {
      const acc = await promise;
      const schemaId = source.$ref.slice(0, -1);
      const schema = await getSchema(schemaId);
      const { objectType } = acc.properties;
      const merged = merge<any>(schema, acc);
      // We don't want array merging for this enum.
      if (objectType) {
        merged.properties.objectType = objectType;
      }
      return merged;
    }, Promise.resolve(obj.$mash.with));
    merged.$id = obj.$id;
    merged.title = obj.title;
    if (additionalProperties) {
      merged.additionalProperties = additionalProperties;
    }
    return merged;
  }
  return obj;
}

async function getSchema(id: string): Promise<JsonSchema> {
  const file = path.join(__dirname, '..', SCHEMAS_DIR, id);
  const content = await fs.readFile(file, 'utf8');
  return await mash(JSON.parse(content));
}

async function getSchemas(directory: string): Promise<JsonSchema[]> {
  const dir = path.join(__dirname, '..', SCHEMAS_DIR, directory);
  const files = await fs.readdir(dir, 'utf8');
  return await Promise.all(files.map(async name => await getSchema(path.join(directory, name))));
}


export const scalars = getSchemas('scalars');
export const abstract = getSchemas('abstract');
export const concrete = getSchemas('concrete');
export const schemas = Promise.all([scalars, abstract, concrete]).then(a => a.flat())