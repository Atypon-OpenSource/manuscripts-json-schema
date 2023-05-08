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
import Ajv from 'ajv';
import standalone from 'ajv/dist/standalone';
import { promises as fs } from 'fs';
import * as path from 'path';

import { concrete, scalars } from './schemas';

export async function generateValidators() {
  const schemas = [...(await scalars), ...(await concrete)];

  const refs = schemas.reduce((refs, schema) => {
    const id = schema.$id;
    const key = id.endsWith('.json') ? id.slice(0, -5) : id;
    //@ts-ignore
    refs[key] = id;
    return refs;
  }, {});

  const cjsAvj = new Ajv({
    schemas: schemas,
    code: { source: true, lines: true },
  });
  const cjs = standalone(cjsAvj, refs);
  await fs.writeFile(path.join('dist', 'cjs', 'validators.js'), cjs);

  const esmAvj = new Ajv({
    schemas: schemas,
    code: { esm: true, source: true, lines: true },
  });
  const esm = standalone(esmAvj, refs);
  await fs.writeFile(path.join('dist', 'es', 'validators.js'), esm);
}
