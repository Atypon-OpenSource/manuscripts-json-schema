import { writeFileSync } from 'fs';
import pack from './pack';
import { ajv, supportedObjectTypes } from './schemas';

const outFile = 'validatorFn.js';
writeFileSync(outFile, pack(supportedObjectTypes, ajv), 'utf8');
