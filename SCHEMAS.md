## Creating a new schema

1. `git clone git@gitlab.com:mpapp-private/manuscripts-json-schema.git`
2. `npm i`
3. `npm t`
4. `cp schemas_src/concrete/MPSection.json schemas_src/concrete/MPProject.json`
5. Edit the newly created `MPProject.json` file

The schema we copied `MPSection` is probably the best example of the different
things that can be done.

Within in the JSON Schema, you only want to edit things in the `with` property.

The `properties` key within `with` (i.e. `.with.properties`) is where the
possible properties are listed.

The `required` key within `with` (i.e. `.with.required`) is where you can list
keys defined in `properties` as required.

## Compiling

1. `npm t` (unlikely to have broken anything though)
2. `npm run build`

You can now look at `schemas/MPProject.json` to see the recursively
merged/compiled schema.

You can also look at `dist/types.ts` to see the TypeScript defintion that was
generated.

## Deploying

Ideally make a merge request.

Alternatively, if you have `npm` access to the `@manuscripts` organisation:

1. `npm version patch`
2. `npm publish --access public`

Please be careful with this and always make sure `master` has your changes.

After this package has been updated, `@manuscripts/manuscripts-sync` will need
to be updated with this reference.

1. Edit `package.json` of `@manuscripts/manuscripts-sync` with new version
   number of `@manuscripts/manuscripts-json-schema`
2. `npm i && npm t`
3. `git commit`
4. `npm version patch`
5. `npm publish --access public`

After `@manuscripts/manuscripts-sync` has been updated, `manuscripts-api` will
need to be updated in the exact same way.
