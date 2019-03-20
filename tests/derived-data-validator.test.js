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
    '.collaboratorID: should match pattern "^MPUserProfile"',
    '.collaboratorID: should match pattern "^MPUserProfile"'
  );

  t.equals(
    validate(
      Object.assign({}, validObject, {
        projects: { owner: ['MPAnything:foo-bar-baz'], writer: [], viewer: [] },
      })
    ),
    '.projects.owner[0]: should match pattern "^MPProject"',
    '.projects.owner[0]: should match pattern "^MPProject"'
  );
});
