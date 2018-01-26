const { ajv, validate } = require('./validate');
const pack = require('ajv-pack');

const code = pack(ajv, validate);
console.log(code);
