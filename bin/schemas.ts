/*!
 * © 2023 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as merge from 'deepmerge';
import { promises as fs } from 'fs';
import * as path from 'path';

interface Source {
  $ref: string;
}

interface Mash {
  sources: Source[];
  with: JsonSchema;
}

export interface JsonSchema {
  $id: string;
  title?: string;
  $mash?: Mash;
  additionalProperties: boolean;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

async function mash(schema: JsonSchema) {
  const { additionalProperties } = schema;
  if (schema.$mash) {
    const { sources } = schema.$mash;
    const merged = await sources.reduce(
      async ($acc: Promise<JsonSchema>, source: Source) => {
        const acc = await $acc;
        const schemaId = source.$ref.slice(0, -1);
        const schema = await getSchema(schemaId);
        const { objectType } = acc.properties;
        const merged = merge<JsonSchema>(schema, acc);
        // We don't want array merging for this enum.
        if (objectType) {
          merged.properties.objectType = objectType;
        }
        return merged;
      },
      Promise.resolve(schema.$mash.with)
    );
    merged.$id = schema.$id;
    merged.title = schema.title;
    if (additionalProperties) {
      merged.additionalProperties = additionalProperties;
    }
    return merged;
  }
  return schema;
}

async function getSchema(id: string): Promise<JsonSchema> {
  const file = path.join('schemas_src', id);
  const content = await fs.readFile(file, 'utf8');
  return await mash(JSON.parse(content));
}

async function getSchemas(directory: string): Promise<JsonSchema[]> {
  const dir = path.join('schemas_src', directory);
  const files = await fs.readdir(dir, 'utf8');
  return await Promise.all(
    files.map(async (name) => await getSchema(path.join(directory, name)))
  );
}

export const scalars = getSchemas('scalars');
export const abstract = getSchemas('abstract');
export const concrete = getSchemas('concrete');
export const schemas = Promise.all([scalars, abstract, concrete]).then((a) =>
  a.flat()
);
