# json-schema

The Manuscripts JSON Schema types and validation functions.

## Build
`yarn build`

## Validation
To validate a document against the schema, the `validate` function can be used:
```typescript
import { validate } from '@manuscripts/json-schema';

const document = {
    objectType: 'MPManuscript'
};

const error = validate(document);
if (!error) {
    console.log('document is valid');
} else {
    console.log(`document is invalid: ${error}`);
}
```
The schema is selected based on the `objectType` property of the document.

## Types
A Typescript interface is generated (and included in the package) for each abstract/concrete schema:
```typescript
import { Model } from '@manuscripts/json-schema';

function getId(document: Model) {
    return document._id;
}
```
An `ObjectTypes` enum is also available that includes all supported types with their corresponding `objectType` value:
```typescript
import { Model, ObjectTypes } from '@manuscripts/json-schema';

function isManuscript(document: Model) {
    return document.objectType === ObjectTypes.Manuscript;
}
```