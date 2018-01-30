// const fs = require('fs');
const { ajv, validate } = require('./validate');

// const data = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));

// const findType = (objects, type) => objects.find(x => x.objectType === type);

// const hax = (obj) => {
  // [ 'locked', 'collection' ].forEach(key => {
    // delete obj[key];
  // });

  // return obj;
// };

// const tests = [
  // // hax(findType(data.sections, 'MPSection')),
  // hax(findType(data.sections, 'MPParagraphElement')),
  // // hax(findType(data.manuscript, 'MPParagraphStyle'))
// ];

const foo = {
  "_id" : "MPParagraphElement:4B8BB322-F14E-4AF2-A867-2ECAB06D9082",
  "objectType" : "MPParagraphElement",
  "elementType" : "p",
  "paragraphStyle" : "MPParagraphStyle:5203EA99-43F7-4A1D-9A1B-AA625CE60EF8",
  "placeholderInnerHTML" : "Start from here. Enjoy writing! - the Manuscripts Team.",
  "_rev" : "2-3d86d6fd9f135fa9aff5e2a1e628e6c0",
  "contents" : "<p xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\" id=\"MPParagraphElement:4B8BB322-F14E-4AF2-A867-2ECAB06D9082\" class=\"MPElement MPParagraphStyle_5203EA99-43F7-4A1D-9A1B-AA625CE60EF8\" data-object-type=\"MPParagraphElement\" data-placeholder-text=\"Start from here. Enjoy writing! - the Manuscripts Team.\">Foofofofofofoofo off off of off of off fofoof oo<\/p>",
  "sessionID" : "8e800a59-dfcb-4ab6-bcd8-f7eb5cd8cb75",
  "createdAt" : 1515494608.620825,
  "updatedAt" : 1515494608.620825
};

const valid = validate(foo);

if (!valid) {
  console.log('FAIL ✗');
  console.log(validate.errors);
} else {
  console.log('PASS ✓');
}
