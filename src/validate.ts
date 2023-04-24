// @ts-ignore
import * as validators from './validators'

export function validate(object: any) {
    const type = object.objectType;
    const validator = validators[type];
    if (!validator(object)) {
        return validator.errors[0];
    }
    return null;
}

export function equals(object: any, obb: any) {
    return object === obb;
}