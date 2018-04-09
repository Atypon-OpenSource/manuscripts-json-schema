import { readdirSync, writeFileSync } from 'fs';
import { compileFromFile } from 'json-schema-to-typescript';

for (const file of readdirSync('definitions', 'utf8')) {
  compileFromFile(`definitions/${file}`, { cwd: 'definitions' })
    .then(ts => writeFileSync(`${file.replace('.json', '')}.d.ts`, ts))
}
