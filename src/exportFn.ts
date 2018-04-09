import { writeFileSync } from 'fs';
import pack from './pack';
import { ajv, supportedObjectTypes } from './schemas';

const outFile = 'validatorFn.js';

console.warn('Writing function to:', outFile);
writeFileSync(outFile, pack(supportedObjectTypes, ajv), 'utf8');
