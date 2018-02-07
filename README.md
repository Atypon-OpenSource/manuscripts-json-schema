# manuscripts-json-schema

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

## How it works

### Introduction

It is largely a copy of `$merge`: https://github.com/epoberezkin/ajv-merge-patch

I struggled for days trying to get `ajv-merge-patch` to work with more than 1
layer.

e.g. an immediate subclass of `MPManagedObject` would get all it's properties,
but if you subclassed that subclass, it wouldn't have them.

The way it worked was pretty confusing and hard to debug.

My solution is `mash.js` which is an incredibly simple and boring (go look)
recursive merger.

### Implementation

The `definitions` directory contains all the JSON schemas in an unprocessed
state.

You can look in `validate.js` and see that it first adds all the schemas in
`definitions/scalars`.

These are simple/boring schemas with no inheritance, e.g.:

- `_id` matching the pattern `^MP[a-zA-Z]+:[0-9a-zA-Z\\-]+`
- `hexColor` matching the pattern `^#[a-fA-F0-9]{6}`

The next step (in `validate.js`) is to grab all the schemas in
`definitions/concrete`.

These are the schemas that are actually used/exported.

These have a bit of "magic", in the form of a custom keyword (`$mash`).

`$mash` was simply the first synonym of `$merge` I could think of.

### Example

A good example is `MPAuxiliaryObjectReferenceStyle`:
```json
{
  "$id": "MPAuxiliaryObjectReferenceStyle.json",
  "type": "object",
  "$mash": {
    "sources": [
      { "$ref": "abstract/MPStyle.json#" }
    ],
    "with": {
      "properties": {
        "embeddedReferenceStringComponents": {
          "type": "array",
          "items": [
            { "$ref": "MPStyleableStringComponent.json#" }
          ]
        }
      },
      "required": [
      ]
    }
  }
}
```

You can see it references `MPStyle`, which for the sake of completeness looks
like this:
```json
{
  "$id": "MPStyle.json",
  "type": "object",
  "$mash": {
    "sources": [
      { "$ref": "abstract/MPManagedObject.json#" }
    ],
    "with": {
      "properties": {
        "desc": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "subtitle": {
          "type": "string"
        },
        "title": {
          "type": "string"
        }
      },
      "required": [
      ]
    }
  }
}
```

Starting from the `concrete` type `MPAuxiliaryObjectReferenceStyle`, we
_recursively_ merge the schemas in `$mash.sources`, and the schema defined in
`$mash.with`. It is very straightforward and it works well.

The resulting JSON Schema that we add to `ajv` (the JSON schema validator
library we are using) looks like this:
```json
{
  "$id": "MPAuxiliaryObjectReferenceStyle.json",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "embeddedReferenceStringComponents": {
      "type": "array",
      "items": [
        null
      ]
    },
    "desc": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "subtitle": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "sessionID": {
      "type": "string"
    },
    "_id": {
      "$ref": "strings.json#/definitions/_id"
    },
    "_rev": {
      "type": "string"
    },
    "objectType": {
      "$ref": "strings.json#/definitions/objectType"
    },
    "createdAt": {
      "$ref": "numbers.json#/definitions/timestamp"
    },
    "updatedAt": {
      "$ref": "numbers.json#/definitions/timestamp"
    }
  },
  "required": [
    "_id",
    "_rev",
    "objectType",
    "createdAt",
    "updatedAt"
  ]
}
```

We never actually add `MPStyle` or `MPManagedObject` to the validator, we just
merge the properties from them.

You can see that the `scalars` are still just references that are shared, so
there is some reuse.
