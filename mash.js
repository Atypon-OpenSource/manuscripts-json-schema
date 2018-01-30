const merge = require('deepmerge')
const { getSchema } = require('./getSchema');

function mash(obj) {
  if (obj.$mash) {
    const { sources } = obj.$mash;
    const merged = sources.reduce((acc, source) => {
      const schemaId = source.$ref.slice(0, -1);
      const schema = getSchema(schemaId);
      const mashed = mash(schema);
      return merge(acc, mashed);
    }, obj.$mash.with);
    merged.$id = obj.$id;
    return merged;
  }
  return obj;
}

module.exports = mash;
