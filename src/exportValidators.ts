import { existsSync, readFile, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { validatorFn } from './pack';

const writeFilePromise = promisify(writeFile);
const readFilePromise = promisify(readFile);

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
  const manuscriptsFn = validatorFn()

  // TODO: it'd be great if we didn't have to hardcode dependencies
  // e.g. referenced schemas like MPBibliographicDate and MPBibliographicName
  // that are used by MPBibliographyItem
  const fusionSchemas = new Set([
    'MPBibliographicName.json',
    'MPBibliographicDate.json',
    'MPBibliographyItem.json',
    'MPLibrary.json',
    'MPLibraryCollection.json',
    'MPUserProfile.json',
    'MPPerson.json',
    'MPContributorCategory.json',
    'MPGrant.json',
    'MPFundingBody.json',
    'MPAffiliation.json'
  ])

  const fusionFn = validatorFn(id => fusionSchemas.has(id))

  // write js file
  await appendToDistFile('validators.js',
`"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fusionFn = String.raw\`${fusionFn}\`;
exports.manuscriptsFn = String.raw\`${manuscriptsFn};\``)

  // write a typescript declaration
  await appendToDistFile('validators.d.ts',
`export declare const manuscriptsFn: string;
export declare const fusionFn: string;`)

  // append an export to these types in the index.d.ts file
  await appendToDistFile('index.d.ts', "export { manuscriptsFn, fusionFn } from './validators';")

  // append an export to the code in the index.js file
  await appendToDistFile('index.js',
`const validators_1 = require("./validators");
exports.fusionFn = validators_1.fusionFn;
exports.manuscriptsFn = validators_1.manuscriptsFn;`)
})()
