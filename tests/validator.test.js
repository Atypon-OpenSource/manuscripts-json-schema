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
  t.plan(3);
  const validObject = {
    "updatedAt" : 1515494608.245375,
    "objectType" : "MPBorderStyle",
    "container_id" : "MPProject:foo-bar-baz",
    "_rev" : "1-cf3758c6a77c031dcd8f617087c7493d",
    "_id" : "MPBorderStyle:15326C7B-836D-4D6C-81EB-7E6CA6153E9A",
    "title" : "Dotted",
    "pattern" : [ 1, 1 ],
    "createdAt" : 1515417692.476143,
    "name" : "dotted",
    "sessionID" : "4D17753C-AF51-4262-9FBD-88D8EC7E8495"
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPBorderStyle passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { objectType: 'WBBorderStyle' })),
    'unsupported objectType: WBBorderStyle',
    'unsupported objectType fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { pattern: 1 })),
    '.pattern: should be array',
    'incorrect type for property fails'
  );
});

test('bibliography item', t => {
  t.plan(6);

  const validObject = {
    _id: 'MPBibliographyItem:231123-1233123-12331312',
    objectType: 'MPBibliographyItem',
    container_id: 'MPProject:foo-bar-baz',
    type: 'article'
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
    validate(Object.assign({}, validObject, { blahtype: 'foo' })),
    'should NOT have additional properties \'blahtype\'',
    'invalid property fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { accessed: 'foo' })),
    '.accessed: should be object',
    'invalid accessed date should fail'
  );

  const validDate = {
    'date-parts': [ ],
    _id: 'MPBibliographyDate:food',
    objectType: 'MPBibliographyDate'
  }

  t.equals(
    validate(Object.assign({}, validObject, { accessed: validDate })),
    null,
    'valid accessed date should pass'
  );

  t.equals(
    validate(Object.assign({}, validObject, { composer: [{}] })),
    '.composer[0]: should have required property \'_id\'',
    'invalid composer name should fail'
  );
});

test('bibliography date', t => {
  t.plan(11);

  const validObject = {
    'date-parts': [ ],
    _id: 'MPBibliographyDate:food',
    objectType: 'MPBibliographyDate'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { circa: true })),
    null,
    'valid circa type (boolean) passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { circa: 'foo' })),
    '.circa: should be boolean',
    'invalid circa type (string) fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { circa: 1200 })),
    '.circa: should be boolean',
    'invalid circa type (number) fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { season: 1 })),
    null,
    'valid season passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { season: 1337 })),
    '.season: should be <= 4',
    'invalid season fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { 'date-parts': [] })),
    null,
    'empty date-parts passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { 'date-parts': [ [], [] ] })),
    null,
    'valid/empty date-parts passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { 'date-parts': [ [], [], [] ] })),
    '[\'date-parts\']: should NOT have more than 2 items',
    'invalid date-parts fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { 'date-parts': [ [{}], [1] ] })),
    '[\'date-parts\'][0][0]: should be string,number',
    'invalid date-parts fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { 'date-parts': [ [ 2000, 3, 15 ], [2000, 3, 17] ] })),
    null,
    'complete, valid date-parts passes'
  );
});

test('bibliography name', t => {
  t.plan(2);

  const validObject = {
    _id: 'MPBibliographyName:barred',
    objectType: 'MPBibliographyName'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { suffix: 1 })),
    '.suffix: should be string',
    'invalid object fails'
  );
});

test('section', t => {
  t.plan(2);

  const validObject = {
    _id: 'MPSection:bar',
    objectType: 'MPSection',
    container_id: 'MPProject:foobar',
    path: []
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { priority: 1 })),
    null,
    'valid priority passes'
  );
});

test('keywords', t => {
  t.plan(3);

  const validObject = {
    _id: 'MPKeyword:231123-1233123-12331312',
    objectType: 'MPKeyword',
    name: 'foo'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate({ _id: 'MPKeyword:231123-1233123-12331312', objectType: 'MPKeyword' }),
    'should have required property \'name\'',
    'fails without name'
  );

  t.equals(
    validate(Object.assign({}, validObject, { _id: 'MPFoo:1231231233123' })),
    '._id: should match pattern "^(MPKeyword|MPResearchField):[0-9a-zA-Z\\-]+"',
    'invalid id fails'
  );
});

test('research fields', t => {
  t.plan(3);

  const validObject = {
    _id: 'MPKeyword:231123-1233123-12331312',
    objectType: 'MPKeyword',
    name: 'foo'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate({ _id: 'MPKeyword:231123-1233123-12331312', objectType: 'MPKeyword' }),
    'should have required property \'name\'',
    'fails without name'
  );

  t.equals(
    validate(Object.assign({}, validObject, { _id: 'MPFoo:1231231233123' })),
    '._id: should match pattern "^(MPKeyword|MPResearchField):[0-9a-zA-Z\\-]+"',
    'invalid id fails'
  );
});

test('keyword ids', t => {
  t.plan(4);
  const validObject = {
    "updatedAt" : 1515494608.245375,
    "objectType" : "MPBorderStyle",
    "container_id" : "MPProject:foo-bar-baz",
    "_rev" : "1-cf3758c6a77c031dcd8f617087c7493d",
    "_id" : "MPBorderStyle:15326C7B-836D-4D6C-81EB-7E6CA6153E9A",
    "title" : "Dotted",
    "pattern" : [ 1, 1 ],
    "createdAt" : 1515417692.476143,
    "name" : "dotted",
    "sessionID" : "4D17753C-AF51-4262-9FBD-88D8EC7E8495"
  };

  t.equals(
    validate(Object.assign({}, validObject, { keywordIDs: [] })),
    null,
    'empty keywordIDs passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { keywordIDs: [ 'MPKeyword:foo' ] })),
    null,
    'valid keywordIDs passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { keywordIDs: [ 'MPResearchField:foo' ] })),
    null,
    'valid keywordIDs passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { keywordIDs: [ 'MPUhoh:foo' ] })),
    '.keywordIDs[0]: should match pattern "^(MPKeyword|MPResearchField):[0-9a-zA-Z\\-]+"',
    'incorrect type for property fails'
  );
});

test('color', t => {
  t.plan(1);

  const validObject = {
    "_id" : "MPColor:09070E2C-E142-4AF9-8602-586AF77E508B",
    "objectType" : "MPColor",
    "container_id" : "MPProject:foo-bar-baz",
    "_rev" : "1-ad1185e0dd0e339d830af9c082b2e052",
    "title" : "Red",
    "updatedAt" : 1515494608.340721,
    "createdAt" : 1515417692.476842,
    "name" : "red",
    "value" : "#ff0000"
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPColor passes'
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
    "container_id" : "MPProject:foo-bar-baz",
    "createdAt" : 1515417692.477127,
    "updatedAt" : 1515494608.363229,
    "name" : "Manuscripts default colour scheme"
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPColorScheme passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      colors: [ 'wBColour:2381683C-7426-4B39-BCC5-9C78C689A3CB' ]
    })),
    '.colors[0]: should match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"',
    'invalid color id fails'
  );
});

test('error messages', t => {
  t.plan(1);

  const validObject = {
    _id: 'MPNumberingStyle:231123-1233123-12331312',
    container_id : "MPProject:foo-bar-baz",
    objectType: 'MPNumberingStyle',
    startIndex: 1
  };

  t.equals(
    validate(Object.assign({}, validObject, { foobar: 1 })),
    "should NOT have additional properties 'foobar'",
    'additional property fails'
  );
});

test('_id property', t => {
  t.plan(3);

  const validObject = {
    _id: 'MPNumberingStyle:231123-1233123-12331312',
    objectType: 'MPNumberingStyle',
    container_id : "MPProject:foo-bar-baz",
    startIndex: 1
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid _id passes'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        _id: 'MPNumberingStyle:Z5326C7B-836D-4D6C-81EB-7E6CA6153E9A'
      })
    ),
    null,
    '_id with invalid hex characters passes'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        _id: 'MPNumberingStyle:biology'
      })
    ),
    null,
    'hardcoded _id passes'
  );
});

test('container_id property', t => {
  t.plan(3);

  const validObject = {
    _id: 'MPNumberingStyle:231123-1233123-12331312',
    objectType: 'MPNumberingStyle',
    startIndex: 1
  };

  t.equals(
    validate(Object.assign({}, validObject, { container_id: "MPFoo:bar" })),
    null,
    'valid container_id passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { container_id: "zPFoo:bar" })),
    '.container_id: should match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"',
    'container_id with invalid hex characters fails'
  );

  t.equals(
    validate(Object.assign({}, validObject)),
    'should have required property \'container_id\'',
    'missing container_id fails'
  );
});


test('bundle', t => {
  t.plan(3);

  const validObject = {
    _id: 'MPBundle:www-zotero-org-styles-rare-metals',
    scimago: {
      t: 'Rare Metals',
      I: '10010521',
      R: 0.345,
      H: 14,
      dY: 263,
      d3Y: 371,
      rY: 4825,
      c3Y: 314,
      cib3Y: 370,
      muC2Y: 0.75,
      muR: 18.35,
      c: 'China'
    },
    csl: {
      version: '1.0',
      defaultLocale: 'en-US',
      title: 'Rare Metals',
      cslIdentifier: 'http://www.zotero.org/styles/rare-metals',
      "self-URL": 'http://www.zotero.org/styles/rare-metals',
      "independent-parent-URL": 'http://www.zotero.org/styles/springer-vancouver-brackets',
      "documentation-URL": 'http://www.springer.com/cda/content/document/cda_downloaddocument/manuscript-guidelines-1.0.pdf',
      fields: [ 'MPResearchField:medicine' ],
      ISSNs: [ '10010521' ],
      eISSNs: [ '18677185' ],
      updatedAt: 1400151600,
      license: 'http://creativecommons.org/licenses/by-sa/3.0/',
      _id: 'MPCitationStyle:www-zotero-org-styles-rare-metals'
    },
    objectType: 'MPBundle'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  const withAuthors = Object.assign({}, validObject);
  withAuthors.csl['author-name'] = 'Stephen Congly';
  withAuthors.csl['author-email'] = 'stephencongly@gmail.com';
  t.equals(
    validate(withAuthors),
    null,
    'valid author-name and author-email passes'
  );

  const invalidResearchField = Object.assign({}, validObject);
  invalidResearchField.csl.fields = [ 'MPBowie:starman' ];

  t.equals(
    validate(invalidResearchField),
    '.csl.fields[0]: should match pattern "^(MPKeyword|MPResearchField):[0-9a-zA-Z\\-]+"',
    'invalid keyword id'
  );
});
