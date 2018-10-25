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

## Versioning scheme

This repository uses a [semantic versioning scheme](https://semver.org/) with the following interpretation:

- major version: "incompatible change": changing the meaning of an existing field, or introduction of a new required field on a type, or any action that requires migrating existing data.
- minor version: addition of a new feature in the schema for which there is no reason to believe it requires migrating already stored data: new optional fields, new entities.
- patch version: all bug fixes that do not fall into either of above categories.
