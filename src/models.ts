/*!
 * © 2019 Atypon Systems LLC
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

import { ObjectTypes } from './lookup';
import { Model } from './types';

export type ContainedModel = Model & {
  containerID: string;
};

export interface ManuscriptProps {
  manuscriptID: string;
}

export type ManuscriptModel = ContainedModel & ManuscriptProps;

export const getModelMap = (models: Model[]): Map<string, Model> => {
  const modelMap = new Map<string, Model>();
  for (const model of models) {
    modelMap.set(model._id, model);
  }
  return modelMap;
};

export const getModelsByType = <T extends Model>(
  modelMap: Map<string, Model>,
  type: ObjectTypes
): T[] => {
  const output: T[] = [];
  for (const model of modelMap.values()) {
    if (model.objectType === type) {
      output.push(model as T);
    }
  }
  return output;
};
