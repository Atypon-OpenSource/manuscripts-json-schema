// @ts-ignore
import * as validators from './validators'

export function validate(object: any) {
    if (!object) {
        return 'object null or undefined';
    }

    const type = object.objectType;
    if (!type || typeof type !== 'string') {
        return 'object missing objectType';
    }
    const validator = validators[type];

    if (!validator) {
        // throw unsupported?
        return 'unsupported objectType: ' + type;
    }

    const result = validator(object);
    if (result) {
        return null;
    } else {
        const err = validator.errors[0];
        const msg = err.message;
        const path = err.instancePath;
        const keyword = err.keyword;
        if (keyword === 'additionalProperties') {
            return `${msg} '${err.params.additionalProperty}'`;
        } else {
            return (path ? path + ': ' : '') + msg;
        }
    }

}
