# manuscripts-json-schema

### Using json-schema draft 4

Core: https://tools.ietf.org/html/draft-zyp-json-schema-04
Validation: https://tools.ietf.org/html/draft-wright-json-schema-validation-00

### Development

```
~/manuscripts-json-schema master*
❯ node index.js
MPSection: ✓
MPParagraphElement: ✓
```

If you look in `index.js`, you'll see I load all the json schema files in there and
add them to `ajv`.

`dictionary.json` is also loaded, and this contains the test objects that will
be validated against the schemas.

e.g.
```
const data = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));
const thingToValidate = data.sections.find(x => x.objectType === 'MPSection');
const validatorResult = ajv.validate('mp-section.json', thingToValidate);
if (!valid) {
  console.log(ajv.errors);
} else {
  console.log('It worked');
}
```

As you may have notiiced, we look up schemas that we added to `ajv` by the `id`
property in the schema.
