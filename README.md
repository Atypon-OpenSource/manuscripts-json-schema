# manuscripts-json-schema

## Module usage

```
> const validate = require('@manuscripts/manuscripts-json-schema');
undefined
> validate({ objectType: 'MPContributor' })
[ { keyword: 'required',
    dataPath: '',
    schemaPath: '#/required',
    params: { missingProperty: 'firstName' },
    message: 'should have required property \'firstName\'' } ]
> validate({ objectType: 'MPContributor', potato: 1 })
[ { keyword: 'additionalProperties',
    dataPath: '',
    schemaPath: '#/additionalProperties',
    params: { additionalProperty: 'potato' },
    message: 'should NOT have additional properties' } ]
```

## Run it

Export the schemas to a JSON array (useful for reviewing).
```
node export schemas -o the-schemas-we-care-about.json
```

Export the schemas as a validator function.
```
node export function -o lots-of-code.js
```

Run the tests (WIP)
```
node test
```

```
npm t
```
