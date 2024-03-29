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
import { promises as fs } from 'fs';
import { compile } from 'json-schema-to-typescript';
import * as path from 'path';

import { abstract, concrete, JsonSchema, schemas } from './schemas';

function normalize(schema: JsonSchema) {
  const clone = Object.assign({}, schema);
  clone.$id = schema.$id.replace(/^MP/, '').replace(/\.json/, '');
  return clone;
}

async function getSchema(id: string) {
  const schema = (await schemas).filter((s) => s.$id === id)[0];
  return normalize(schema);
}

async function compileSchema(schema: JsonSchema) {
  schema = normalize(schema);
  return await compile(schema, '', {
    bannerComment: '',
    unknownAny: false,
    declareExternallyReferenced: false,
    $refOptions: {
      resolve: {
        file: {
          read: (file) => {
            const name = path.basename(file.url);
            return getSchema(name);
          },
        },
      },
    },
  });
}

export async function generateTypes() {
  const schemas = [...(await abstract), ...(await concrete)];
  const contents = await Promise.all(
    schemas.map((schema) => compileSchema(schema))
  );
  await fs.writeFile(path.join('src', 'types.ts'), contents);
}
