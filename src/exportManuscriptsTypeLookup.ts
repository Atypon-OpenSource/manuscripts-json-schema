import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const writeFilePromise = promisify(writeFile);
const readFilePromise = promisify(readFile);

(async function() {
  const DIST_DIR = 'dist';
  const TYPES_TS = join(DIST_DIR, 'types.ts');
  const exportedTypes = await readFilePromise(TYPES_TS, 'utf8')

  const types = exportedTypes
    .split('\n\n')
    .filter(x => x.length)
    .sort()
    .reduce((acc, type) => {
      const match = type.match(/^export interface (.+)\s{/)
      if (match && match[1]) {
        const name = 'MP' + match[1];
        if (type.includes('manuscriptID: string')) {
          acc.manuscriptIDTypes.push(name)
        }

        if (type.includes('containerID: string')) {
          acc.containerIDTypes.push(name)
        }
      }

      return acc
    }, { manuscriptIDTypes: [] as string[], containerIDTypes: [] as string[] })

  const outputContents = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manuscriptIDTypes = new Set(${JSON.stringify(types.manuscriptIDTypes)});

exports.containerIDTypes = new Set(${JSON.stringify(types.containerIDTypes)});`

  await writeFilePromise(join(DIST_DIR, 'lookup.js'), outputContents, 'utf8')

  // write a typescript declaration
  const LOOKUP_D_TS = join(DIST_DIR, 'lookup.d.ts');
  await writeFilePromise(LOOKUP_D_TS, `
export declare const manuscriptIDTypes: Set<string>;
export declare const containerIDTypes: Set<string>;`, 'utf8')

  const INDEX_D_TS = join(DIST_DIR, 'index.d.ts');
  const existingIndexContents = await readFilePromise(INDEX_D_TS, 'utf8')
  const indexContents = [
    existingIndexContents,
    "export { manuscriptIDTypes, containerIDTypes } from './lookup';"
  ].join('\n');

  // append an export to these types in the index.d.ts file
  await writeFilePromise(INDEX_D_TS, indexContents, 'utf8')

})()
