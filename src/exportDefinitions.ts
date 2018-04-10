import { join } from 'path';
import { promisify } from 'util';
import { readdirSync, writeFile, readFile } from 'fs';
import { compileFromFile } from 'json-schema-to-typescript';

const writeFilePromise = promisify(writeFile);
const readFilePromise = promisify(readFile);

const SCHEMA_DIR = 'schemas';
const DIST_DIR = 'dist';
const INDEX_D_TS = join(DIST_DIR, 'index.d.ts');
const TYPES_D_TS = join(DIST_DIR, 'types.ts');

Promise.all(readdirSync(SCHEMA_DIR, 'utf8').map(file => {
  return compileFromFile(join(SCHEMA_DIR, file), {
    cwd: SCHEMA_DIR,
    bannerComment: ''
  });
})).then(definitions => {
  return writeFilePromise(TYPES_D_TS, definitions.join('\n'), 'utf8')
    .then(() => readFilePromise(INDEX_D_TS, 'utf8'))
    .then((indexContents: string) => {
      const contents = [
        indexContents,
        'export * from \'./types\';'
      ].join('\n');
      return writeFilePromise(INDEX_D_TS, contents, 'utf8')
    });
});
