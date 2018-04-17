## How it works

The `schemas_src/` directory contains all the JSON schemas in an unprocessed
state.

You can look in `schemas.js` and see that it first adds all the schemas in
`schemas_src/scalars`.

These are simple/boring schemas with no inheritance, e.g.:

- `_id` matching the pattern `^MP[a-zA-Z]+:[0-9a-zA-Z\\-]+`
- `hexColor` matching the pattern `^#[a-fA-F0-9]{6}`

The next step (in `schemas.js`) is to grab all the schemas in
`schemas_src/concrete`.

These are the schemas that are actually used/exported.

These have a bit of "magic", in the form of a custom keyword (`$mash`).

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

The resulting JSON Schema looks like this:
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
