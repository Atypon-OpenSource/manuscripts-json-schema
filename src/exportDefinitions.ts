import mash from './mash';
import { join } from 'path';
import { promisify } from 'util';
import { readdirSync, writeFile, readFile } from 'fs';
import { compile, compileFromFile } from 'json-schema-to-typescript';
import { getSchemas } from './getSchema';

const writeFilePromise = promisify(writeFile);
const readFilePromise = promisify(readFile);

async function getCompiledSchemas() {
  const schemaDir = 'schemas';
  const excludedFiles = new Set(['numbers.json', 'strings.json']);

  const schemaDefinitions = await Promise.all(
    readdirSync(schemaDir, 'utf8')
      .filter(file => !excludedFiles.has(file))
      .map(file => {
        return compileFromFile(join(schemaDir, file), {
          cwd: schemaDir,
          bannerComment: ''
        })
      })
  );

  return schemaDefinitions;
}

async function getAbstractSchemas() {
  return Promise.all(
    getSchemas('abstract')
      .map(mash)
      .map(schema => {
        return compile(schema, schema.$id, {
          cwd: 'schemas',
          bannerComment: ''
        })
      })
  );
}

(async function() {
  const DIST_DIR = 'dist';

  const INDEX_D_TS = join(DIST_DIR, 'index.d.ts');
  const existingIndexContents = await readFilePromise(INDEX_D_TS, 'utf8')
  const indexContents = [
    existingIndexContents,
    "export * from './types';"
  ].join('\n');

  // append an export to these types in the index.d.ts file
  await writeFilePromise(INDEX_D_TS, indexContents, 'utf8')

  const schemas = await getCompiledSchemas();
  const abstracts = await getAbstractSchemas();

  const contents = await Promise.all(
    schemas.concat(abstracts).map(definition => {
      // this is the best approach because the `objectType` has to match the mac.
      return definition.replace(/^export\sinterface\sMp/, 'export interface ');
    })
  );

  await writeFilePromise(join(DIST_DIR, 'types.ts'), contents.join('\n'), 'utf8')
})()
