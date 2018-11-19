import { readdirSync, readFile, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const writeFilePromise = promisify(writeFile);
const readFilePromise = promisify(readFile);

async function getCompiledSchemas() {
  const schemaDir = 'schemas';
  const excludedFiles = new Set(['enums.json', 'numbers.json', 'strings.json']);

  const schemaDefinitions = await Promise.all(
    readdirSync(schemaDir, 'utf8')
      .filter(file => !excludedFiles.has(file))
      .map(file => readFilePromise(join(schemaDir, file), 'utf8'))
  );

  return schemaDefinitions
    .map(x => JSON.parse(x))
    .sort((a,b) => (a.$id > b.$id) ? 1 : ((b.$id > a.$id) ? -1 : 0));
}

(async function() {
  const DIST_DIR = 'dist';
  const exportedTypes = await getCompiledSchemas();

  const types = exportedTypes
    .reduce((acc, type) => {
      const name = type.$id.replace(/\.json$/, '')

      if (type.properties.manuscriptID) {
        acc.manuscriptIDTypes.push(name);
      }

      if (type.properties.containerID) {
        acc.containerIDTypes.push(name);
      }

      acc.types.push(name.replace(/^MP/, ''));

      return acc
    },
    {
      manuscriptIDTypes: [] as string[],
      containerIDTypes: [] as string[],
      types: [] as string[]
    })

  const SNAKE_CASE = (str: string) => {
    return str.replace(/[A-Z]+(?=[A-Z])|[A-Z]/g, (match, pos) => {
        return (pos ? '_' : '') + match
      })
      .toUpperCase()
  }

  const outputContents = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manuscriptIDTypes = new Set(${JSON.stringify(types.manuscriptIDTypes)});
exports.containerIDTypes = new Set(${JSON.stringify(types.containerIDTypes)});
var ObjectTypes;
(function (ObjectTypes) {
    ${types.types.map((t: any) => 'ObjectTypes["' + SNAKE_CASE(t) + '"] = "MP' + t + '";').join('\n    ')}
})(ObjectTypes = exports.ObjectTypes || (exports.ObjectTypes = {}));`

  await writeFilePromise(join(DIST_DIR, 'lookup.js'), outputContents, 'utf8')

  // write a typescript declaration
  const LOOKUP_D_TS = join(DIST_DIR, 'lookup.d.ts');
  await writeFilePromise(LOOKUP_D_TS,
  `export declare const manuscriptIDTypes: Set<string>;
export declare const containerIDTypes: Set<string>;
export declare enum ObjectTypes {
    ${types.types.map((t: any) => SNAKE_CASE(t) + ' = "MP' + t + '"').join(',\n    ')}
}
`, 'utf8')

  const INDEX_D_TS = join(DIST_DIR, 'index.d.ts');
  const existingIndexDefinitionContents = await readFilePromise(INDEX_D_TS, 'utf8')
  const indexDefinitionContents = [
    existingIndexDefinitionContents,
    "export { manuscriptIDTypes, containerIDTypes, ObjectTypes } from './lookup';"
  ].join('\n');

  // append an export to these types in the index.d.ts file
  await writeFilePromise(INDEX_D_TS, indexDefinitionContents, 'utf8')

  const INDEX_JS = join(DIST_DIR, 'index.js');
  const existingIndexContents = await readFilePromise(INDEX_JS, 'utf8')
  const indexContents = [
    existingIndexContents,
`const lookup_1 = require("./lookup");
exports.manuscriptIDTypes = lookup_1.manuscriptIDTypes;
exports.containerIDTypes = lookup_1.containerIDTypes;
exports.ObjectTypes = lookup_1.ObjectTypes;`
  ].join('\n');

  // append an export to these types in the index.d.ts file
  await writeFilePromise(INDEX_JS, indexContents, 'utf8')
})()
