const test = require('tape');
const util = require('util');
const vm = require('vm');

const pack = require('../dist/pack').default;
const { ajv, supportedObjectTypes } = require('../dist/schemas');

const code = pack(supportedObjectTypes, ajv);
const mainScript = new vm.Script(code);

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

test('border style', t => {
  t.plan(3);
  const validObject = {
    "updatedAt" : 1515494608.245375,
    "objectType" : "MPBorderStyle",
    "_rev" : "1-cf3758c6a77c031dcd8f617087c7493d",
    "_id" : "MPBorderStyle:15326C7B-836D-4D6C-81EB-7E6CA6153E9A",
    "title" : "Dotted",
    "pattern" : [ 1, 1 ],
    "createdAt" : 1515417692.476143,
    "name" : "dotted",
    "sessionID" : "4D17753C-AF51-4262-9FBD-88D8EC7E8495"
  };

  t.ok(
    validate(Object.assign({}, validObject)),
    'valid MPBorderStyle passes'
  );

  t.notOk(
    validate(Object.assign({}, validObject, { objectType: 'WBBorderStyle' })),
    'unsupported objectType fails'
  );

  t.notOk(
    validate(Object.assign({}, validObject, { pattern: 1 })),
    'incorrect type for property fails'
  );
});


test('color', t => {
  t.plan(2);

  const validObject = {
    "_id" : "MPColor:09070E2C-E142-4AF9-8602-586AF77E508B",
    "objectType" : "MPColor",
    "_rev" : "1-ad1185e0dd0e339d830af9c082b2e052",
    "title" : "Red",
    "updatedAt" : 1515494608.340721,
    "createdAt" : 1515417692.476842,
    "name" : "red",
    "value" : "#ff0000"
  };

  t.ok(
    validate(Object.assign({}, validObject)),
    'valid MPColor passes'
  );

  t.notOk(
    validate(Object.assign({}, validObject, { foobar: 1 })),
    'additional property fails'
  );
});
