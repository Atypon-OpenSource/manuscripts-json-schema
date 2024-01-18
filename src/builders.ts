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

import { v4 as uuid } from 'uuid';

import { ObjectTypes } from './lookup';
import { ManuscriptModel } from './models';
import {
  Affiliation,
  BibliographicDate,
  BibliographicName,
  BibliographyItem,
  Citation,
  CitationItem,
  CommentAnnotation,
  Contribution,
  Contributor,
  ContributorRole,
  EmbeddedModel,
  Footnote,
  FootnotesOrder,
  Keyword,
  KeywordGroup,
  Manuscript,
  ParagraphElement,
  Project,
  Section,
  Supplement,
  Titles,
} from './types';

export type Build<T> = Pick<T, Exclude<keyof T, keyof ManuscriptModel>> & {
  _id: string;
  objectType: string;
  contributions?: Contribution[];
};

export type BuildEmbedded<T extends EmbeddedModel, O> = Pick<
  T,
  Exclude<keyof T, keyof ManuscriptModel>
> & {
  _id: string;
  objectType: O;
};

export const buildProject = (owner: string): Build<Project> => ({
  _id: generateID(ObjectTypes.Project),
  objectType: ObjectTypes.Project,
  owners: [owner],
  writers: [],
  viewers: [],
  title: '',
});

export const buildManuscript = (): Build<Manuscript> => ({
  _id: generateID(ObjectTypes.Manuscript),
  objectType: ObjectTypes.Manuscript,
});

export type ContributorRoleType = 'author';

export const buildContributor = (
  bibliographicName: BibliographicName,
  role: ContributorRoleType = 'author',
  priority = 0,
  userID?: string,
  invitationID?: string
): Build<Contributor> => ({
  _id: generateID(ObjectTypes.Contributor),
  objectType: ObjectTypes.Contributor,
  priority,
  role,
  affiliations: [],
  bibliographicName: buildBibliographicName(bibliographicName),
  userID,
  invitationID,
});

export const buildBibliographyItem = (
  data: Partial<Build<BibliographyItem>>
): Build<BibliographyItem> => ({
  ...data,
  type: data.type || 'article-journal',
  _id: generateID(ObjectTypes.BibliographyItem),
  objectType: ObjectTypes.BibliographyItem,
});

export const buildBibliographicName = (
  data: Partial<BibliographicName>
): BuildEmbedded<BibliographicName, ObjectTypes.BibliographicName> => ({
  ...data,
  _id: generateID(ObjectTypes.BibliographicName),
  objectType: ObjectTypes.BibliographicName,
});

export const buildBibliographicDate = (
  data: Partial<BibliographicDate>
): BuildEmbedded<BibliographicDate, ObjectTypes.BibliographicDate> => ({
  ...data,
  _id: generateID(ObjectTypes.BibliographicDate),
  objectType: ObjectTypes.BibliographicDate,
});

export const buildEmbeddedCitationItem = (
  bibliographyItem: string
): CitationItem => ({
  _id: generateID(ObjectTypes.CitationItem),
  objectType: ObjectTypes.CitationItem,
  bibliographyItem,
});

export const buildCitation = (
  containingObject: string,
  embeddedCitationItems: string[]
): Build<Citation> => ({
  _id: generateID(ObjectTypes.Citation),
  objectType: ObjectTypes.Citation,
  containingObject: containingObject || undefined,
  embeddedCitationItems: embeddedCitationItems.map(buildEmbeddedCitationItem),
});

export const buildKeyword = (name: string): Build<Keyword> => ({
  _id: generateID(ObjectTypes.Keyword),
  objectType: ObjectTypes.Keyword,
  name,
});

export const buildKeywordGroup = (attributes: {
  type?: string;
  title?: string;
  label?: string;
}): Build<KeywordGroup> => ({
  _id: generateID(ObjectTypes.KeywordGroup),
  objectType: ObjectTypes.KeywordGroup,
  ...(attributes.type && { type: attributes.type }),
  ...(attributes.title && { title: attributes.title }),
  ...(attributes.label && { label: attributes.label }),
});

export const buildAffiliation = (
  institution: string,
  priority = 0
): Build<Affiliation> => ({
  _id: generateID(ObjectTypes.Affiliation),
  objectType: ObjectTypes.Affiliation,
  institution,
  priority,
});

export const buildSupplementaryMaterial = (
  title: string,
  href: string
): Build<Supplement> => {
  return buildSupplement(title, href);
};

export const buildSupplement = (
  title: string,
  href: string
): Build<Supplement> => ({
  _id: generateID(ObjectTypes.Supplement),
  objectType: ObjectTypes.Supplement,
  title,
  href,
});

export const buildComment = (
  target: string,
  contents = '',
  selector?: {
    from: number;
    to: number;
  }
): Build<CommentAnnotation> => ({
  _id: generateID(ObjectTypes.CommentAnnotation),
  objectType: ObjectTypes.CommentAnnotation,
  target,
  selector,
  contents,
});

export const buildFootnote = (
  containingObject: string,
  contents: string,
  kind: 'footnote' | 'endnote' = 'footnote'
): Build<Footnote> => ({
  _id: generateID(ObjectTypes.Footnote),
  objectType: ObjectTypes.Footnote,
  containingObject: containingObject || undefined,
  contents,
  kind,
});

export const buildSection = (
  priority = 0,
  path: string[] = []
): Build<Section> => {
  const id = generateID(ObjectTypes.Section);

  return {
    _id: id,
    objectType: ObjectTypes.Section,
    priority,
    path: path.concat(id),
  };
};

export const buildParagraph = (
  placeholderInnerHTML: string,
  contents = ''
): Build<ParagraphElement> => {
  const _id = generateID(ObjectTypes.ParagraphElement);

  return {
    _id,
    objectType: ObjectTypes.ParagraphElement,
    elementType: 'p',
    contents,
    placeholderInnerHTML,
  };
};

export const buildContribution = (profileID: string): Contribution => ({
  _id: generateID(ObjectTypes.Contribution),
  objectType: ObjectTypes.Contribution,
  profileID,
  timestamp: timestamp(),
});

export const buildContributorRole = (name: string): Build<ContributorRole> => ({
  _id: generateID(ObjectTypes.ContributorRole),
  objectType: ObjectTypes.ContributorRole,
  name,
});

export const buildFootnotesOrder = (): Build<FootnotesOrder> => ({
  _id: generateID(ObjectTypes.FootnotesOrder),
  objectType: ObjectTypes.FootnotesOrder,
  footnotesList: [],
});

export const buildTitles = (title?: string): Build<Titles> => ({
  _id: generateID(ObjectTypes.Titles),
  objectType: ObjectTypes.Titles,
  title: title || '',
});

export const timestamp = () => Math.floor(Date.now() / 1000);

export const generateID = (objectType: ObjectTypes) => {
  return objectType + ':' + uuid().toUpperCase();
};
