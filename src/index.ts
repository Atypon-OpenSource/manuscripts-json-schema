import { validatorFn } from './pack';

const manuscriptsFn = validatorFn()

// TODO: it'd be great if we didn't have to hardcode dependencies
// e.g. referenced schemas like MPBibliographicDate and MPBibliographicName
// that are used by MPBibliographyItem
const fusionSchemas = new Set([
  'MPBibliographicName.json',
  'MPBibliographicDate.json',
  'MPBibliographyItem.json',
  'MPLibrary.json',
  'MPUserProfile.json',
  'MPPerson.json',
  'MPContributorCategory.json',
  'MPGrant.json',
  'MPFundingBody.json',
  'MPAffiliation.json'
])

const fusionFn = validatorFn(id => fusionSchemas.has(id))

export { manuscriptsFn, fusionFn }
