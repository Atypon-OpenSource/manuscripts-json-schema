import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { schemas } from './schemas';

const schemaDir = join(__dirname, '..', 'schemas');

if (!existsSync(schemaDir)){
  mkdirSync(schemaDir);
}

for (const schema of schemas) {
  const path = join(schemaDir, schema.$id);
  writeFileSync(path, JSON.stringify(schema, null, 2), 'utf8');
}
