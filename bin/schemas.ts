import { promises as fs } from 'fs';
import * as path from 'path';
import * as merge from 'deepmerge';

interface Source {
    $ref: string;
}

interface Mash {
    sources: Source[]
    with: { [key: string]: any; }
}

export interface JsonSchema {
    $id: string;
    title?: string;
    $mash?: Mash;
    additionalProperties: boolean;
    [key: string]: any;
}


async function mash(schema: JsonSchema) {
    const { additionalProperties } = schema;
    if (schema.$mash) {
        const { sources } = schema.$mash;
        const merged = await sources.reduce(async ($acc: Promise<any>, source: Source) => {
            const acc = await $acc;
            const schemaId = source.$ref.slice(0, -1);
            const schema = await getSchema(schemaId);
            const { objectType } = acc.properties;
            const merged = merge<any>(schema, acc);
            // We don't want array merging for this enum.
            if (objectType) {
                merged.properties.objectType = objectType;
            }
            return merged;
        }, Promise.resolve(schema.$mash.with));
        merged.$id = schema.$id;
        merged.title = schema.title;
        if (additionalProperties) {
            merged.additionalProperties = additionalProperties;
        }
        return merged;
    }
    return schema;
}

async function getSchema(id: string): Promise<JsonSchema> {
    const file = path.join('schemas_src', id);
    const content = await fs.readFile(file, 'utf8');
    return await mash(JSON.parse(content));
}

async function getSchemas(directory: string): Promise<JsonSchema[]> {
    const dir = path.join('schemas_src', directory);
    const files = await fs.readdir(dir, 'utf8');
    return await Promise.all(files.map(async name => await getSchema(path.join(directory, name))));
}


export const scalars = getSchemas('scalars');
export const abstract = getSchemas('abstract');
export const concrete = getSchemas('concrete');
export const schemas = Promise.all([scalars, abstract, concrete]).then(a => a.flat())