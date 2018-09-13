import { validatorFn } from './pack';

const manuscriptsFn = validatorFn()

const fusionFn = validatorFn(new Set([
  'MPBibliographyItem.json',
  'MPLibrary.json',
]))

export { manuscriptsFn, fusionFn }
