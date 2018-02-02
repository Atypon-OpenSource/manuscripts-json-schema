const { js_beautify } = require('js-beautify');

function buildValidatorFn(names) {
  return `function validate(obj) {
    const lookup = {
      ${names.map(name => `'${name}': ${name}`).join(',\n')}
    };

    if (!obj || obj.objectType || typeof obj.objectType !== 'string') {
      return false;
    }

    const validator = lookup[obj.objectType];

    return validator(obj);
  }`;
}

function packSchemas(schemas, ajv) {
  const names = [];
  const fnStrings = [];

  for (const schemaId of schemas) {
    const name = schemaId.replace(/.json$/, '');
    const fnString = ajv.getSchema(schemaId).toString();
    const namedFn = fnString.replace(/^function\s/, `function ${name}`);
    names.push(name);
    fnStrings.push(namedFn);
  }

  return fnStrings.concat(buildValidatorFn(names));
}

function pack(schemas, ajv) {
  schemas = ['MPBorder.json', 'MPNumberingStyle.json'];
  const equalFn = require('ajv/lib/compile/equal').toString();
  const schemaFunctions = packSchemas(schemas, ajv);
  const code = [equalFn].concat(schemaFunctions).join('\n\n');
  return js_beautify(code, { indent_size: 2 });
}

module.exports = pack;

