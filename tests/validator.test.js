const test = require('tape');
const util = require('util');
const vm = require('vm');

const { validatorFn } = require('../dist/pack');

const mainScript = new vm.Script(validatorFn);

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
  t.plan(4);
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

  t.notOk(
    validate(Object.assign({}, validObject, { _id: 'MPBorderStyle:Z5326C7B-836D-4D6C-81EB-7E6CA6153E9A' })),
    'invalid id fails'
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


test('color scheme', t => {
  t.plan(2);

  const validObject = {
    "colors" : [
      "MPColor:2381683C-7426-4B39-BCC5-9C78C689A3CB",
      "MPColor:6AF4C325-ACCE-4930-B41A-92A783B46586",
      "MPColor:5FFC7D98-2A85-40CD-BE10-8802BE45CF2D",
      "MPColor:EB91A362-E71E-41C4-B396-CA73BEBEF7A8",
      "MPColor:9ED2442D-2BA0-48CD-A796-C65147C0B1DD",
      "MPColor:09070E2C-E142-4AF9-8602-586AF77E508B",
      "MPColor:42EEDDE8-D9A5-44A4-A4E1-6A5AC1C9C27D",
      "MPColor:5685EAF5-A642-427F-9117-CDDC779CB926"
    ],
    "objectType" : "MPColorScheme",
    "_id" : "MPColorScheme:1E9C939E-B785-40AE-A8A5-9F534D91C754",
    "_rev" : "1-611a94e741630034211f64c81b80bdd8",
    "sessionID" : "4D17753C-AF51-4262-9FBD-88D8EC7E8495",
    "createdAt" : 1515417692.477127,
    "updatedAt" : 1515494608.363229,
    "name" : "Manuscripts default colour scheme"
  };

  t.ok(
    validate(Object.assign({}, validObject)),
    'valid MPColorScheme passes'
  );

  t.notOk(
    validate(Object.assign({}, validObject, {
      colors: [ 'WBColour:2381683C-7426-4B39-BCC5-9C78C689A3CB' ]
    })),
    'invalid color id fails'
  );
});
