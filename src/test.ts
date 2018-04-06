import { readFileSync } from 'fs';
import { join } from 'path';
import { validate } from './validate';

// These are properties I couldn't immediately make sense of:
const hax = (obj: any) => {
  [
    'bundled',
    'locked',
    'collection',
    'priority',
    'prototype' // this one seems to be an id
  ].forEach(key => {
    delete obj[key];
    for (const k in obj) {
      if (typeof obj[k] === 'object') {
        hax(obj[k]);
      }
    }
  });
  return obj;
};

const dataPath = join(__dirname, '..', 'dictionary.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const getTypes = (type: string, objects: any) => {
  return objects
    .filter((x: any) => x.objectType === type)
    .map(hax);
}

// These are not all implemented, and depend on being able to find objects of
// the type in whatever the `data` variable is.
[].concat(
  getTypes('MPAffiliation', data.manuscript),
  getTypes('MPAuxiliaryObjectReference', data.manuscript),
  getTypes('MPAuxiliaryObjectReferenceStyle', data.manuscript),
  getTypes('MPBibliographicDate', data.manuscript),
  getTypes('MPBibliographicName', data.manuscript),
  getTypes('MPBibliographyElement', data.manuscript),
  getTypes('MPBibliographyItem', data.manuscript),
  getTypes('MPBorder', data.manuscript),
  getTypes('MPBorderStyle', data.manuscript),
  getTypes('MPCaptionStyle', data.manuscript),
  getTypes('MPCitation', data.manuscript),
  getTypes('MPCitationItem', data.manuscript),
  getTypes('MPColor', data.manuscript),
  getTypes('MPColorScheme', data.manuscript),
  getTypes('MPContentSummary', data.manuscript),
  getTypes('MPContributor', data.manuscript),
  getTypes('MPContributorIdentity', data.manuscript),
  getTypes('MPEquation', data.manuscript),
  getTypes('MPEquationElement', data.manuscript),
  getTypes('MPFigure', data.manuscript),
  getTypes('MPFigureElement', data.manuscript),
  getTypes('MPFigureLayout', data.manuscript),
  getTypes('MPFigureStyle', data.manuscript),
  getTypes('MPInlineMathFragment', data.manuscript),
  getTypes('MPListItemBulletStyle', data.manuscript),
  // getTypes('MPManuscript', data.manuscript),
  getTypes('MPNumberingStyle', data.manuscript),
  getTypes('MPObjectCluster', data.manuscript),
  getTypes('MPObjectCluster', data.manuscript),
  getTypes('MPPageLayout', data.manuscript),
  getTypes('MPParagraphElement', data.sections),
  getTypes('MPParagraphStyle', data.manuscript),
  getTypes('MPSection', data.sections),
  getTypes('MPStyleableStringComponent', data.manuscript),
  getTypes('MPTable', data.manuscript),
  getTypes('MPTableElement', data.manuscript),
  getTypes('MPTableStyle', data.manuscript),
  getTypes('MPTextStyling', data.manuscript)
).forEach((obj: any) => {
  const valid = validate(obj);

  if (Array.isArray(valid)) {
    console.log('');
    console.log(`FAIL(${obj._id}) ✗`);
    console.log(valid);
    console.log('');
  } else {
    console.log(`PASS(${obj._id}) ✓`);
  }
});
