const test = require('tape');
const vm = require('vm');

const { derivedDataFn } = require('../dist/cjs');

const mainScript = new vm.Script(derivedDataFn);

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

test('user collaborator', t => {
  t.plan(3);
  const validObject = {
    objectType: 'MPUserCollaborator',
    _rev: '1-cf3758c6a77c031dcd8f617087c7493d',
    _id: 'MPUserCollaborator:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
    userID: 'User_foobar@manuscriptsapp.com',
    collaboratorID: 'MPUserProfile:foo-bar-baz',
    projects: {
      owner: [],
      writer: [],
      viewer: [],
      editor: [],
    },
    collaboratorProfile: {
      _id: 'MPUserProfile:foo-bar-baz',
      objectType: 'MPUserProfile',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      bibliographicName: {
        _id: 'MPBibliographicName:foo-bar-baz',
        objectType: 'MPBibliographicName',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
      },
      userID: 'User_foobar@manuscriptsapp.com',
    },
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPUserCollaborator passes'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        collaboratorID: 'MPAnything:foo-bar-baz',
      })
    ),
    '.collaboratorID: should match pattern "^MPUserProfile:"',
    '.collaboratorID: should match pattern "^MPUserProfile:"'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        projects: {
          owner: ['MPAnything:foo-bar-baz'],
          writer: [],
          editor: [],
          viewer: [],
        },
      })
    ),
    '.projects.owner[0]: should match pattern "^MPProject:"',
    '.projects.owner[0]: should match pattern "^MPProject:"'
  );
});

test('project memento', t => {
  t.plan(2);
  const validObject = {
    objectType: 'MPProjectMemento',
    _rev: '1-cf3758c6a77c031dcd8f617087c7493d',
    _id: 'MPProjectMemento:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
    userID: 'User_foobar@manuscriptsapp.com',
    projectID: 'MPProject:foo-bar-baz',
    project: {
      _id: 'MPProject:foo-bar-baz',
      objectType: 'MPProject',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      owners: ['User_foobar@manuscriptsapp.com'],
      writers: [],
      editors: [],
      viewers: [],
    },
    createdAt: 1515417692.477127,
    updatedAt: 1515494608.363229,
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPProjectMemento passes'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        projectID: 'MPAnything:foo-bar-baz',
      })
    ),
    '.projectID: should match pattern "^MPProject:"',
    '.projectID: should match pattern "^MPProject:"'
  );
});

test('project summary', t => {
  t.plan(2);

  const validObject = {
    _id: 'MPProjectSummary:MPProject:F1268F02-D8FC-400D-B3DE-47A4B73C1423',
    objectType: 'MPProjectSummary',
    containerID: 'MPProject:F1268F02-D8FC-400D-B3DE-47A4B73C1423',
    createdAt: 1568288021.91,
    updatedAt: 1568551125.624,
    lastModifiedDocumentID: 'MPColor:6910B47C-3BB5-4699-9F02-FE73EFB7B30D',
    ownerProfiles: [
      {
        _id: 'MPUserProfile:062e2cb3bd2953211d770df7b3a612c7455b2740',
        bibliographicName: {
          _id: 'MPBibliographicName:12c26192-3be4-4b22-9ae2-9f74ecb9d3dc',
          family: 'Alhamdan',
          given: 'Bader',
          objectType: 'MPBibliographicName',
        },
        createdAt: 1568277216.272,
        email: 'bhamdan@atypon.com',
        objectType: 'MPUserProfile',
        updatedAt: 1568277216.272,
        userID: 'User_bhamdan@atypon.com',
      },
    ],
    writerProfiles: [],
    editorProfiles: [],
    viewerProfiles: [],
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPProjectSummary passes'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        containerID: 'MPAnything:foo-bar-baz',
      })
    ),
    '.containerID: should match pattern "^MPProject:"',
    '.containerID: should match pattern "^MPProject:"'
  );
});

test('library summary', t => {
  t.plan(2);

  const validObject = {
    _id: 'MPProjectSummary:MPLibrary:F1268F02-D8FC-400D-B3DE-47A4B73C1423',
    objectType: 'MPLibrarySummary',
    containerID: 'MPLibrary:F1268F02-D8FC-400D-B3DE-47A4B73C1423',
    createdAt: 1568288021.91,
    updatedAt: 1568551125.624,
    lastModifiedDocumentID: 'MPColor:6910B47C-3BB5-4699-9F02-FE73EFB7B30D',
    ownerProfiles: [
      {
        _id: 'MPUserProfile:062e2cb3bd2953211d770df7b3a612c7455b2740',
        bibliographicName: {
          _id: 'MPBibliographicName:12c26192-3be4-4b22-9ae2-9f74ecb9d3dc',
          family: 'Alhamdan',
          given: 'Bader',
          objectType: 'MPBibliographicName',
        },
        createdAt: 1568277216.272,
        email: 'bhamdan@atypon.com',
        objectType: 'MPUserProfile',
        updatedAt: 1568277216.272,
        userID: 'User_bhamdan@atypon.com',
      },
    ],
    writerProfiles: [],
    editorProfiles: [],
    viewerProfiles: [],
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPLibrarySummary passes'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        containerID: 'MPAnything:foo-bar-baz',
      })
    ),
    '.containerID: should match pattern "^MPLibrary:"',
    '.containerID: should match pattern "^MPLibrary:"'
  );
});

test('library collection summary', t => {
  t.plan(2);

  const validObject = {
    _id:
      'MPLibraryCollectionSummary:MPLibraryCollection:F1268F02-D8FC-400D-B3DE-47A4B73C1423',
    objectType: 'MPLibraryCollectionSummary',
    containerID: 'MPLibraryCollection:F1268F02-D8FC-400D-B3DE-47A4B73C1423',
    createdAt: 1568288021.91,
    updatedAt: 1568551125.624,
    lastModifiedDocumentID: 'MPColor:6910B47C-3BB5-4699-9F02-FE73EFB7B30D',
    ownerProfiles: [
      {
        _id: 'MPUserProfile:062e2cb3bd2953211d770df7b3a612c7455b2740',
        bibliographicName: {
          _id: 'MPBibliographicName:12c26192-3be4-4b22-9ae2-9f74ecb9d3dc',
          family: 'Alhamdan',
          given: 'Bader',
          objectType: 'MPBibliographicName',
        },
        createdAt: 1568277216.272,
        email: 'bhamdan@atypon.com',
        objectType: 'MPUserProfile',
        updatedAt: 1568277216.272,
        userID: 'User_bhamdan@atypon.com',
      },
    ],
    writerProfiles: [],
    editorProfiles: [],
    viewerProfiles: [],
  };

  t.equals(
    validate(Object.assign({}, validObject)),
    null,
    'valid MPLibraryCollectionSummary passes'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        containerID: 'MPAnything:foo-bar-baz',
      })
    ),
    '.containerID: should match pattern "^MPLibraryCollection:"',
    '.containerID: should match pattern "^MPLibraryCollection:"'
  );
});
