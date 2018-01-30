const fs = require('fs');
const Ajv = require('ajv');
const mash = require('./mash');
const getSchema = require('./getSchema');

const ajv = new Ajv({ sourceCode: true });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

const schema = mash(getSchema('mp-paragraph-element.json'));

ajv.addSchema(getSchema('scalars.json'));
ajv.addSchema(getSchema('strings.json'));

const validate = ajv.compile(schema);

module.exports = { ajv, validate };
