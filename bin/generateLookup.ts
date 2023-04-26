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
import * as path from 'path';

import { concrete } from './schemas';

export async function generateLookup() {
  const template = await fs.readFile(
    path.join('bin', 'lookup.template.ts'),
    'utf-8'
  );

  const schemas = await concrete;

  const manuscriptIdTypes: string[] = [];
  const containerIdTypes: string[] = [];
  const objectTypes: { [key: string]: string } = {};

  for (const schema of schemas) {
    const id = schema.$id.replace(/\.json$/, '');
    if (schema.properties['manuscriptID']) {
      manuscriptIdTypes.push(id);
    }
    if (schema.properties['containerID']) {
      containerIdTypes.push(id);
    }
    objectTypes[id] = id.replace(/^MP/, '');
  }

  const manuscriptIdTypesSer = manuscriptIdTypes
    .sort()
    .map((t) => "'" + t + "'")
    .join(', ');
  const containerIdTypesSer = containerIdTypes
    .sort()
    .map((t) => "'" + t + "'")
    .join(', ');
  const objectTypesSer = Object.entries(objectTypes)
    .map((e) => `  ${e[1]} = '${e[0]}'`)
    .join(',\n');

  let code = template;
  code = code.replace("'$$MANUSCRIPT_ID_TYPES'", `[${manuscriptIdTypesSer}]`);
  code = code.replace("'$$CONTAINER_ID_TYPES'", `[${containerIdTypesSer}]`);
  code = code.replace("'$$OBJECT_TYPES'", objectTypesSer);

  const output = path.join('src', 'lookup.ts');
  await fs.writeFile(output, code);
}
