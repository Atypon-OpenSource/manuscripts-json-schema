const test = require('tape');
const util = require('util');
const vm = require('vm');

const { manuscriptsFn } = require('../dist/cjs');

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

test('id not permitted', t => {
  t.plan(1);
  const validObject = {
    "updatedAt" : 1515494608.245375,
    "objectType" : "MPBorderStyle",
    "containerID" : "MPProject:foo-bar-baz",
    "_rev" : "1-cf3758c6a77c031dcd8f617087c7493d",
    "_id" : "MPBorderStyle:15326C7B-836D-4D6C-81EB-7E6CA6153E9A",
    "id" : "MPBorderStyle:15326C7B-836D-4D6C-81EB-7E6CA6153E9A",
    "manuscriptID": "MPManuscript:zorb",
    "title" : "Dotted",
    "pattern" : [ 1, 1 ],
    "createdAt" : 1515417692.476143,
    "name" : "dotted",
    "sessionID" : "4D17753C-AF51-4262-9FBD-88D8EC7E8495"
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    'should NOT have additional properties \'id\'',
    'legacy id property rejected'
  );
});

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
    "sessionID" : "4D17753C-AF51-4262-9FBD-88D8EC7E8495",
    priority: 1
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

test('page layout', t => {
  t.plan(1);

  const validObject = {
    updatedAt: 1446410358.635123,
    topMargin: 20,
    objectType: 'MPPageLayout',
    defaultParagraphStyle: 'MPParagraphStyle:bodyText',
    _rev: '1-b534223d2574718313361eca8dfa4466',
    _id: 'MPPageLayout:E6437A5C-849E-417B-B726-F43E2545E597',
    prototype: 'MPPageLayout:defaultA4',
    beginChaptersOnRightHandPages: true,
    displayUnits: 'mm',
    leftMargin: 20,
    bottomMargin: 20,
    manuscriptID: 'MPManuscript:foo',
    containerID: 'MPProject:foo',
    sessionID: '3213123-123123',
    mirrorPagesHorizontally: true,
    rightMargin: 20,
    createdAt: 1443870579.815809,
    embeddedNumberingStyle: {
      _id: 'MPNumberingStyle:CB6FF724-7F91-454A-9A3C-30293471E039',
      prefix: '[',
      objectType: 'MPNumberingStyle',
      suffix: ']',
      startIndex: 1,
      priority: 99,
      numberingScheme: 'decimal'
    },
    pageSize: 'a4',
    priority: 2
  }

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPPageLayout passes'
  );
});

test('contributor', t => {
  t.plan(8);

  const validObject = {
    _id : 'MPContributor:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
    objectType: 'MPContributor',
    manuscriptID: 'MPManuscript:1001',
    containerID: 'MPProject:2002',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    affiliations: ['MPAffiliation:X'],
    grants: ['MPGrant:X'],
    bibliographicName: {
      _id: 'MPBibliographicName:DEDDA223',
      objectType: 'MPBibliographicName'
    }
  };

  const namelessObject = {
    _id : 'MPContributor:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
    objectType: 'MPContributor',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    priority: 1,
    manuscriptID: 'MPManuscript:1001',
    containerID: 'MPProject:2002'
  };

  const objectWithBadAffiliations = {
    _id : 'MPContributor:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
    objectType: 'MPContributor',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    manuscriptID: 'MPManuscript:1001',
    containerID: 'MPProject:2002',
    priority: 1,
    affiliations: [{'_id': 'MPAffiliation', 'objectType': 'MPAffiliation'}],
    bibliographicName: {
      _id: 'MPBibliographicName:DEDDA223',
      objectType: 'MPBibliographicName'
    }
  };

  const objectWithBadGrants = {
    _id : 'MPContributor:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
    objectType: 'MPContributor',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    manuscriptID: 'MPManuscript:1001',
    containerID: 'MPProject:2002',
    priority: 1,
    grants: [{'_id': 'MPGrant:X', 'objectType': 'MPGrant'}],
    bibliographicName: {
      _id: 'MPBibliographicName:DEDDA223',
      objectType: 'MPBibliographicName'
    }
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPContributor passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { priority: 1 })),
    null,
    'valid priority passes'
  );

  t.equals(
    validate(Object.assign({}, namelessObject)),
    'should have required property \'bibliographicName\'',
    'valid MPContributor passes'
  );

  t.equals(
    validate(Object.assign({}, objectWithBadAffiliations)),
    '.affiliations[0]: should be string',
    'valid MPContributor passes'
  );

  t.equals(
    validate(Object.assign({}, objectWithBadGrants)),
    '.grants[0]: should be string',
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
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
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

test('affiliation', t => {
  t.plan(1);

  const validObject = {
    _id: 'MPAffiliation:231123-1233123-12331312',
    objectType: 'MPAffiliation',
    containerID: 'MPProject:foo-bar-baz',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    manuscriptID: 'MPManuscript:23111',
    priority: 1
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );
});

test('user profile affiliation', t => {
  t.plan(1);

  const validObject = {
    _id: 'MPUserProfileAffiliation:231123-1233123-12331312',
    objectType: 'MPUserProfileAffiliation',
    containerID: 'MPUserProfile:foo-bar-baz',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    priority: 1
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );
});

test('grant', t => {
  t.plan(1);

  const validObject = {
    _id: 'MPGrant:231123-1233123-12331312',
    objectType: 'MPGrant',
    containerID: 'MPProject:foo-bar-baz',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    manuscriptID: 'MPManuscript:23111'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );
});

test('user profile grant', t => {
  t.plan(1);

  const validObject = {
    _id: 'MPUserProfileGrant:231123-1233123-12331312',
    objectType: 'MPUserProfileGrant',
    containerID: 'MPUserProfile:foo-bar-baz',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    prototype: 'MPUserProfileGrant:231123-1233123-1233131C',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );
});

test('bibliography item', t => {
  t.plan(12);

  const validObject = {
    _id: 'MPBibliographyItem:231123-1233123-12331312',
    objectType: 'MPBibliographyItem',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
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
    validate(Object.assign({}, validObject, { institution: 'Beijing Genomics Institute at Shenzhen, Shenzhen 518000, China. wangj@genomics.org.cn' })),
    null,
    'institution permitted'
  );

  t.equals(
    validate(Object.assign({}, validObject, { sourceUTI: 'com.mekentosj.citations.xml' })),
    null,
    'sourceUTI permitted'
  );

  t.equals(
    validate(Object.assign({}, validObject, { sourceIdentifier : 'com.mekentosj.papers.citations.xml' })),
    null,
    'sourceIdentifier permitted'
  );

  t.equals(
    validate(Object.assign({}, validObject, { originalIdentifier : '9430DD33-4196-4B36-AE7F-E31A87060029' })),
    null,
    'originalIdentifier permitted'
  );

  t.equals(
    validate(Object.assign({}, validObject, { favorite : true })),
    null,
    'favorite permitted'
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
  t.plan(12);

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
    validate(Object.assign({}, validObject, { season: 'season-01' })),
    null,
    'valid season passes'
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
  t.plan(7);

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

  t.equals(
    validate(Object.assign({}, validObject, { createdAt: 123123123 })),
    'should NOT have additional properties \'createdAt\'',
    'additionalProperties are forbidden'
  );

  t.equals(
    validate(Object.assign({}, validObject, { updatedAt: 123123123 })),
    'should NOT have additional properties \'updatedAt\'',
    'additionalProperties are forbidden'
  );

  t.equals(
    validate(Object.assign({}, validObject, { sessionID: '12312312-312312' })),
    'should NOT have additional properties \'sessionID\'',
    'additionalProperties are forbidden'
  );
});

test('citation', t => {
  t.plan(5);

  const validObject = {
    _id: 'MPCitation:baz',
    manuscriptID: 'MPManuscript:foo',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
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
      embeddedCitationItems: [],
      collationType: 1,
      citationStyle: 'MPBundle:foo',
    })),
    null,
    'collationType and citationStyle permitted'
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
  t.plan(6);

  const validObject = {
    _id: 'MPSection:bar',
    objectType: 'MPSection',
    manuscriptID: 'MPManuscript:zorb',
    containerID: 'MPProject:foobar',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    priority: 3,
    path: []
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { priority: '1', })),
    '.priority: should be integer',
    'invalid priority fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { titleSuppressed: true })),
    null,
    'valid titleSuppressed passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { category: 'MPSectionCategory:foo' })),
    null,
    'valid category passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { titleSuppressed: 1 })),
    '.titleSuppressed: should be boolean',
    'invalid titleSuppressed fails'
  );

  const invalidObject = Object.assign({}, validObject);

  delete invalidObject.priority

  t.equals(
    validate(invalidObject),
    'should have required property \'priority\'',
    'missing priority fails'
  );
});

test('keywords', t => {
  t.plan(4);

  const validObject = {
    _id: 'MPKeyword:231123-1233123-12331312',
    objectType: 'MPKeyword',
    containerID: 'MPProject:124123',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    name: 'foo'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  const { name, ...invalidObject } = Object.assign({}, validObject)

  t.equals(
    validate(invalidObject),
    'should have required property \'name\'',
    'fails without name'
  );

  t.equals(
    validate({
      _id: 'MPKeyword:231123-1233123-12331312',
      objectType: 'MPKeyword'
    }),
    'should have required property \'containerID\'',
    'fails without containerID'
  );

  t.equals(
    validate(Object.assign({}, validObject, { _id: 'MPFoo:1231231233123' })),
    '._id: should match pattern "^(MPKeyword|MPResearchField|MPLibraryCollection):[0-9a-zA-Z\\-]+"',
    'invalid id fails'
  );
});

test('research fields', t => {
  t.plan(3);

  const validObject = {
    _id: 'MPResearchField:231123-1233123-12331312',
    containerID: 'MPProject:123123123-3122312',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    objectType: 'MPResearchField',
    name: 'foo'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  const { name, ...invalidObject } = Object.assign({}, validObject)

  t.equals(
    validate(invalidObject),
    'should have required property \'name\'',
    'fails without name'
  );

  t.equals(
    validate(Object.assign({}, validObject, { _id: 'MPFoo:1231231233123' })),
    '._id: should match pattern "^(MPKeyword|MPResearchField|MPLibraryCollection):[0-9a-zA-Z\\-]+"',
    'invalid id fails'
  );
});

test('_deleted property', t => {
  t.plan(1);

  const validObject = {
    _id: 'MPResearchField:231123-1233123-12331312',
    _deleted: true,
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    containerID: 'MPProject:123123123-3122312',
    objectType: 'MPResearchField',
    name: 'foo'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
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
    "sessionID" : "4D17753C-AF51-4262-9FBD-88D8EC7E8495",
    "priority" : 1 
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
    '.keywordIDs[0]: should match pattern "^(MPKeyword|MPResearchField|MPLibraryCollection):[0-9a-zA-Z\\-]+"',
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
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    "title" : "Red",
    "updatedAt" : 1515494608.340721,
    "manuscriptID": "MPManuscript:zorb",
    "createdAt" : 1515417692.476842,
    "name" : "red",
    "value" : "#ff0000",
    priority: 1 
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
      sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
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
      sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
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
      sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
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
      sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
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
      sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
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
    "name" : "Manuscripts default colour scheme",
    priority : 1
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
    objectType : 'MPTOCElement',
    _id : 'MPTOCElement:E3391685EDA9',
    sessionID: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    createdAt: 1454394584,
    updatedAt: 1454537867.959872,
    containerID : "MPProject:foo-bar-baz",
    manuscriptID: 'MPManuscript:zorb',
    elementType : 'p',
    contents: 'Foo',
    manuscriptID: 'MPManuscript:potato'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid _id passes'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        _id: 'MPTOCElement:Z5326C7B-836D-4D6C-81EB-7E6CA6153E9A'
      })
    ),
    null,
    '_id with invalid hex characters passes'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        _id: 'MPTOCElement:biology'
      })
    ),
    null,
    'hardcoded _id passes'
  );
});

test('containerID property', t => {
  t.plan(4);

  const validObject = {
    objectType : 'MPTOCElement',
    _id : 'MPTOCElement:E3391685EDA9',
    sessionID: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    createdAt: 1454394584,
    updatedAt: 1454537867.959872,
    elementType : 'p',
    contents: 'Foo',
    manuscriptID: 'MPManuscript:potato'
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
    '.containerID: should match pattern "^(MPProject|MPLibrary)"',
    'invalid containerID fails'
  );
});

test('manuscript property', t => {
  t.plan(4);

  const validObject = {
    objectType : 'MPTOCElement',
    _id : 'MPTOCElement:E3391685EDA9',
    sessionID: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    createdAt: 1454394584,
    updatedAt: 1454537867.959872,
    elementType : 'p',
    contents: 'Foo',
    containerID: 'MPProject:potato'
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
    createdAt: 1454394584,
    updatedAt: 1454537867.959872,
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
    '.csl.fields[0]: should match pattern "^(MPKeyword|MPResearchField|MPLibraryCollection):[0-9a-zA-Z\\-]+"',
    'invalid keyword id'
  );
});

test('_revisions property', t => {
  t.plan(7);

  const validObject = {
    updatedAt : 1454537867.959872,
    objectType : 'MPBibliographyElement',
    contents: 'foo',
    _rev : '3-5a3d94454953b3092e0cc41ed645621a',
    _id : 'MPBibliographyElement:8C7F2071-29B1-4D2A-F884-E3391685EDA9',
    sessionID: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    createdAt: 1454394584,
    updatedAt: 1454537867.959872,
    elementType : 'p',
    manuscriptID: 'MPManuscript:zorb',
    createdAt : 1454394584,
    containerID: 'MPProject:potato'
  };

  const validObjectB = Object.assign({}, validObject, {'elementType': 'div'})
  const validObjectC = Object.assign({}, validObject, {'elementType': 'table'})
  const invalidObject = Object.assign({}, validObject, {'elementType': 'img'})

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObjectB)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObjectC)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, invalidObject)),
    '.elementType: should be equal to one of the allowed values',
    'invalid object does not pass'
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
    sessionID: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    _id : 'MPBibliographyElement:8C7F2071-29B1-4D2A-F884-E3391685EDA9',
    contents: 'foo',
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

test('toc element', t => {
  t.plan(2);

  const validObject = {
    objectType : 'MPTOCElement',
    _id : 'MPTOCElement:E3391685EDA9',
    sessionID: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    createdAt: 1454394584,
    updatedAt: 1454537867.959872,
    elementType : 'p',
    contents: 'Foo',
    manuscriptID: 'MPManuscript:zorb',
    containerID: 'MPProject:potato'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  const invalidObject = Object.assign({}, validObject);

  delete invalidObject.contents

  t.equals(
    validate(invalidObject),
    'should have required property \'contents\'',
    'contents required'
  );
});

test('listing element', t => {
  t.plan(3);

  const validObject = {
    objectType : 'MPListingElement',
    _id : 'MPListingElement:E3391685EDA9',
    sessionID: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    createdAt: 1454394584,
    updatedAt: 1454537867.959872,
    elementType : 'figure',
    caption : 'An example listing.',
    manuscriptID: 'MPManuscript:zorb',
    containedObjectID : 'MPBar:100',
    containerID: 'MPProject:potato'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { elementType: 'h1' })),
    '.elementType: should be equal to one of the allowed values',
    'invalid elementType'
  );

  const invalidObject = Object.assign({}, validObject);

  delete invalidObject.caption

  t.equals(
    validate(invalidObject),
    'should have required property \'caption\'',
    'caption required'
  );
});

test('equation element', t => {
  t.plan(3);

  const validObject = {
    objectType : 'MPEquationElement',
    _id : 'MPEquationElement:E3391685EDA9',
    sessionID: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    createdAt: 1454394584,
    updatedAt: 1454537867.959872,
    elementType : 'p',
    caption : 'An example equation.',
    manuscriptID: 'MPManuscript:zorb',
    containedObjectID : 'MPBar:100',
    containerID: 'MPProject:potato'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { suppressCaption: true })),
    null,
    'suppressCaption bool permitted'
  );

  const invalidObject = Object.assign({}, validObject);

  delete invalidObject.caption

  t.equals(
    validate(invalidObject),
    'should have required property \'caption\'',
    'caption required'
  );
});

test('footnotes element', t => {
  t.plan(3);

  const validObject = {
    objectType : 'MPFootnotesElement',
    _id : 'MPFootnotesElement:E3391685EDA9',
    sessionID: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    createdAt: 1454394584,
    updatedAt: 1454537867.959872,
    elementType : 'p',
    contents : 'Foo',
    manuscriptID: 'MPManuscript:zorb',
    containerID: 'MPProject:potato'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { collateByKind: 'MPFootnoteKindFootnote' })),
    null,
    'collateByKind permitted'
  );

  const invalidObject = Object.assign({}, validObject);

  delete invalidObject.contents

  t.equals(
    validate(invalidObject),
    'should have required property \'contents\'',
    'contents required'
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
    sessionID: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    createdAt: 1454394584,
    updatedAt: 1454537867.959872,
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
    sessionID: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
    createdAt: 1454394584,
    updatedAt: 1454537867.959872,
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
  t.plan(6);

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
    containedObjectID : 'MPTable:F40C327C-C02E-4A6E-8222-D9D0287E6864',
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

  t.equals(
    validate(Object.assign({}, validObject, { containedObjectID: '2424-4224' })),
    '.containedObjectID: should match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"',
    'invalid containedObjectID fails'
  );

  const invalidObject = Object.assign({}, validObject);

  delete invalidObject.containedObjectID;

  t.equals(
    validate(invalidObject),
    'should have required property \'containedObjectID\'',
    'missing containedObjectID fails'
  );
});

test('manuscript bitmask', t => {
  t.plan(7);

  const validObject = {
    _id: 'MPManuscript:231123-1233123-12331312',
    createdAt: 21312312.1,
    updatedAt: 23123123,
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
    createdAt: 21312312.1,
    updatedAt: 23123123,
    sessionID: 'weqq',
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

test('equation', (t) => {
  t.plan(2);

  const validObject = {
    _id: 'MPEquation:foo',
    createdAt: 21312312.1,
    updatedAt: 23123123,
    sessionID: 'weqq',
    objectType: 'MPEquation',
    containerID: 'MPProject:bar',
    manuscriptID: 'MPManuscript:baz',
    TeXRepresentation: '{}'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid Equation passes'
  );

  const invalidObject = Object.assign({}, validObject)

  delete invalidObject.TeXRepresentation

  t.equals(
    validate(invalidObject),
    'should have required property \'TeXRepresentation\'',
    'fails if TeXRepresentation is missing'
  );
});

test('footnote', (t) => {
  t.plan(1);

  const validObject = {
    _id: 'MPFootnote:foo',
    createdAt: 21312312.1,
    updatedAt: 23123123,
    sessionID: 'weqq',
    objectType: 'MPFootnote',
    containerID: 'MPProject:bar',
    manuscriptID: 'MPManuscript:baz',
    contents: 'foo',
    containingObject: 'MPFo:1o'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid Footnote passes'
  );
});


test('listing', (t) => {
  t.plan(3);

  const validObject = {
    _id: 'MPListing:foo',
    createdAt: 21312312.1,
    updatedAt: 23123123,
    sessionID: 'weqq',
    objectType: 'MPListing',
    containerID: 'MPProject:bar',
    manuscriptID: 'MPManuscript:baz',
    contents: 'foo',
    language: 'teascript',
    languageKey: 'obj-t'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid Listing passes'
  );

  const { language, ...objectWithoutLanguage } = Object.assign({}, validObject)

  t.equals(
    validate(objectWithoutLanguage),
    null,
    'language not required'
  );

  t.equals(
    validate(Object.assign({}, validObject, { title: 'Great code' })),
    null,
    'title is optional'
  );
});

test('table', (t) => {
  t.plan(2);

  const validObject = {
    _id: 'MPTable:foo',
    createdAt: 21312312.1,
    updatedAt: 23123123,
    sessionID: 'weqq',
    objectType: 'MPTable',
    containerID: 'MPProject:bar',
    manuscriptID: 'MPManuscript:baz',
    contents: 'bar'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid Table passes'
  );

  const { contents, ...invalidObject } = Object.assign({}, validObject)

  t.equals(
    validate(invalidObject),
    'should have required property \'contents\'',
    'contents is required'
  );
});

test('figure', (t) => {
  t.plan(2);

  const validObject = {
    _id: 'MPFigure:foo',
    sessionID: '3123123-123123-123DDA',
    updatedAt: 213123123.1,
    createdAt: 213123123.1,
    objectType: 'MPFigure',
    containerID: 'MPProject:bar',
    manuscriptID: 'MPManuscript:baz',
    contentType: 'bar'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid Figure passes'
  );

  const { contentType, ...invalidObject } = Object.assign({}, validObject)

  t.equals(
    validate(invalidObject),
    'should have required property \'contentType\'',
    'contentType is required'
  );
});

test('auxiliary object reference', t => {
  t.plan(1);

  const validObject = {
    _id: 'MPAuxiliaryObjectReference:231123-1233123-12331312',
    objectType: 'MPAuxiliaryObjectReference',
    containingObject: 'MPProject:foo-bar-baz',
    referencedObject: 'MPManuscript:23111',
    auxiliaryObjectReferenceStyle: 'MPAffiliation:foo-bar',
    containerID: 'MPProject:123123'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid object passes'
  );
});

test('inline math fragment', (t) => {
  t.plan(6);

  const validObject = {
    _id: 'MPInlineMathFragment:foo',
    createdAt: 12312312.1,
    updatedAt: 12312312.1,
    objectType: 'MPInlineMathFragment',
    containerID: 'MPProject:bar',
    containingObject: 'MPParagraphElement:baz',
    TeXRepresentation: '{}'
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid InlineMathFragment passes'
  );

  const invalidObject = Object.assign({}, validObject)

  delete invalidObject.TeXRepresentation

  t.equals(
    validate(invalidObject),
    'should have required property \'TeXRepresentation\'',
    'fails if TeXRepresentation is missing'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      SVGRepresentation: '<>'
    })),
    null,
    'SVGRepresentation permitted'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      MathMLRepresentation: '()'
    })),
    null,
    'MathMLRepresentation permitted'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      SVGGlyphs: '<>'
    })),
    null,
    'SVGGlyphs permitted'
  );

  t.equals(
    validate(Object.assign({}, validObject, {
      OMMLRepresentation: '-'
    })),
    null,
    'OMMLRepresentation permitted'
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
    updatedAt: 1522231220.927,
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
    updatedAt: 1522231220.927,
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

test('section category', (t) => {
  t.plan(4);

  const validObject = {
    _id: 'MPSectionCategory:cover-letter',
    name: 'Cover Letter',
    desc: 'A letter sent along with your manuscript to explain it.',
    objectType: 'MPSectionCategory',
    singular: true,
    priority: 2000,
    containerID : 'MPProject:foo',
    manuscriptID : 'MPManuscript:baz',
    sessionID : '4D17753C-AF51-4262-9FBD-88D8EC7E8495',
    updatedAt : 1515494608.245375,
    createdAt : 1515417692.476143,
    uniqueInScope: true,
    supplementary: true,
    titles: [ 'cover letter', 'coverletter' ]
  }

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid section category passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { titleSuppressed: true })),
    null,
    'titleSuppressed property permitted'
  );

  t.equals(
    validate(Object.assign({}, validObject, { titles: [] })),
    '.titles: should NOT have fewer than 1 items',
    'titles cannot be empty'
  );

  const noTitles = Object.assign({}, validObject)

  delete noTitles.titles

  t.equals(
    validate(noTitles),
    'should have required property \'titles\'',
    'titles must exist'
  );
});

test('manuscript priority', (t) => {
  t.plan(3);

  t.equals(
    validate({
      _id: 'MPManuscript:foo',
      createdAt: 12312312.1,
      updatedAt: 12312312.1,
      objectType: 'MPManuscript',
      containerID: 'MPProject:bar',
    }),
    null,
    'missing priority passes'
  );

  t.equals(
    validate({
      _id: 'MPManuscript:foo',
      createdAt: 12312312.1,
      updatedAt: 12312312.1,
      objectType: 'MPManuscript',
      containerID: 'MPProject:bar',
      priority: 10,
    }),
    null,
    'integer priority passes'
  );

  t.equals(
    validate({
      _id: 'MPManuscript:foo',
      createdAt: 12312312.1,
      updatedAt: 12312312.1,
      objectType: 'MPManuscript',
      containerID: 'MPProject:bar',
      priority: '10',
    }),
    '.priority: should be integer',
    'string priority fails'
  );
});

test('comment', (t) => {
  t.plan(5);

  const validObject = {
    _id: 'MPCommentAnnotation:foo',
    createdAt: 21312312.1,
    updatedAt: 23123123,
    sessionID: 'weqq',
    objectType: 'MPCommentAnnotation',
    containerID: 'MPProject:bar',
    manuscriptID: 'MPManuscript:baz',
    contents: 'bar',
    target: 'MPParagraphElement:foo',
    userID: 'MPUserProfile:bar',
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid comment passes'
  );

  const { contents, ...invalidObject } = Object.assign({}, validObject)

  t.equals(
    validate(invalidObject),
    'should have required property \'contents\'',
    'contents is required'
  );

  const objectWithSelector = Object.assign({
    selector: {
      from: 10,
      to: 20,
      text: 'abcdefghij'
    }
  }, validObject)

  t.equals(
    validate(objectWithSelector),
    null,
    'valid object with selector passes'
  );

  delete objectWithSelector.selector.text

  t.equals(
    validate(objectWithSelector),
    '.selector: should have required property \'text\'',
    'text is required'
  );

  objectWithSelector.selector.text = 'abcdefghij'
  objectWithSelector.selector.foo = 'bar'

  t.equals(
    validate(objectWithSelector),
    'should NOT have additional properties \'foo\'',
    'additional property is not allowed'
  );
});
