const test = require('tape');
const util = require('util');
const vm = require('vm');

const { manuscriptsFn } = require('../dist');

const mainScript = new vm.Script(manuscriptsFn);

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
    "containerID" : "MPProject:foo-bar-baz",
    "_rev" : "1-cf3758c6a77c031dcd8f617087c7493d",
    "_id" : "MPBorderStyle:15326C7B-836D-4D6C-81EB-7E6CA6153E9A",
    "manuscriptID": "MPManuscript:zorb",
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

test('contributor', t => {
  t.plan(4);

  const validObject = {
    _id : 'MPContributor:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
    objectType: 'MPContributor',
    manuscriptID: 'MPManuscript:1001',
    containerID: 'MPProject:2002'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPContributor passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      bibliographicName: {}
    })),
    '.bibliographicName: should have required property \'_id\'',
    'invalid MPContributor fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      bibliographicName: {
        _id: 'MPBibliographicName:DEDDA223',
        objectType: 'MPBibliographicName'
      }
    })),
    null,
    'valid MPContributor passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      bibliographicName: {
        _id: 'MPBibliographicName:DEDDA223',
        objectType: 'MPBibliographicName',
        family: 'Oss',
        'non-dropping-particle': 'Van',
        given: 'Foo'
      }
    })),
    null,
    'valid MPContributor passes'
  );
});

test('preferences', t => {
  t.plan(3);

  const validObject = {
    _id: "MPPreferences:15326C7B-836D-4D6C-81EB-7E6CA6153E9A",
    objectType: "MPPreferences"
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPPreferences passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { anything: 123123 })),
    null,
    'valid MPPreferences passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      nestedObj: { foo: 'bar', baz: 1 }
    })),
    null,
    'valid MPPreferences with nested object passes'
  );
});

test('bibliography item', t => {
  t.plan(7);

  const validObject = {
    _id: 'MPBibliographyItem:231123-1233123-12331312',
    objectType: 'MPBibliographyItem',
    containerID: 'MPProject:foo-bar-baz',
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
    validate(Object.assign({}, validObject, { keywordIDs: [ 'MPKeyword:foo' ] })),
    null,
    'taggable with keywordIDs'
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
    _id: 'MPBibliographicDate:food',
    objectType: 'MPBibliographicDate'
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
    _id: 'MPBibliographicDate:food',
    objectType: 'MPBibliographicDate'
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
  t.plan(3);

  const validObject = {
    _id: 'MPBibliographicName:barred',
    objectType: 'MPBibliographicName'
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

  t.equals(
    validate(Object.assign({}, validObject, { sequence: 1 })),
    null,
    'additionalProperties are permitted'
  );
});

test('citation item', t => {
  t.plan(4);

  const validObject = {
    _id: 'MPCitationItem:barred',
    objectType: 'MPCitationItem'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    'should have required property \'bibliographyItem\'',
    'bibliographyItem property required'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      bibliographyItem: 'MPBibliographyItem:foo'
    })),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      bibliographyItem: 'MPDribbleItem:foo'
    })),
    '.bibliographyItem: should match pattern "^MPBibliographyItem"',
    'invalid object fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { sequence: 1 })),
    'should NOT have additional properties \'sequence\'',
    'additionalProperties are forbidden'
  );
});

test('citation', t => {
  t.plan(4);

  const validObject = {
    _id: 'MPCitation:baz',
    manuscriptID: 'MPManuscript:foo',
    containerID: 'MPProject:bar',
    objectType: 'MPCitation'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    'should have required property \'containingObject\'',
    'containingObject property required'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      containingObject: 'MPParagraphElement:qux'
    })),
    'should have required property \'embeddedCitationItems\'',
    'embeddedCitationItems property required'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      containingObject: 'MPParagraphElement:qux',
      embeddedCitationItems: []
    })),
    null,
    'valid object passes with empty array'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      containingObject: 'MPParagraphElement:qux',
      embeddedCitationItems: [
        {
          _id : 'MPCitationItem:AB67E6B8-1ACE-48CE-9A04-5D93B77BC0CE',
          objectType : 'MPCitationItem',
          bibliographyItem : 'MPBibliographyItem:B040481C-8DAD-43F3-B6E7-865A64D5E434'
        }
      ]
    })),
    null,
    'valid object passes'
  );
});

test('section', t => {
  t.plan(4);

  const validObject = {
    _id: 'MPSection:bar',
    objectType: 'MPSection',
    manuscriptID: 'MPManuscript:zorb',
    containerID: 'MPProject:foobar',
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

  t.equals(
    validate(Object.assign({}, validObject, { titleSuppressed: true })),
    null,
    'valid titleSuppressed passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { titleSuppressed: 1 })),
    '.titleSuppressed: should be boolean',
    'invalid titleSuppressed fails'
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
    "containerID" : "MPProject:foo-bar-baz",
    "_rev" : "1-cf3758c6a77c031dcd8f617087c7493d",
    "_id" : "MPBorderStyle:15326C7B-836D-4D6C-81EB-7E6CA6153E9A",
    "title" : "Dotted",
    "pattern" : [ 1, 1 ],
    "manuscriptID": "MPManuscript:zorb",
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
    "containerID" : "MPProject:foo-bar-baz",
    "_rev" : "1-ad1185e0dd0e339d830af9c082b2e052",
    "title" : "Red",
    "updatedAt" : 1515494608.340721,
    "manuscriptID": "MPManuscript:zorb",
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

test('project', t => {
  t.plan(5);

  t.equals(
    validate({
      objectType : 'MPProject',
      _id : 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
      owners : [],
      writers : [],
      viewers : []
    }),
    null,
    'valid MPProject passes'
  );

  t.equals(
    validate({
      objectType : 'MPProject',
      _id : 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
      owners : [],
      viewers : []
    }),
    'should have required property \'writers\'',
    'invalid MPProject fails (missing required members array)'
  );

  t.equals(
    validate({
      objectType : 'MPProject',
      _id : 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
      owners : [],
      writers : 'foo',
      viewers : []
    }),
    '.writers: should be array',
    'invalid MPProject fails (invalid type of members array)'
  );

  t.equals(
    validate({
      objectType : 'MPProject',
      _id : 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
      owners : [],
      writers : ['Foo'],
      viewers : []
    }),
    '.writers[0]: should match pattern "^User_.+"',
    'invalid MPProject fails (invalid item in members array)'
  );

  t.equals(
    validate({
      objectType : 'MPProject',
      _id : 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
      owners : [],
      writers : ['User_Foo'],
      viewers : []
    }),
    null,
    'valid MPProject passes'
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
    "containerID" : "MPProject:foo-bar-baz",
    "manuscriptID": "MPManuscript:zorb",
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
    containerID : "MPProject:foo-bar-baz",
    manuscriptID: 'MPManuscript:zorb',
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
    containerID : "MPProject:foo-bar-baz",
    manuscriptID: 'MPManuscript:zorb',
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

test('containerID property', t => {
  t.plan(4);

  const validObject = {
    _id: 'MPNumberingStyle:231123-1233123-12331312',
    objectType: 'MPNumberingStyle',
    startIndex: 1,
    manuscriptID: 'MPManuscript:zorb'
  };

  t.equals(
    validate(Object.assign({}, validObject, { containerID: "MPProject:bar" })),
    null,
    'valid containerID passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { containerID: "zPFoo:bar" })),
    '.containerID: should match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"',
    'containerID with invalid prefix fails'
  );

  t.equals(
    validate(Object.assign({}, validObject)),
    'should have required property \'containerID\'',
    'missing containerID fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { containerID: 'MPPotato:1000' })),
    '.containerID: should match pattern "^MPProject"',
    'invalid containerID fails'
  );
});

test('manuscript property', t => {
  t.plan(4);

  const validObject = {
    _id: 'MPNumberingStyle:231123-1233123-12331312',
    objectType: 'MPNumberingStyle',
    startIndex: 1,
    containerID: 'MPProject:foo'
  };

  t.equals(
    validate(Object.assign({}, validObject, { manuscriptID: "MPManuscript:bar" })),
    null,
    'valid manuscript passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { manuscriptID: "zPFoo:bar" })),
    '.manuscriptID: should match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"',
    'manuscript with invalid prefix fails'
  );

  t.equals(
    validate(Object.assign({}, validObject)),
    'should have required property \'manuscriptID\'',
    'missing manuscript fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { manuscriptID: 'MPPotato:1000' })),
    '.manuscriptID: should match pattern "^MPManuscript"',
    'invalid manuscript fails'
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

test('_revisions property', t => {
  t.plan(4);

  const validObject = {
    updatedAt : 1454537867.959872,
    objectType : 'MPBibliographyElement',
    _rev : '3-5a3d94454953b3092e0cc41ed645621a',
    _id : 'MPBibliographyElement:8C7F2071-29B1-4D2A-F884-E3391685EDA9',
    elementType : 'table',
    manuscriptID: 'MPManuscript:zorb',
    createdAt : 1454394584,
    containerID: 'MPProject:potato'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      _revisions: {}
    })),
    null,
    'empty _revisions object permitted'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      _revisions: {
        start: 2,
        ids: [
          '0322f88f64224218aa753ef1c841e90f',
          'ceab75b3102946e0930412d6f07a5723'
        ]
      }
    })),
    null,
    '_revisions object permitted'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      _revisions: {
        start: 2,
        ids: [
          11,
          'ceab75b3102946e0930412d6f07a5723'
        ]
      }
    })),
    '._revisions.ids[0]: should be string',
    'invalid _revisions object rejected'
  );
});

test('bibliography element', t => {
  t.plan(3);

  const validObject = {
    updatedAt : 1454537867.959872,
    objectType : 'MPBibliographyElement',
    _rev : '3-5a3d94454953b3092e0cc41ed645621a',
    _id : 'MPBibliographyElement:8C7F2071-29B1-4D2A-F884-E3391685EDA9',
    elementType : 'table',
    manuscriptID: 'MPManuscript:zorb',
    createdAt : 1454394584,
    containerID: 'MPProject:potato'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {  paragraphStyle: 'MPParagraphStyle:655CA525-623F-40CD-915E-9FB3BDFB833B' })),
    null,
    'paragraphStyle permitted'
  );

  t.equals(
    validate(Object.assign({}, validObject, { paragraphStyle: 'MPNotPara:24421' })),
    '.paragraphStyle: should match pattern "^MPParagraphStyle"',
    'invalid paragraphStyle id fails'
  );
});

test('figure element', t => {
  t.plan(4);

  const validObject = {
    "containedObjectIDs": [
      "MPFigure:DE6E7B4A-C84D-4DC0-8C2A-2FE71DCF1C5F",
    ],
    "figureLayout": "",
    "figureStyle": "MPFigureStyle:E173019C-00BB-415E-926A-D0C57ED43303",
    "objectType": "MPFigureElement",
    "containerID": "MPProject:990DC4B9-4AAE-4AEF-8630-04929F53B8EC",
    "elementType" : "figure",
    "manuscriptID": "MPManuscript:841DAFAD-2CBF-4F88-876B-45E9B766A4C",
    "_id": "MPFigureElement:DF026E1B-394A-4A68-C761-9DB39349A714",
    "label": "",
    "suppressCaption": false,
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { figureStyle: 'MPNotFigure:24421' })),
    '.figureStyle: should match pattern "^MPFigureStyle"',
    'invalid figureStyle id fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { suppressCaption: 1 })),
    '.suppressCaption: should be boolean',
    'invalid suppressCaption fails'
  );

  const { figureStyle, ...rest } = Object.assign({}, validObject)

  t.equals(
    validate(rest),
    null,
    'empty figureStyle id passes'
  );
});

test('list element', t => {
  t.plan(2);

  const validObject = {
    "_id" : "MPListElement:3E3C0A32-431A-4E60-AE12-07B1317C952E",
    "objectType": "MPListElement",
    "elementType": "ul",
    "paragraphStyle": "MPParagraphStyle:EB203751-238B-467A-A0A2-5BC6115FC960",
    "contents" : "foo",
    "containerID": "MPProject:990DC4B9-4AAE-4AEF-8630-04929F53B8EC",
    "manuscriptID": "MPManuscript:841DAFAD-2CBF-4F88-876B-45E9B766A4C"
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { elementType: 'foo' })),
    '.elementType: should be equal to one of the allowed values',
    'invalid elementType fails'
  );
});

test('table element', t => {
  t.plan(4);

  const validObject = {
    updatedAt : 1454537867.959872,
    caption : 'An example table.',
    sessionID : 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    objectType : 'MPTableElement',
    _rev : '3-5a3d94454953b3092e0cc41ed645621a',
    suppressFooter : true,
    _id : 'MPTableElement:8C7F2071-29B1-4D2A-F884-E3391685EDA9',
    elementType : 'table',
    manuscriptID: 'MPManuscript:zorb',
    tableStyle : 'MPTableStyle:6C38D4AD-D718-4B4B-8AE9-05B567D2F203',
    paragraphStyle : 'MPParagraphStyle:655CA525-623F-40CD-915E-9FB3BDFB833B',
    createdAt : 1454394584,
    containerID: 'MPProject:potato',
    // containedObjectID : 'MPTable:F40C327C-C02E-4A6E-8222-D9D0287E6864',
    // collection : 'elements'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { tableStyle: 'MPNotTable:24421' })),
    '.tableStyle: should match pattern "^MPTableStyle"',
    'invalid tableStyle id fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { paragraphStyle: 'MPNotPara:24421' })),
    '.paragraphStyle: should match pattern "^MPParagraphStyle"',
    'invalid paragraphStyle id fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { suppressCaption: true })),
    null,
    'valid suppressCaption passes'
  );
});

test('manuscript bitmask', t => {
  t.plan(7);

  const validObject = {
    _id: 'MPManuscript:231123-1233123-12331312',
    objectType: 'MPManuscript',
    containerID: 'MPProject:baz',
    figureElementNumberingScheme: '',
    figureNumberingScheme: ''
  };

  t.equals(
    validate(Object.assign({}, validObject, {
      contentSummaryMode: 1
    })),
    null,
    'valid bitmask value passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      contentSummaryMode: 33
    })),
    null,
    'invalid bitmask value fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      contentSummaryMode: 1 | 2 | 4
    })),
    null,
    'valid bitmask value passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      contentSummaryMode: 1 | 4
    })),
    null,
    'valid bitmask value passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      contentSummaryMode: 8 | 4
    })),
    null,
    'valid bitmask value passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      contentSummaryMode: 1 | 2 | 4 | 8 | 16 | 32
    })),
    null,
    'valid bitmask value passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      contentSummaryMode: 1 | 2 | 4 | 8 | 16 | 32 | 64
    })),
    '.contentSummaryMode: should be equal to one of the allowed values',
    'invalid bitmask value fails'
  );
});

test('_attachments property', t => {
  t.plan(7);

  const validObject = {
    _id: 'MPManuscriptCategory:231123-1233123-12331312',
    objectType: 'MPManuscriptCategory',
    containerID: 'MPProject:baz',
    name: 'foo'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid doc without _attachments passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      _attachments: []
    })),
    '._attachments: should be object',
    'invalid _attachments type'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      _attachments: {}
    })),
    null,
    'empty _attachments is valid'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      _attachments: {
        "notes.txt": {
        }
      }
    })),
    '._attachments[\'notes.txt\']: should have required property \'digest\'',
    'empty _attachment fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      _attachments: {
        "notes.txt": {
          "foo": 11
        }
      }
    })),
    'should NOT have additional properties \'foo\'',
    'invalid _attachment property fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      _attachments: {
        "notes.txt": {
          digest: "sha1-ig2C32KlOtcsuTvdPdebkg9IYbQ=",
          revpos: 2,
          content_type: "text/plain",
          length: 900,
          stub: true
        }
      }
    })),
    null,
    'valid _attachment passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      _attachments: {
        "notes.txt": {
          digest: "sha1-ig2C32KlOtcsuTvdPdebkg9IYbQ=",
          revpos: 2,
          content_type: "text/plain",
          length: 900,
          stub: true
        },
        "trololol.mp3": {
          digest: "sha1-ig2C32KlOtcsuTvdPdebkg9IYbQ=",
          revpos: 2,
          content_type: "audio/mp3",
          length: 231290,
          stub: false
        }
      }
    })),
    null,
    'multiple valid _attachments pass'
  );
});

test('invitation', (t) => {
  t.plan(4);

  const validObjectA = {
    _id: 'MPInvitation:5480f0bfe3b0f69beb8fe360adab156e06c614ff',
    invitingUserID: 'User_valid-user@manuscriptsapp.com',
    invitedUserEmail: 'valid-google@manuscriptsapp.com',
    message: 'Message',
    createdAt: 1522231220.927,
    objectType: 'MPInvitation'
  };

  const validObjectB = Object.assign({}, validObjectA);
  delete validObjectB.message;

  const invalidObjectA = Object.assign({}, validObjectA);
  delete invalidObjectA.invitedUserEmail;

  const invalidObjectB = Object.assign({}, validObjectA);
  delete invalidObjectB.invitingUserID;

  t.equals(
    validate(Object.assign({}, validObjectA)),
    null,
    'valid invitation with message passes'
  );

  t.equals(
    validate(Object.assign({}, validObjectB)),
    null,
    'valid invitation without message passes'
  );

  t.equals(
    validate(Object.assign({}, invalidObjectA)),
    'should have required property \'invitedUserEmail\''
  );

  t.equals(
    validate(Object.assign({}, invalidObjectB)),
    'should have required property \'invitingUserID\''
  );

});

test('project invitation', (t) => {
  t.plan(9);

  const validObjectA = {
    _id: 'MPProjectInvitation:b849af0d7a9076cd0302f22812fbe0a14633219b',
    invitingUserID: 'User_valid-user@manuscriptsapp.com',
    invitedUserEmail: 'valid-google@manuscriptsapp.com',
    projectID: 'valid-project-id-2',
    projectTitle: 'Valid Project 2',
    invitedUserName: 'Valid User',
    role: 'Viewer',
    acceptedAt: 2000000000,
    message: 'Message',
    createdAt: 1522231220.927,
    objectType: 'MPProjectInvitation'
  };

  const validObjectB = Object.assign({}, validObjectA);
  delete validObjectB.message;

  const validObjectC = Object.assign({}, validObjectA)
  delete validObjectC.projectTitle;

  const validObjectD = Object.assign({}, validObjectA);
  delete validObjectD.invitedUserName;

  const invalidObjectA = Object.assign({}, validObjectA);
  delete invalidObjectA.invitedUserEmail;

  const invalidObjectB = Object.assign({}, validObjectA);
  delete invalidObjectB.invitingUserID;

  const invalidObjectC = Object.assign({}, validObjectA);
  delete invalidObjectC.projectID;

  const invalidObjectD = Object.assign({}, validObjectA);
  delete invalidObjectD.role;

  const invalidObjectE = Object.assign({}, validObjectA);
  delete invalidObjectE.acceptedAt

  t.equals(
    validate(Object.assign({}, validObjectA)),
    null,
    'valid invitation with message passes'
  );

  t.equals(
    validate(Object.assign({}, validObjectB)),
    null,
    'valid invitation without message passes'
  );

  t.equals(
    validate(Object.assign({}, validObjectC)),
    null,
    'valid invitation without project title'
  );

  t.equals(
    validate(Object.assign({}, validObjectD)),
    null,
    'valid invitation without invited user name'
  )

  t.equals(
    validate(Object.assign({}, invalidObjectE)),
    null,
    'valid invitation without acceptedAt date passes'
  )

  t.equals(
    validate(Object.assign({}, invalidObjectA)),
    'should have required property \'invitedUserEmail\''
  );

  t.equals(
    validate(Object.assign({}, invalidObjectB)),
    'should have required property \'invitingUserID\''
  );

  t.equals(
    validate(Object.assign({}, invalidObjectC)),
    'should have required property \'projectID\''
  );

  t.equals(
    validate(Object.assign({}, invalidObjectD)),
    'should have required property \'role\''
  );
});
