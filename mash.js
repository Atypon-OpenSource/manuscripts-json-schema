const merge = require('deepmerge')
const { getSchema } = require('./getSchema');

function mash(obj) {
  if (obj.$mash) {
    const sourceRef = obj.$mash.source.$ref;
    const source = mash(getSchema(sourceRef.slice(0, -1)));
    const withProperties = obj.$mash.with;
    const merged = merge(source, withProperties);
    merged.$id = obj.$id;
    return merged;
  }
  return obj;
}

module.exports = mash;
