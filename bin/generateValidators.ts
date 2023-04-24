import Ajv from 'ajv';
import { concrete, scalars } from './schemas';
import standalone from 'ajv/dist/standalone';
import path from "path";
import {promises as fs} from "fs";

const DIST_DIR = 'dist';

async function appendToDistFile(filename: string, directory: string, contents: string) {
    const dir = path.join(DIST_DIR, directory);
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, filename);
    await fs.appendFile(file, contents, 'utf-8');
}

export async function generateValidators() {
    const schemas = [...(await scalars), ...(await concrete)];

    const refs = schemas.reduce((refs, schema) => {
        const id = schema.$id;
        const key = id.endsWith('.json') ? id.slice(0, -5) : id;
        refs[key] = id;
        return refs;
    }, {});

    const cjsAvj = new Ajv({schemas: schemas, strict: false, code: {source: true, lines: true}});
    const cjs = standalone(cjsAvj, refs)
    await appendToDistFile('validators.js', 'cjs', cjs);

    const esmAvj = new Ajv({schemas: schemas, strict: false, code: {esm: true, source: true, lines: true}});
    const esm = standalone(esmAvj, refs)
    await appendToDistFile('validators.js', 'es', esm);
}