import { promises as fs } from 'fs';
import * as path from 'path';

import { generateValidators } from './generateValidators';
import { generateDefinitions } from './generateDefinitions';
import { generateTypeLookups } from './generateTypeLookups';

async function main() {
    await fs.mkdir('dist', { recursive: true });
    await fs.mkdir(path.join('dist', 'cjs'));
    await fs.mkdir(path.join('dist', 'es'));
    await fs.mkdir(path.join('dist', 'types'));
    await generateValidators();
    await generateDefinitions();
    await generateTypeLookups();
}

main().catch(e => console.log(e));