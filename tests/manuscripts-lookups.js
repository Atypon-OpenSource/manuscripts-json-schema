const test = require('tape');

const { ObjectTypes, manuscriptIDTypes, containerIDTypes } = require('../dist/cjs');

test('object type lookup', t => {
  t.plan(3);

  t.equals(ObjectTypes.ParagraphElement, 'MPParagraphElement');
  t.equals(ObjectTypes.TOCElement, 'MPTOCElement');
  t.equals(ObjectTypes.UserProfile, 'MPUserProfile');
});

test('manuscriptID type lookup', t => {
  t.plan(4);

  t.ok(manuscriptIDTypes.has('MPParagraphElement'));
  t.ok(manuscriptIDTypes.has('MPTOCElement'));
  t.notOk(manuscriptIDTypes.has('MPManuscript'));
  t.notOk(manuscriptIDTypes.has('MPProject'));
});

test('containerID type lookup', t => {
  t.plan(4);

  t.ok(containerIDTypes.has('MPParagraphElement'));
  t.ok(containerIDTypes.has('MPTOCElement'));
  t.ok(containerIDTypes.has('MPManuscript'));
  t.notOk(containerIDTypes.has('MPProject'));
});
