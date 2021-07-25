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
    owners: [],
    writers: [],
    editors: [],
    viewers: [],
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
  t.plan(11);

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

  t.equals(
    validate(Object.assign({}, validObject, { originalProperties: 'foo' })),
    '.originalProperties: should be object',
    'invalid originalProperties should fail'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, { originalProperties: { foo: 'bar' } })
    ),
    null,
    'valid originalProperties object with any properties should pass'
  );

  t.equals(
    validate(Object.assign({}, validObject, { literal: 'foo' })),
    null,
    'valid object passes'
  );
});

test('citation alert', t => {
  t.plan(7);
  const validObject = {
    objectType: 'MPCitationAlert',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    _rev: '1-cf3758c6a77c031dcd8f617087c7493d',
    _id: 'MPCitationAlert:15326C7B-836D-4D6C-81EB-7E6CA6153E9B',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8498',
    userID: 'User_foobar@manuscriptsapp.com',
    sourceDOI: '10.1007/978-981-13-0341-8_10',
    targetDOI: '10.1176/appi.psychotherapy.71101',
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPCitationAlert passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { objectType: 'WBCitationAlert' })),
    'unsupported objectType: WBCitationAlert',
    'unsupported objectType fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { isRead: 'foo' })),
    '.isRead: should be boolean',
    'invalid isRead should fail'
  );

  t.equals(
    validate(Object.assign({}, validObject, { isRead: true })),
    null,
    'valid boolean isRead should pass'
  );

  const invalidObjectA = Object.assign({}, validObject);
  delete invalidObjectA.userID;

  const invalidObjectB = Object.assign({}, validObject);
  delete invalidObjectB.sourceDOI;

  const invalidObjectC = Object.assign({}, validObject);
  delete invalidObjectC.targetDOI;

  t.equals(
    validate(Object.assign({}, invalidObjectA)),
    "should have required property 'userID'"
  );

  t.equals(
    validate(Object.assign({}, invalidObjectB)),
    "should have required property 'sourceDOI'"
  );

  t.equals(
    validate(Object.assign({}, invalidObjectC)),
    "should have required property 'targetDOI'"
  );
});

test('muted citation alert', t => {
  t.plan(4);
  const validObject = {
    objectType: 'MPMutedCitationAlert',
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
    _rev: '1-cf3758c6a77c031dcd8f617087c7493d',
    _id: 'MPMutedCitationAlert:15326C7B-836D-4D6C-81EB-7E6CA6153E9B',
    sessionID: '4D17753C-AF51-4262-9FBD-88D8EC7E8498',
    userID: 'User_foobar@manuscriptsapp.com',
    targetDOI: '10.1176/appi.psychotherapy.71101',
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPMutedCitationAlert passes'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, { objectType: 'WBMutedCitationAlert' })
    ),
    'unsupported objectType: WBMutedCitationAlert',
    'unsupported objectType fails'
  );

  const invalidObjectA = Object.assign({}, validObject);
  delete invalidObjectA.userID;

  const invalidObjectB = Object.assign({}, validObject);
  delete invalidObjectB.targetDOI;

  t.equals(
    validate(Object.assign({}, invalidObjectA)),
    "should have required property 'userID'"
  );

  t.equals(
    validate(Object.assign({}, invalidObjectB)),
    "should have required property 'targetDOI'"
  );
});

test('Discussion Item', t => {
  const validObject = {
    context: {
      back: 'have',
      front: '',
    },
    contextRanges: [
      {
        contentType: 'HTML',
        context: 'https://assets.scitrus.com/widget/moby_dick.html',
        offset: 7991,
        offset_h: 349,
        offset_t: 27704,
        ranges: [
          {
            end: '/div[2]/p[32]',
            endOffset: 83,
            start: '/div[2]/p[32]',
            startOffset: 38,
          },
        ],
        page: '20',
      },
      {
        contentType: 'HTML',
        context: 'https://assets.scitrus.com/widget/moby_dick.html',
        offset: 7991,
        offset_h: 349,
        offset_t: 27704,
        ranges: [
          {
            end: '/div[2]/p[32]',
            endOffset: 83,
            start: '/div[2]/p[32]',
            startOffset: 38,
          },
        ],
        page: {
          idref: 'page10',
          index: 10,
        },
        type: 4,
      },
    ],
    dateInserted: 1601465770972,
    issn: '',
    objectType: 'MPDiscussionItem',
    publicationAccess: {
      access: 1,
      type: 2,
      value: 'assets.scitrus.com/widget/moby_dick.html',
    },
    publicationId: 'f5d96da96f74203c8ca6ed1ee81d0f71',
    quoteHTML: 'come in upon this coast (Fife) Anno 1652, one',
    removed: false,
    section: 'come in upon this coast (Fife) Anno 1652, one',
    sendResolutionMessageToSubmitter: false,
    siteUrl: 'https://assets.scitrus.com/widget/moby_dick.html',
    subjects: [],
    text: '',
    users: [
      {
        role: 0,
        sgUserId: 'User|vparchas@atypon.com',
        userId: '5f43b9580ec2d79d90c010e9',
      },
    ],
    _id: 'MPDiscussionItem:023e68ff-7dd5-486d-93a3-1666b728fe42',
    attachments: {
      images: [
        {
          type: 'png',
          link: 'https://www.fnordware.com/superpng/pnggrad8rgb.png',
          name: 'Random PNG',
          size: 976,
        },
        {
          type: 'png',
          link: 'https://www.fnordware.com/superpng/pnggrad8rgb.png',
          name: 'Random PNG 2',
          size: 976,
        },
      ],
      files: [],
      videos: [],
      others: [],
    },
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPDiscussionItem passes'
  );

  const noAttachmentsObject = Object.assign({}, validObject);
  delete noAttachmentsObject.attachments;

  t.equals(
    validate(Object.assign({}, noAttachmentsObject)),
    null,
    'valid MPDiscussionItem passes'
  );

  t.equals(
    validate(Object.assign({}, validObject, { objectType: 'DiscussionItem' })),
    'unsupported objectType: DiscussionItem',
    'unsupported objectType fails'
  );

  t.equals(
    validate(Object.assign({}, validObject, { removed: 'foo' })),
    '.removed: should be boolean',
    'invalid removed should fail'
  );

  t.equals(
    validate(Object.assign({}, validObject, { removed: true })),
    null,
    'valid removed should pass'
  );

  const missingUsersObj = Object.assign({}, validObject);
  delete missingUsersObj.users;

  t.equals(
    validate(Object.assign({}, missingUsersObj)),
    "should have required property 'users'"
  );

  const emptyUsersObj = Object.assign({}, validObject);
  emptyUsersObj.users = [];

  t.equals(
    validate(Object.assign({}, emptyUsersObj)),
    '.users: should NOT have fewer than 1 items'
  );

  t.end();
});
