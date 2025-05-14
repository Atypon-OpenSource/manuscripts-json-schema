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

import {
  buildAffiliation,
  buildBibliographicDate,
  buildBibliographicName,
  buildBibliographyItem,
  buildCitation,
  buildContributor,
  buildKeyword,
  buildManuscript,
  buildProject,
} from '../builders';
import { ObjectTypes } from '../lookup';
import { BibliographicName, BibliographyItem } from '../types';

describe('commands', () => {
  test('build project', () => {
    const proj = buildProject('Mr Derp');
    expect(proj._id).toMatch(/MPProject:\S+/);
    expect(proj.objectType).toBe(ObjectTypes.Project);
    expect(proj.owners).toEqual(['Mr Derp']);
    expect(proj.writers).toEqual([]);
    expect(proj.viewers).toEqual([]);
    expect(proj.title).toBe('');
  });

  test('build manuscript', () => {
    const manuscriptA = buildManuscript();
    expect(manuscriptA._id).toMatch(/MPManuscript:\S+/);
    expect(manuscriptA.objectType).toBe(ObjectTypes.Manuscript);

    const manuscriptB = buildManuscript();
    expect(manuscriptB._id).toMatch(/MPManuscript:\S+/);
    expect(manuscriptB.objectType).toBe(ObjectTypes.Manuscript);
  });
  test('build contributor', () => {
    const name: BibliographicName = {
      _id: 'contributor-a',
      objectType: ObjectTypes.BibliographicName,
      nonDroppingParticle: 'van der',
      family: 'Derp',
    };
    const contributor = buildContributor(name, 'author', 3);
    expect(contributor.objectType).toBe(ObjectTypes.Contributor);
    expect(contributor.priority).toBe(3);
    expect(contributor.role).toBe('author');
    expect(contributor.affiliations).toEqual([]);
    expect(contributor.bibliographicName.nonDroppingParticle).toBe(
      name.nonDroppingParticle
    );
    expect(contributor.bibliographicName.family).toBe(name.family);
    expect(contributor.bibliographicName.objectType).toBe(
      ObjectTypes.BibliographicName
    );
  });

  test('build bibliography item', () => {
    const data: Partial<BibliographyItem> = {
      title: 'Bibliography item title',
      DOI: 'xyz',
      URL: 'https://humdi.net/evo/',
    };
    const item = buildBibliographyItem(data);
    expect(item._id).toMatch(/MPBibliographyItem:\S+/);
    expect(item.objectType).toBe(ObjectTypes.BibliographyItem);
    expect(item.title).toBe(data.title);
    expect(item.DOI).toBe(data.DOI);
    expect(item.URL).toBe(data.URL);
  });

  test('build bibliographic name', () => {
    const name = {
      given: 'Herp',
      family: 'Derp',
    };
    const bibName = buildBibliographicName(name);
    expect(bibName.given).toBe(name.given);
    expect(bibName.family).toBe(name.family);
    expect(bibName.objectType).toBe(ObjectTypes.BibliographicName);
  });

  test('build bibliographic date', () => {
    const parts: [[string, string, string]] = [['1998', '20', '1']];
    const cslDate = { 'date-parts': parts };
    const date = buildBibliographicDate(cslDate);
    expect(date._id).toMatch(/MPBibliographicDate:\S+/);
    expect(date.objectType).toBe(ObjectTypes.BibliographicDate);
    expect(date['date-parts']).toEqual(cslDate['date-parts']);
  });

  test('build citation', () => {
    const citation = buildCitation('x', ['y']);
    expect(citation._id).toMatch(/MPCitation:\S+/);
    expect(citation.containingObject).toBe('x');
    expect(citation.embeddedCitationItems.length).toBe(1);
    expect(citation.embeddedCitationItems[0].objectType).toBe(
      ObjectTypes.CitationItem
    );
  });

  test('build keyword', () => {
    const keyword = buildKeyword('foo');
    expect(keyword.name).toBe('foo');
    expect(keyword._id).toMatch(/MPKeyword:\S+/);
    expect(keyword.objectType).toMatch(ObjectTypes.Keyword);
  });

  test('build affiliation', () => {
    const aff = buildAffiliation('x');
    expect(aff._id).toMatch(/MPAffiliation:\S+/);
    expect(aff.objectType).toBe(ObjectTypes.Affiliation);
    expect(aff.institution).toBe('x');
  });
});
