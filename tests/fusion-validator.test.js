const test = require('tape');
const vm = require('vm');

const { fusionFn } = require('../dist/cjs');

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
    objectType: 'MPLibrary',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    _rev: '1-cf3758c6a77c031dcd8f617087c7493d',
    _id: 'MPLibrary:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
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

test('bibliography item', t => {
  t.plan(8);

  const validObject = {
    _id: 'MPBibliographyItem:231123-1233123-12331312',
    objectType: 'MPBibliographyItem',
    containerID: 'MPLibrary:foo-bar-baz',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    type: 'article',
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { type: 'foo' })),
    '.type: should be equal to one of the allowed values',
    'invalid type fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { keywordIDs: ['MPKeyword:foo'] })),
    null,
    'taggable with keywordIDs'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        keywordIDs: ['MPLibraryCollection:foo'],
      })
    ),
    null,
    'taggable with MPLibraryCollection keywordID'
  );

  t.equals(
    validate(Object.assign({}, validObject, { blahtype: 'foo' })),
    "should NOT have additional properties 'blahtype'",
    'invalid property fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { accessed: 'foo' })),
    '.accessed: should be object',
    'invalid accessed date should fail'
  );

  const validDate = {
    'date-parts': [],
    _id: 'MPBibliographicDate:food',
    objectType: 'MPBibliographicDate',
  };

  t.equals(
    validate(Object.assign({}, validObject, { accessed: validDate })),
    null,
    'valid accessed date should pass'
  );

  t.equals(
    validate(Object.assign({}, validObject, { composer: [{}] })),
    ".composer[0]: should have required property '_id'",
    'invalid composer name should fail'
  );
});
