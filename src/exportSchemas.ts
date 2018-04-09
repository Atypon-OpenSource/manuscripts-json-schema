import { writeFileSync } from 'fs';
import { join } from 'path';
import { schemas } from './validate';

const outDir = 'definitions';

console.warn('Writing schemas to:', outDir);

for (const schema of schemas) {
  const path = join(__dirname, '..', outDir, schema.$id);
  console.log('Writing schema to:', path);
  writeFileSync(path, JSON.stringify(schema, null, 2), 'utf8');
}
