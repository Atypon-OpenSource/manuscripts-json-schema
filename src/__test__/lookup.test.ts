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
/* eslint-disable @typescript-eslint/no-var-requires */
const ObjectTypes = require('../../dist/cjs').ObjectTypes;
const manuscriptIDTypes = require('../../dist/cjs').manuscriptIDTypes;
const containerIDTypes = require('../../dist/cjs').containerIDTypes;

describe('Lookup', () => {
  test('object type lookup', () => {
    expect(ObjectTypes.ParagraphElement).toBe('MPParagraphElement');
    expect(ObjectTypes.TOCElement).toBe('MPTOCElement');
    expect(ObjectTypes.KeywordsElement).toBe('MPKeywordsElement');
    expect(ObjectTypes.UserProfile).toBe('MPUserProfile');
  });

  test('manuscriptID type lookup', () => {
    expect(manuscriptIDTypes).toContain('MPParagraphElement');
    expect(manuscriptIDTypes).toContain('MPTOCElement');
    expect(manuscriptIDTypes).toContain('MPKeywordsElement');
    expect(manuscriptIDTypes).not.toContain('MPManuscript');
    expect(manuscriptIDTypes).not.toContain('MPProject');
  });

  test('containerID type lookup', () => {
    expect(containerIDTypes).toContain('MPParagraphElement');
    expect(containerIDTypes).toContain('MPTOCElement');
    expect(containerIDTypes).toContain('MPKeywordsElement');
    expect(containerIDTypes).toContain('MPManuscript');
    expect(containerIDTypes).not.toContain('MPProject');
  });
});
