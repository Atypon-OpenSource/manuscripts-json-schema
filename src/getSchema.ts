const { join } = require('path');
import { readFileSync, readdirSync } from 'fs';

const SCHEMA_DIR = 'schemas';
const SCHEMA_SRC_DIR = 'schemas_src';

export function getSchema(name: string, directory?: string) {
  const schemaPath = join(__dirname, '..', SCHEMA_SRC_DIR, directory || '', name);
  const file = readFileSync(schemaPath, 'utf8');
  return JSON.parse(file);
}

export function getSchemas(directory: string) {
  return _getSchemas(SCHEMA_SRC_DIR, directory);
}

export function getBuiltSchemas() {
  return _getSchemas(SCHEMA_DIR);
}

function _getSchemas(srcDirectory: string, directory?: string) {
  const schemasPath = join(__dirname, '..', srcDirectory, directory || '');
  const files = readdirSync(schemasPath, 'utf8');
  return files.map(name => getSchema(name, directory));
}
