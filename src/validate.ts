/*!
 * © 2023 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//@ts-ignore
import * as validators from './validators'; // eslint-disable-line import/no-unresolved

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
