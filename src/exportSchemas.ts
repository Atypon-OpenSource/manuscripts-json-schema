import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { generateSchemas } from './schemas';

const schemaDir = join(__dirname, '..', 'schemas');

if (!existsSync(schemaDir)) {
  mkdirSync(schemaDir);
}

const { schemas } = generateSchemas();

for (const schema of schemas) {
  const path = join(schemaDir, schema.$id);
  writeFileSync(path, JSON.stringify(schema, null, 2), 'utf8');
}
