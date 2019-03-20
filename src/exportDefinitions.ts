import mash from './mash';
import { join } from 'path';
import { readdirSync } from 'fs';
import { compile, compileFromFile } from 'json-schema-to-typescript';
import { appendToDistFile } from './exportUtils';
import { getSchemas } from './getSchema';

async function getCompiledSchemas() {
  const schemaDir = 'schemas';
  const excludedFiles = new Set(['numbers.json', 'strings.json']);

  return Promise.all(
    readdirSync(schemaDir, 'utf8')
      .filter(file => !excludedFiles.has(file))
      .map(file => {
        return compileFromFile(join(schemaDir, file), {
          cwd: schemaDir,
          bannerComment: '',
        });
      })
  );
}

async function getAbstractSchemas() {
  return Promise.all(
    getSchemas('abstract')
      .map(mash)
      .map(schema => {
        return compile(schema, schema.$id, {
          cwd: 'schemas',
          bannerComment: '',
        });
      })
  );
}

(async function() {
  await appendToDistFile('index.d.ts', 'types', "export * from './types';");

  const schemas = await getCompiledSchemas();
  const abstracts = await getAbstractSchemas();

  const contents = await Promise.all(
    schemas.concat(abstracts).map(definition => {
      // this is the best approach because the `objectType` has to match the mac.
      return definition.replace(/^export\sinterface\sM[Pp]/, 'export interface ');
    })
  );

  await appendToDistFile('types.ts', 'types', contents.join('\n'));
})();
