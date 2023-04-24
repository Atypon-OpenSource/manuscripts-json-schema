import * as path from 'path'
import { compile } from 'json-schema-to-typescript';
import { promises as fs } from 'fs';
import {abstract, concrete, JsonSchema, schemas} from './schemas';

function normalize(schema: JsonSchema) {
    const clone = Object.assign({}, schema);
    clone.$id = schema.$id.replace(/^MP/, '').replace(/\.json/, '');
    return clone;
}

async function getSchema(id: string) {
    const schema = (await schemas).filter(s => s.$id === id)[0];
    return normalize(schema);
}

async function compileSchema(schema: JsonSchema) {
    schema = normalize(schema);
    return await compile(schema, '', {
        bannerComment: '',
        unknownAny: false,
        declareExternallyReferenced: false,
        $refOptions: {
            resolve: {
                file: {
                    read: file => {
                        const name = path.basename(file.url);
                        return getSchema(name);
                    }
                }
            }
        }
    });
}

export async function generateDefinitions() {
    const schemas = [...(await abstract), ...(await concrete)]
    const contents = await Promise.all(schemas.map(schema => compileSchema(schema)));
    const src = path.join(__dirname, '..', 'src');
    await fs.writeFile(path.join(src, 'types.ts'), contents);
}
