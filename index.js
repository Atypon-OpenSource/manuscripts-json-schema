const { ajv, schemas } = require('./validate');
const pack = require('ajv-pack');

const aSchema = schemas.get('mp-paragraph-element.json');
const validate = ajv.compile(aSchema);

const code = pack(ajv, validate);
console.log(code);
