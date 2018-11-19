import { existsSync, readdirSync, readFile, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const writeFilePromise = promisify(writeFile);
const readFilePromise = promisify(readFile);

// get all the concrete schemas
async function getCompiledSchemas() {
  const schemaDir = 'schemas';
  const excludedFiles = new Set(['enums.json', 'numbers.json', 'strings.json']);

  const schemaDefinitions = await Promise.all(
    readdirSync(schemaDir, 'utf8')
      .filter(file => !excludedFiles.has(file))
      .map(file => readFilePromise(join(schemaDir, file), 'utf8'))
  );

  // Sort alphabetically for simplicity
  return schemaDefinitions
    .map(x => JSON.parse(x))
    .sort((a,b) => (a.$id > b.$id) ? 1 : ((b.$id > a.$id) ? -1 : 0));
}

async function appendToDistFile(filename: string, contents: string) {
  const DIST_DIR = 'dist';
  const path = join(DIST_DIR, filename)

  if (existsSync(path)) {
    const existingContents = await readFilePromise(path, 'utf8')
    contents = [ existingContents, contents ].join('\n');
  }

  await writeFilePromise(path, contents, 'utf8')
}

(async function() {
  const exportedTypes = await getCompiledSchemas();

  const types = exportedTypes
    .reduce((acc, type) => {
      const name = type.$id.replace(/\.json$/, '')

      // schemas with a manuscriptID property
      if (type.properties.manuscriptID) {
        acc.manuscriptIDTypes.push(name);
      }

      // schemas with a containerID property
      if (type.properties.containerID) {
        acc.containerIDTypes.push(name);
      }

      // All schemas (for ObjectTypes lookup)
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

  // write js file
  await appendToDistFile('lookup.js',
`"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manuscriptIDTypes = new Set(${JSON.stringify(types.manuscriptIDTypes)});
exports.containerIDTypes = new Set(${JSON.stringify(types.containerIDTypes)});
var ObjectTypes;
(function (ObjectTypes) {
    ${types.types.map((t: any) => 'ObjectTypes["' + SNAKE_CASE(t) + '"] = "MP' + t + '";').join('\n    ')}
})(ObjectTypes = exports.ObjectTypes || (exports.ObjectTypes = {}));`)

  // write a typescript declaration
  await appendToDistFile('lookup.d.ts',
`export declare const manuscriptIDTypes: Set<string>;
export declare const containerIDTypes: Set<string>;
export declare enum ObjectTypes {
    ${types.types.map((t: any) => SNAKE_CASE(t) + ' = "MP' + t + '"').join(',\n    ')}
}`)

  // append an export to these types in the index.d.ts file
  await appendToDistFile('index.d.ts', "export { manuscriptIDTypes, containerIDTypes, ObjectTypes } from './lookup';")

  // append an export to these types in the index.d.ts file
  await appendToDistFile('index.js',
`const lookup_1 = require("./lookup");
exports.manuscriptIDTypes = lookup_1.manuscriptIDTypes;
exports.containerIDTypes = lookup_1.containerIDTypes;
exports.ObjectTypes = lookup_1.ObjectTypes;`)
})()
