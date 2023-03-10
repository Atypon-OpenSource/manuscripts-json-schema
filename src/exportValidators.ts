import { appendToDistFile } from './exportUtils';
import { validatorFn } from './pack';
(async function() {
  const manuscriptsFn = validatorFn();

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
    'MPAffiliation.json',
    'MPCitationAlert.json',
    'MPMutedCitationAlert.json',
    'MPContribution.json',
    'MPDiscussionItem.json'
  ]);

  const fusionFn = validatorFn(id => fusionSchemas.has(id));

  const derivedDataSchemas = new Set([
    'MPUserCollaborator.json',
    'MPUserProfile.json',
    'MPBibliographicName.json',
    'MPGrant.json',
    'MPContributorCategory.json',
    'MPFundingBody.json',
    'MPProjectMemento.json',
    'MPProject.json',
    'MPSnapshot.json',
    'MPProjectSummary.json',
    'MPLibrarySummary.json',
    'MPLibraryCollectionSummary.json',
    'MPContribution.json',
  ]);

  const derivedDataFn = validatorFn(id => derivedDataSchemas.has(id));

  const discussionsDataSchemas = new Set([
      'MPDiscussionItem.json'
  ]);

  const discussionsFn = validatorFn(id => discussionsDataSchemas.has(id));

  // write (cjs) js file
  await appendToDistFile(
    'validators.js',
    'cjs',
    `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fusionFn = String.raw\`${fusionFn}\`;
exports.derivedDataFn = String.raw\`${derivedDataFn}\`;
exports.manuscriptsFn = String.raw\`${manuscriptsFn}\`;
exports.discussionsFn = String.raw\`${discussionsFn}\`;`
  );

  // write (cjs) js file
  await appendToDistFile(
    'validators.js',
    'es',
    `export const fusionFn = String.raw\`${fusionFn}\`;
export const derivedDataFn = String.raw\`${derivedDataFn}\`;
export const discussionsFn = String.raw\`${discussionsFn}\`;
export const manuscriptsFn = String.raw\`${manuscriptsFn};\``
  );

  // write a typescript declaration
  await appendToDistFile(
    'validators.d.ts',
    'types',
    `export declare const manuscriptsFn: string;
export declare const derivedDataFn: string;
export declare const discussionsFn: string;
export declare const fusionFn: string;`
  );

  // append an export to these types in the index.d.ts file
  await appendToDistFile(
    'index.d.ts',
    'types',
    "export * from './validators';"
  );

  // append an export to the code in the (cjs) index.js file
  await appendToDistFile(
    'index.js',
    'cjs',
    `const validators_1 = require("./validators");
exports.fusionFn = validators_1.fusionFn;
exports.derivedDataFn = validators_1.derivedDataFn;
exports.discussionsFn = validators_1.discussionsFn;
exports.manuscriptsFn = validators_1.manuscriptsFn;`
  );

  // append an export to the code in the (es) index.js file
  await appendToDistFile('index.js', 'es', "export * from './validators';");
})();
