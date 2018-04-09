import { join } from 'path';
import { readdirSync, writeFileSync } from 'fs';
import { compileFromFile } from 'json-schema-to-typescript';

const SCHEMA_DIR = 'schemas';
const DEFINITION_DIR = 'definitions';

for (const file of readdirSync(SCHEMA_DIR, 'utf8')) {
  compileFromFile(join(SCHEMA_DIR, file), { cwd: SCHEMA_DIR })
    .then(ts => {
      const path = join(DEFINITION_DIR, `${file.replace('.json', '')}.d.ts`);
      writeFileSync(path, ts)
    })
}
