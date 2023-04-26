import { concrete, scalars } from './schemas';

import Ajv from 'ajv';
import standalone from 'ajv/dist/standalone';
import * as path from 'path';
import { promises as fs } from 'fs';

export async function generateValidators() {
    const schemas = [...(await scalars), ...(await concrete)];

    const refs = schemas.reduce((refs, schema) => {
        const id = schema.$id;
        const key = id.endsWith('.json') ? id.slice(0, -5) : id;
        //@ts-ignore
        refs[key] = id;
        return refs;
    }, {});

    const cjsAvj = new Ajv({schemas: schemas, code: {source: true, lines: true}});
    const cjs = standalone(cjsAvj, refs)
    await fs.writeFile(path.join('dist', 'cjs', 'validators.js'), cjs);

    const esmAvj = new Ajv({schemas: schemas, code: {esm: true, source: true, lines: true}});
    const esm = standalone(esmAvj, refs)
    await fs.writeFile(path.join('dist', 'es', 'validators.js'), esm);
}