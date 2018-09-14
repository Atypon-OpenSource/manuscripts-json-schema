import * as Ajv from 'ajv';
import { js_beautify } from 'js-beautify';
import { generateSchemas } from './schemas';

const SINGLE_QUOTE = /'|\\/g;

function escapeQuotes(str: string) {
  return str.replace(SINGLE_QUOTE, '\\$&')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\f/g, '\\f')
    .replace(/\t/g, '\\t');
}

const nameOfId = (schemaId: string) => schemaId.replace(/.json$/, '');

// Build a validator fn string for a particular schema.
function buildValidatorFn(name: string, fn: Ajv.ValidateFunction): string {
  const fnSource: any = fn.source
  const namedFn = fnSource.code
    // we want our functions named
    .replace(/var\svalidate\s=\sfunction/, `function ${name}`)
    // any references need to be updated
    .replace(/\bvalidate\./g, `${name}.`)
    // we have multiple validatorFns we will concat, so we can't have this.
    .replace(/return validate;$/g, '')
    //`'use strict';` does nothing in otto but is in a useful place.
    // https://github.com/robertkrimen/otto#caveat-emptor
    .replace(/refVal\[(\d+)\]/g, (_: string, p1: string) => `refVal${p1}`);

  // First item is the parent schema itself (circular reference).
  const refValSrcs = (fn.refVal && fn.refVal.slice(1)) || [];

  // Specific definition references are just objects and we embed them.
  //
  // Concrete schema references _should_ also be exported so we can just
  // reference by name.
  const refVals: Array<string> = refValSrcs.map((refVal, i) => {
    return typeof refVal === 'object'
      ? `var refVal${i+1} = ${JSON.stringify(refVal)};`
      : `var refVal${i+1} = ${nameOfId(refVal.schema.$id)};`;
  });

  const patterns = fnSource.patterns.map((p: string, i: number) => {
    return `var pattern${i} = new RegExp('${escapeQuotes(p)}');`
  }).join('  ');

  const startIndex = namedFn.indexOf(`function ${name}`);

  // The fnSource.code has patterns and refVals outside of the function which
  // we need to remove.
  const fnWithRefVals = namedFn
    .slice(startIndex)
    .replace("'use strict';", () => [patterns].concat(refVals).join('\n'));

  return [
    fnWithRefVals,
    `${name}.schema = ${JSON.stringify(fn.schema)};`,
    `${name}.errors = null;`
  ].join('\n');
}

// "Main" function which calls other validators through lookup map.
const buildValidateFn = (names: Array<string>) => `
  function validate(obj) {
    var lookup = {
      ${names.map(name => `${name}: ${name}`).join(',\n')}
    };

    if (!obj) {
      return 'object null or undefined';
    }

    if (!obj.objectType || typeof obj.objectType !== 'string') {
      return 'object missing objectType';
    }

    var validator = lookup[obj.objectType];

    if (!validator) {
      // throw unsupported?
      return 'unsupported objectType: ' + obj.objectType;
    }

    // we could return errors here (validator.errors)
    //
    // i think it's worth considering removing all the error message logic.
    //
    // i think it accounts for around half LOC (search '.errors = [').
    //
    // the clients will most likely want to know, but the sync_gateway doesn't
    // care so we could have some sort of build flag.
    var result = validator(obj);
    if (result) {
      return null;
    } else {
      var err = validator.errors[0];
      var msg = err.message;
      var path = err.dataPath;
      var keyword = err.keyword;
      if (keyword == 'additionalProperties') {
        return msg + " '" + err.params.additionalProperty + "'";
      } else {
        return (path ? path + ': ' : '') + msg;
      }
    }
  }
`;

// Iterates through schema ids, creating a schemaFn for each.
function packSchemas(schemas: Set<string>, ajv: Ajv.Ajv) {
  const names = [];
  const validatorFns = [];

  for (const schemaId of schemas) {
    const name = nameOfId(schemaId);
    names.push(name);
    const fn = ajv.getSchema(schemaId);
    const validatorFn = buildValidatorFn(name, fn);
    validatorFns.push(validatorFn);
  }

  const validateFn = buildValidateFn(names);
  return validatorFns.concat(validateFn);
}

const isEqualFn = `\
var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;
${require('ajv/lib/compile/equal')}
`;

// Dependencies needed by validator fns.
const dependencies = [
  isEqualFn
];

export const validatorFn = (schemaFilter?: (schemaId: string) => boolean) => {
  // This is an array of fn strings, where the last one is buildValidateFn.
  const { supportedObjectTypes, ajv } = generateSchemas(schemaFilter)
  const validatingFunctions = packSchemas(supportedObjectTypes, ajv);

  // Exported code
  const code = dependencies.concat(validatingFunctions).join('\n\n');

  return js_beautify(code, { indent_size: 2 });
}
