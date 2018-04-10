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
