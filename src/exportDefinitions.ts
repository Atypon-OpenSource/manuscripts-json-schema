import mash from './mash';
import { join } from 'path';
import { promisify } from 'util';
import { existsSync, readdirSync, writeFile, readFile } from 'fs';
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
  await appendToDistFile('index.d.ts', "export * from './types';");

  const schemas = await getCompiledSchemas();
  const abstracts = await getAbstractSchemas();

  const contents = await Promise.all(
    schemas.concat(abstracts).map(definition => {
      // this is the best approach because the `objectType` has to match the mac.
      return definition.replace(/^export\sinterface\sMp/, 'export interface ');
    })
  );

  await appendToDistFile('types.ts', contents.join('\n'))
})()
