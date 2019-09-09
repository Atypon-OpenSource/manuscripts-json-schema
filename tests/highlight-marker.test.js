const test = require('tape');
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

test('paragraphElement', t => {
  t.plan(2);
  const paragraphElement = {
    containerID: 'MPProject:DFD46159-C073-4339-803A-12962F41786A',
    contents:
      '<p xmlns="http://www.w3.org/1999/xhtml" id="MPParagraphElement:397549B4-B39A-43D3-908F-B3515CC12864" class="MPElement MPParagraphStyle_0683285A-B70B-4C97-81D0-E577162E4DFD" data-object-type="MPParagraphElement">Classical physics defines the kinetic energy of a body: The energy that the body has by means of it’s motion alone as follows:</p>',
    createdAt: 1567012601,
    elementType: 'p',
    manuscriptID: 'MPManuscript:E91932A0-C8B6-4C0E-ACED-4993F8237B03',
    objectType: 'MPParagraphElement',
    paragraphStyle: 'MPParagraphStyle:0683285A-B70B-4C97-81D0-E577162E4DFD',
    placeholderInnerHTML: '',
    sessionID: 'fdbdc3a0-50d5-462c-92f7-0ace9806d5cf',
    updatedAt: 1567091899,
    highlightMarkers: [
      {
        _id: 'MPHighlightMarker:8C1EB278-0EC9-40FC-9713-64D20D44138A',
        objectType: 'MPHighlightMarker',
        highlightID: 'MPHighlight:0C28E5D1-71A8-4146-AC82-6AA459D72B34',
        field: 'contents',
        offset: 211,
        start: true,
        text:
          'Classical physics defines the kinetic energy of a body: The energy that the body has by means of it’s motion alone as follows:',
      },
      {
        _id: 'MPHighlightMarker:C688B06A-6AE9-45AA-9FDA-9C803878FB80',
        objectType: 'MPHighlightMarker',
        highlightID: 'MPHighlight:0C28E5D1-71A8-4146-AC82-6AA459D72B34',
        field: 'contents',
        offset: 605,
        start: false,
        text: '',
      },
    ],
    _id: 'MPParagraphElement:397549B4-B39A-43D3-908F-B3515CC12864',
    _rev: '15-d6ffefe252e2d6cd318e507d6ecf5f4c',
  };

  let message = validate(paragraphElement);

  t.equals(message, null, 'should have been valid');

  let paragraphElement2 = Object.assign({}, paragraphElement, {
    highlightMarkers: 'blabla',
  });
  message = validate(paragraphElement2);
  t.equals(
    message,
    '.highlightMarkers: should be array',
    'should fail on no array'
  );
});

test('equationElement', t => {
  t.plan(1);
  const equationElement = {
    caption: 'Classical kinetic energy equation',
    containedObjectID: 'MPEquation:DFD6B1CE-0E53-496D-891E-5D6D009EC0DF',
    containerID: 'MPProject:DFD46159-C073-4339-803A-12962F41786A',
    createdAt: 1567012389,
    elementType: 'p',
    manuscriptID: 'MPManuscript:E91932A0-C8B6-4C0E-ACED-4993F8237B03',
    objectType: 'MPEquationElement',
    sessionID: 'fdbdc3a0-50d5-462c-92f7-0ace9806d5cf',
    updatedAt: 1567092779,
    _id: 'MPEquationElement:D61B81A9-3EF4-4459-ABD3-036A1BA30E7B',
    _rev: '9-835a2d0f3c5b55228d5b0081e159f5f8',
    highlightMarkers: [
      {
        _id: 'MPHighlightMarker:F785164C-C365-4CF7-95C1-1AFA9199774D',
        objectType: 'MPHighlightMarker',
        highlightID: 'MPHighlight:67017E89-6066-43F5-AA5A-445DC12754F1',
        field: 'caption',
        offset: 0,
        start: true,
        text: 'Classical kinetic energy equation',
      },
      {
        _id: 'MPHighlightMarker:9538D3A8-33EE-427E-9C09-5C5A04AE9290',
        objectType: 'MPHighlightMarker',
        highlightID: 'MPHighlight:67017E89-6066-43F5-AA5A-445DC12754F1',
        field: 'caption',
        offset: 208,
        start: false,
        text: '',
      },
    ],
  };
  let message = validate(equationElement);
  t.equals(message, null, 'should have been valid');
});

test('MPSection', t => {
  t.plan(1);
  const section = {
    containerID: 'MPProject:DFD46159-C073-4339-803A-12962F41786A',
    createdAt: 1567012313,
    elementIDs: [
      'MPParagraphElement:397549B4-B39A-43D3-908F-B3515CC12864',
      'MPEquationElement:D61B81A9-3EF4-4459-ABD3-036A1BA30E7B',
      'MPParagraphElement:64FBAD8E-4E17-48FF-9FDE-83D511E3D7C5',
      'MPEquationElement:7E5159FB-7B60-4915-AF52-EDB521223E76',
    ],
    manuscriptID: 'MPManuscript:E91932A0-C8B6-4C0E-ACED-4993F8237B03',
    objectType: 'MPSection',
    path: ['MPSection:62F98315-46A6-4A7F-83C6-6B9E70AB82D5'],
    priority: 1,
    sessionID: 'fdbdc3a0-50d5-462c-92f7-0ace9806d5cf',
    title: 'Classic physics',
    updatedAt: 1567093045,
    _id: 'MPSection:62F98315-46A6-4A7F-83C6-6B9E70AB82D5',
    _rev: '7-d3f4b9bed8fdb7a08f2f2c7fba13ce8b',
    highlightMarkers: [
      {
        _id: 'MPHighlightMarker:3CE0305B-06EC-4B9E-BFC9-D7FD9E68FB4C',
        objectType: 'MPHighlightMarker',
        highlightID: 'MPHighlight:AC7B6261-60BC-4FB6-A632-BBB3751C1832',
        field: 'title',
        offset: 0,
        start: true,
        text: 'Classic physics',
      },
      {
        _id: 'MPHighlightMarker:D64CCBAF-3A88-47C4-86AF-97DC9A4BCA55',
        objectType: 'MPHighlightMarker',
        highlightID: 'MPHighlight:AC7B6261-60BC-4FB6-A632-BBB3751C1832',
        field: 'title',
        offset: 172,
        start: false,
        text: '',
      },
    ],
  };

  let message = validate(section);
  t.equals(message, null, 'should have been valid');
});
