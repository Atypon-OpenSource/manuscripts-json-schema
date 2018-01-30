const { join } = require('path');
const { readFileSync } = require('fs');

function getSchema(name) {
  const schemaPath = join('definitions', name);
  const file = readFileSync(schemaPath, 'utf8');
  return JSON.parse(file);
}

module.exports = getSchema;
