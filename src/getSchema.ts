import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SCHEMA_DIR = 'schemas';
const SCHEMA_SRC_DIR = 'schemas_src';

export interface JsonSchema {
  [key: string]: any;
}

export function getSchema(name: string, directory?: string): JsonSchema {
  const schemaPath = join(
    __dirname,
    '..',
    SCHEMA_SRC_DIR,
    directory || '',
    name
  );
  const file = readFileSync(schemaPath, 'utf8');
  return JSON.parse(file);
}

export function getSchemas(directory: string) {
  const schemasPath = join(__dirname, '..', SCHEMA_SRC_DIR, directory);
  const files = readdirSync(schemasPath, 'utf8');
  return files.map(name => getSchema(name, directory));
}

export function getBuiltSchemas() {
  const schemasPath = join(__dirname, '..', SCHEMA_DIR);
  const files = readdirSync(schemasPath, 'utf8');
  return files.map((filename: string) => {
    const schemaPath = join(__dirname, '..', SCHEMA_DIR, filename);
    const file = readFileSync(schemaPath, 'utf8');
    return JSON.parse(file);
  });
}
