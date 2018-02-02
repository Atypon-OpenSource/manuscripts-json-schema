const util = require('util');
const vm = require('vm');
const test = require('tape');
const pack = require('../pack');
const { ajv, supportedObjectTypes } = require('../validate');

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

test('packed validator code', t => {
  t.plan(1);
  const isValid = validate({
    "updatedAt" : 1515494608.245375,
    "objectType" : "MPBorderStyle",
    "_rev" : "1-cf3758c6a77c031dcd8f617087c7493d",
    "_id" : "MPBorderStyle:15326C7B-836D-4D6C-81EB-7E6CA6153E9A",
    "title" : "Dotted",
    "pattern" : [
      1,
      1
    ],
    "createdAt" : 1515417692.476143,
    "name" : "dotted",
    "sessionID" : "4D17753C-AF51-4262-9FBD-88D8EC7E8495"
  });
  t.ok(isValid);
});
