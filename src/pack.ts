import * as Ajv from 'ajv';
import { js_beautify } from 'js-beautify';
import { ajv, supportedObjectTypes } from './schemas';

const SINGLE_QUOTE = /'|\\/g;

function escapeQuotes(str: string) {
  return str.replace(SINGLE_QUOTE, '\\$&')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\f/g, '\\f')
    .replace(/\t/g, '\\t');
}

const buildValidatorFn = (names: Array<string>) => `
  function validate(obj) {
    const lookup = {
      ${names.map(name => `${name}: ${name}`).join(',\n')}
    };

    if (!obj || !obj.objectType || typeof obj.objectType !== 'string') {
      return false;
    }

    const validator = lookup[obj.objectType];

    if (!validator) {
      // throw unsupported?
      return false;
    }

    // we could return errors here (validator.errors)
    //
    // i think it's worth considering removing all the error message logic.
    //
    // i think it accounts for around half LOC (search '.errors = [').
    //
    // the clients will most likely want to know, but the sync_gateway doesn't
    // care so we could have some sort of build flag.
    return validator(obj);
  }
`;

function packSchemas(schemas: Set<string>, ajv: Ajv.Ajv) {
  const names = [];
  const fnStrings = [];

  for (const schemaId of schemas) {
    const name = schemaId.replace(/.json$/, '');
    // these are needed in buildValidatorFn() to build a lookup.
    names.push(name);

    // the fn source
    const fn = ajv.getSchema(schemaId);
    const fnString = fn.toString();
    const namedFn = fnString
      .replace(/^function\s/, `function ${name}`)
      .replace(/\bvalidate\./g, `${name}.`);

    // collect up patterns, the fn source we will use later makes use of them.
    const fnSource: any = fn.source
    const patterns = fnSource.patterns.map((p: string, i: number) => {
      return `const pattern${i} = new RegExp('${escapeQuotes(p)}');`
    }).join('  ');

    // this one is particularly bad.
    // however `'use strict';` does nothing in otto (the js interpreter)
    // https://github.com/robertkrimen/otto#caveat-emptor
    const fnWithPatterns = namedFn.replace("'use strict';", () => patterns);

    fnStrings.push([
      fnWithPatterns,
      `${name}.schema = ${JSON.stringify(fn.schema)};`,
      `${name}.errors = null;`
    ].join('\n'));
  }

  return fnStrings.concat(buildValidatorFn(names));
}

const equalFn = require('ajv/lib/compile/equal').toString();
const schemaFunctions = packSchemas(supportedObjectTypes, ajv);
const code = [equalFn].concat(schemaFunctions).join('\n\n');

export const validatorFn = js_beautify(code, { indent_size: 2 });
