const { join } = require('path');
const { readFileSync, readdirSync } = require('fs');

function getSchema(name, directory) {
  const schemaPath = join('definitions', directory || '', name);
  const file = readFileSync(schemaPath, 'utf8');
  return JSON.parse(file);
}

function getSchemas(directory) {
  const schemasPath = join('definitions', directory);
  const files = readdirSync(schemasPath, 'utf8');
  return files.map(name => getSchema(name, directory));
}

module.exports = {
  getSchema,
  getSchemas
};
