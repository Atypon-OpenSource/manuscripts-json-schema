const test = require('tape');
const util = require('util');
const vm = require('vm');

const { fusionFn } = require('../dist');

const mainScript = new vm.Script(fusionFn);

function validate(obj) {
  const sandbox = { obj };
  const context = vm.createContext(sandbox);
  // Execute main script with validate function
  mainScript.runInContext(context);
  // Run validate against obj
  const testScript = new vm.Script('result = validate(obj)');
  testScript.runInContext(context);

  return sandbox.result;
}

test('library', t => {
  t.plan(2);
  const validObject = {
    "updatedAt" : 1515494608.245375,
    "objectType" : "MPLibrary",
    "_rev" : "1-cf3758c6a77c031dcd8f617087c7493d",
    "_id" : "MPLibrary:15326C7B-836D-4D6C-81EB-7E6CA6153E9A",
    "sessionID" : "4D17753C-AF51-4262-9FBD-88D8EC7E8495"
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPLibrary passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { objectType: 'WBLibrary' })),
    'unsupported objectType: WBLibrary',
    'unsupported objectType fails'
  );
});
