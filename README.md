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

## How do I get my schema change accepted?

To make schema changes visible at a running instance of [manuscripts-frontend](https://gitlab.com/mpapp-public/manuscripts-frontend), please complete the following steps.

### Make the schema changes

1. Create a branch for your schema changes with a descriptive name, and make your changes on that branch.
  - Include automated tests for them. For example tests, see (manuscripts-validator.test.js)[https://gitlab.com/mpapp-public/manuscripts-json-schema/blob/master/tests/manuscripts-validator.test.js].
  - Update the `"version"` property in `package.json`.
2. Post a merge request for your schema changes for a merge to *master* + address review comments. Once the MR is merged, the [@manuscripts/manuscripts-json-schema](https://www.npmjs.com/package/@manuscripts/manuscripts-json-schema) package is published automatically. *NOTE:* package publishing will fail if you did not update the version string in `package.json` as part of your changes.

### Reference the updated schema in *manuscripts-sync*

1. Create a branch of [manuscripts-sync](http://gitlab.com/mpapp-public/manuscripts-sync) where you update the `@manuscripts/json-schema` version in the `package.json` and where you also update the `"version"` property of manuscripts-sync itself (for the same reason as above, the package version determines a successful [@manuscripts/manuscripts-sync](https://www.npmjs.com/package/@manuscripts/manuscripts-sync) publishing to NPM, and the publishing of a [manuscripts-sync Docker image](https://gitlab.com/mpapp-public/manuscripts-sync/container_registry) in the Docker registry associated with *manuscripts-sync*. If your changes to manuscripts-json-schema introduce any access control rule related changes (e.g. change in behaviour with respect to `containerID` etc ACL related fields), please test your changes thoroughly.
2. Post a merge request for your *manuscripts-sync* changes + address review comments. Once MR is merged, an updated *@manuscripts/manuscripts-sync* NPM package is made available with the version string you used, and an updated *manuscripts-sync* Docker image is made available under `registry.gitlab.com/mpapp-public/manuscripts-sync/sync_gateway`.

### Reference the updated *manuscripts-sync* Docker image + NPM package in *manuscripts-api*

1. Create a branch of [manuscripts-api](https://gitlab.com/mpapp-private/manuscripts-api)
  - *NOTE:* this repository is still private (the last private repository in the project), will soon be made public – request access via the [Friends of Manuscripts Slack chat](https://manuscripts-friends-slack.herokuapp.com/) if you want in already.
  - Edit *docker/utils/templates/docker-compose.yml.ejs* on your branch to reference the updated manuscripts-sync/sync_gateway image. This has effect for local docker-compose based development environment only.
  - Edit *@manuscripts/sync* reference in package.json to reference the updated NPM package version. This change is needed for both local development and production-like environments.
2. Post a merge request for your *manuscripts-api* changes + address review comments. Once MR is merged, an updated manuscripts-api Docker image is published to the Docker registry associated with the repository.