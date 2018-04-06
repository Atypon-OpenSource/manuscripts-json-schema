const { join } = require('path');
import { readFileSync, readdirSync } from 'fs';

export function getSchema(name: string, directory?: string) {
  const schemaPath = join(__dirname, '..', 'definitions', directory || '', name);
  const file = readFileSync(schemaPath, 'utf8');
  return JSON.parse(file);
}

export function getSchemas(directory: string) {
  const schemasPath = join(__dirname, '..', 'definitions', directory);
  const files = readdirSync(schemasPath, 'utf8');
  return files.map(name => getSchema(name, directory));
}
