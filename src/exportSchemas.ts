import { writeFileSync } from 'fs';
import { join } from 'path';
import { schemas } from './schemas';

for (const schema of schemas) {
  const path = join(__dirname, '..', 'schemas', schema.$id);
  writeFileSync(path, JSON.stringify(schema, null, 2), 'utf8');
}
