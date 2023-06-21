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
const validate = require('../../dist/cjs/validate').validate;

describe('Validation', () => {
  test('id not permitted', () => {
    const validObject = {
      updatedAt: 1515494608.245375,
      objectType: 'MPBorderStyle',
      containerID: 'MPProject:foo-bar-baz',
      _id: 'MPBorderStyle:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
      id: 'MPBorderStyle:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
      manuscriptID: 'MPManuscript:zorb',
      title: 'Dotted',
      pattern: [1, 1],
      createdAt: 1515417692.476143,
      name: 'dotted',
    };

    expect(validate(validObject)).toBe(
      "must NOT have additional properties 'id'"
    );
  });

  test('border style', () => {
    const validObject = {
      updatedAt: 1515494608.245375,
      objectType: 'MPBorderStyle',
      containerID: 'MPProject:foo-bar-baz',
      _id: 'MPBorderStyle:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
      manuscriptID: 'MPManuscript:zorb',
      title: 'Dotted',
      pattern: [1, 1],
      createdAt: 1515417692.476143,
      name: 'dotted',
      priority: 1,
    };

    expect(validate(validObject)).toBeNull();
    expect(validate(Object.assign({}, validObject, { pattern: 1 }))).toBe(
      '/pattern: must be array'
    );
  });

  test('page layout', () => {
    const validObject = {
      updatedAt: 1446410358.635123,
      topMargin: 20,
      objectType: 'MPPageLayout',
      defaultParagraphStyle: 'MPParagraphStyle:bodyText',
      _id: 'MPPageLayout:E6437A5C-849E-417B-B726-F43E2545E597',
      prototype: 'MPPageLayout:defaultA4',
      beginChaptersOnRightHandPages: true,
      displayUnits: 'mm',
      leftMargin: 20,
      bottomMargin: 20,
      manuscriptID: 'MPManuscript:foo',
      containerID: 'MPProject:foo',
      mirrorPagesHorizontally: true,
      rightMargin: 20,
      createdAt: 1443870579.815809,
      embeddedNumberingStyle: {
        _id: 'MPNumberingStyle:CB6FF724-7F91-454A-9A3C-30293471E039',
        prefix: '[',
        objectType: 'MPNumberingStyle',
        suffix: ']',
        startIndex: 1,
        priority: 99,
        numberingScheme: 'decimal',
      },
      pageSize: 'a4',
      priority: 2,
    };

    expect(validate(validObject)).toBeNull();
  });

  test('contributor', () => {
    const validObject = {
      _id: 'MPContributor:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
      objectType: 'MPContributor',
      manuscriptID: 'MPManuscript:1001',
      containerID: 'MPProject:2002',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      affiliations: ['MPAffiliation:X'],
      grants: ['MPGrant:X'],
      bibliographicName: {
        _id: 'MPBibliographicName:DEDDA223',
        objectType: 'MPBibliographicName',
      },
    };
    const namelessObject = {
      _id: 'MPContributor:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
      objectType: 'MPContributor',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      priority: 1,
      manuscriptID: 'MPManuscript:1001',
      containerID: 'MPProject:2002',
    };
    const objectWithBadAffiliations = {
      _id: 'MPContributor:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
      objectType: 'MPContributor',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      manuscriptID: 'MPManuscript:1001',
      containerID: 'MPProject:2002',
      priority: 1,
      affiliations: [{ _id: 'MPAffiliation', objectType: 'MPAffiliation' }],
      bibliographicName: {
        _id: 'MPBibliographicName:DEDDA223',
        objectType: 'MPBibliographicName',
      },
    };
    const objectWithBadGrants = {
      _id: 'MPContributor:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
      objectType: 'MPContributor',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      manuscriptID: 'MPManuscript:1001',
      containerID: 'MPProject:2002',
      priority: 1,
      grants: [{ _id: 'MPGrant:X', objectType: 'MPGrant' }],
      bibliographicName: {
        _id: 'MPBibliographicName:DEDDA223',
        objectType: 'MPBibliographicName',
      },
    };

    expect(validate(validObject)).toBeNull();
    expect(
      validate(Object.assign({}, validObject, { priority: 1 }))
    ).toBeNull();
    expect(validate(namelessObject)).toBe(
      "must have required property 'bibliographicName'"
    );
    expect(validate(objectWithBadAffiliations)).toBe(
      '/affiliations/0: must be string'
    );
    expect(validate(objectWithBadGrants)).toBe('/grants/0: must be string');
    expect(
      validate(Object.assign({}, validObject, { bibliographicName: {} }))
    ).toBe("/bibliographicName: must have required property '_id'");
    expect(
      validate(
        Object.assign({}, validObject, {
          bibliographicName: {
            _id: 'MPBibliographicName:DEDDA223',
            objectType: 'MPBibliographicName',
          },
        })
      )
    ).toBeNull();
    expect(
      validate(
        Object.assign({}, validObject, {
          bibliographicName: {
            _id: 'MPBibliographicName:DEDDA223',
            objectType: 'MPBibliographicName',
            family: 'Oss',
            'non-dropping-particle': 'Van',
            given: 'Foo',
          },
        })
      )
    ).toBeNull();
  });

  test('preferences', () => {
    const validObject = {
      _id: 'MPPreferences:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      objectType: 'MPPreferences',
    };

    expect(validate(validObject)).toBeNull();
    expect(
      validate(Object.assign({}, validObject, { anything: 123123 }))
    ).toBeNull();
    expect(
      validate(
        Object.assign({}, validObject, {
          nestedObj: { foo: 'bar', baz: 1 },
        })
      )
    ).toBeNull();
  });

  test('affiliation', () => {
    const validObject = {
      _id: 'MPAffiliation:231123-1233123-12331312',
      objectType: 'MPAffiliation',
      containerID: 'MPProject:foo-bar-baz',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      manuscriptID: 'MPManuscript:23111',
      priority: 1,
    };

    expect(validate(validObject)).toBeNull();
  });

  test('user profile affiliation', () => {
    const validObject = {
      _id: 'MPUserProfileAffiliation:231123-1233123-12331312',
      objectType: 'MPUserProfileAffiliation',
      containerID: 'MPUserProfile:foo-bar-baz',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      priority: 1,
    };

    expect(validate(validObject)).toBeNull();
  });

  test('grant', () => {
    const validObject = {
      _id: 'MPGrant:231123-1233123-12331312',
      objectType: 'MPGrant',
      containerID: 'MPProject:foo-bar-baz',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      manuscriptID: 'MPManuscript:23111',
    };

    expect(validate(validObject)).toBeNull();
  });

  test('user profile grant', () => {
    const validObject = {
      _id: 'MPUserProfileGrant:231123-1233123-12331312',
      objectType: 'MPUserProfileGrant',
      containerID: 'MPUserProfile:foo-bar-baz',
      prototype: 'MPUserProfileGrant:231123-1233123-1233131C',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
    };

    expect(validate(validObject)).toBeNull();
  });

  test('bibliography item', () => {
    const validObject = {
      _id: 'MPBibliographyItem:231123-1233123-12331312',
      objectType: 'MPBibliographyItem',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      containerID: 'MPProject:foo-bar-baz',
      manuscriptID: 'MPManuscript:23111',
      type: 'article',
    };

    expect(validate(validObject)).toBeNull();
    expect(validate(Object.assign({}, validObject, { type: 'foo' }))).toBe(
      '/type: must be equal to one of the allowed values'
    );
    expect(
      validate(
        Object.assign({}, validObject, {
          institution:
            'Beijing Genomics Institute at Shenzhen, Shenzhen 518000, China. wangj@genomics.org.cn',
        })
      )
    ).toBeNull();
    expect(
      validate(
        Object.assign({}, validObject, {
          sourceUTI: 'com.mekentosj.citations.xml',
        })
      )
    ).toBeNull();
    expect(
      validate(
        Object.assign({}, validObject, {
          sourceIdentifier: 'com.mekentosj.papers.citations.xml',
        })
      )
    ).toBeNull();
    expect(
      validate(
        Object.assign({}, validObject, {
          originalIdentifier: '9430DD33-4196-4B36-AE7F-E31A87060029',
        })
      )
    ).toBeNull();
    expect(
      validate(Object.assign({}, validObject, { favorite: true }))
    ).toBeNull();

    const numberFields = [
      'chapter-number',
      'collection-number',
      'edition',
      'issue',
      'number-of-pages',
      'number-of-volumes',
      'volume',
      'citation-number',
      'number',
      'page',
      'page-first',
    ];

    for (const numberField of numberFields) {
      expect(
        validate({
          ...validObject,
          [numberField]: 'foo',
        })
      ).toBeNull();
      expect(
        validate({
          ...validObject,
          [numberField]: 123,
        })
      ).toBeNull();
      expect(
        validate({
          ...validObject,
          [numberField]: { test: 123 },
        })
      ).not.toBeNull();
    }

    expect(validate(Object.assign({}, validObject, { blahtype: 'foo' }))).toBe(
      "must NOT have additional properties 'blahtype'"
    );
    expect(validate(Object.assign({}, validObject, { accessed: 'foo' }))).toBe(
      '/accessed: must be object'
    );

    const validDate = {
      'date-parts': [],
      _id: 'MPBibliographicDate:food',
      objectType: 'MPBibliographicDate',
    };

    expect(
      validate(Object.assign({}, validObject, { accessed: validDate }))
    ).toBeNull();
    expect(validate(Object.assign({}, validObject, { composer: [{}] }))).toBe(
      "/composer/0: must have required property '_id'"
    );
    expect(
      validate(Object.assign({}, validObject, { originalProperties: 'foo' }))
    ).toBe('/originalProperties: must be object');
    expect(
      validate(
        Object.assign({}, validObject, { originalProperties: { foo: 'bar' } })
      )
    ).toBeNull();
    expect(
      validate(Object.assign({}, validObject, { literal: 'foo' }))
    ).toBeNull();
  });

  test('bibliography date', () => {
    const validObject = {
      'date-parts': [],
      _id: 'MPBibliographicDate:food',
      objectType: 'MPBibliographicDate',
    };

    expect(validate(validObject)).toBeNull();
    expect(
      validate(Object.assign({}, validObject, { circa: true }))
    ).toBeNull();
    expect(validate(Object.assign({}, validObject, { circa: 'foo' }))).toBe(
      '/circa: must be boolean'
    );
    expect(validate(Object.assign({}, validObject, { circa: 1200 }))).toBe(
      '/circa: must be boolean'
    );
    expect(validate(Object.assign({}, validObject, { season: 1 }))).toBeNull();
    expect(validate(Object.assign({}, validObject, { season: 1337 }))).toBe(
      '/season: must be <= 4'
    );
    expect(
      validate(Object.assign({}, validObject, { season: 'season-01' }))
    ).toBeNull();
    expect(
      validate(Object.assign({}, validObject, { 'date-parts': [] }))
    ).toBeNull();
    expect(
      validate(Object.assign({}, validObject, { 'date-parts': [[], []] }))
    ).toBeNull();
    expect(
      validate(Object.assign({}, validObject, { 'date-parts': [[], [], []] }))
    ).toBe('/date-parts: must NOT have more than 2 items');
    expect(
      validate(Object.assign({}, validObject, { 'date-parts': [[{}], [1]] }))
    ).toBe('/date-parts/0/0: must be string');
    expect(
      validate(
        Object.assign({}, validObject, {
          'date-parts': [
            [2000, 3, 15],
            [2000, 3, 17],
          ],
        })
      )
    ).toBeNull();
  });

  test('bibliography name', () => {
    const validObject = {
      _id: 'MPBibliographicName:barred',
      objectType: 'MPBibliographicName',
    };

    expect(validate(validObject)).toBeNull();

    expect(validate(Object.assign({}, validObject, { suffix: 1 }))).toBe(
      '/suffix: must be string'
    );

    expect(
      validate(Object.assign({}, validObject, { sequence: 1 }))
    ).toBeNull();
  });

  test('citation item', () => {
    const validObject = {
      _id: 'MPCitationItem:barred',
      objectType: 'MPCitationItem',
      bibliographyItem: 'MPBibliographyItem:foo',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          bibliographyItem: 'MPDribbleItem:foo',
        })
      )
    ).toBe('/bibliographyItem: must match pattern "^MPBibliographyItem:"');

    expect(validate(Object.assign({}, validObject, { sequence: 1 }))).toBe(
      "must NOT have additional properties 'sequence'"
    );

    expect(
      validate(Object.assign({}, validObject, { createdAt: 123123123 }))
    ).toBe("must NOT have additional properties 'createdAt'");

    expect(
      validate(Object.assign({}, validObject, { updatedAt: 123123123 }))
    ).toBe("must NOT have additional properties 'updatedAt'");
  });

  test('citation', () => {
    const validObject = {
      _id: 'MPCitation:baz',
      manuscriptID: 'MPManuscript:foo',
      embeddedCitationItems: [],
      containingObject: 'MPParagraphElement:qux',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      containerID: 'MPProject:bar',
      objectType: 'MPCitation',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          containingObject: undefined,
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          embeddedCitationItems: undefined,
        })
      )
    ).toBe("must have required property 'embeddedCitationItems'");

    expect(
      validate(
        Object.assign({}, validObject, {
          collationType: 1,
          citationStyle: 'MPBundle:foo',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          containingObject: 'MPParagraphElement:qux',
          embeddedCitationItems: [
            {
              _id: 'MPCitationItem:AB67E6B8-1ACE-48CE-9A04-5D93B77BC0CE',
              objectType: 'MPCitationItem',
              bibliographyItem:
                'MPBibliographyItem:B040481C-8DAD-43F3-B6E7-865A64D5E434',
            },
          ],
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          displayScheme: 'author-only',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          displayScheme: 'composite',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          displayScheme: 'year-only',
        })
      )
    ).toBe('/displayScheme: must be equal to one of the allowed values');

    expect(
      validate(
        Object.assign({}, validObject, {
          prefix: 'am',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          suffix: 'pm',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          infix: 'midday',
        })
      )
    ).toBeNull();
  });

  test('MPSection', () => {
    const validObject = {
      _id: 'MPSection:bar',
      objectType: 'MPSection',
      manuscriptID: 'MPManuscript:zorb',
      containerID: 'MPProject:foobar',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      priority: 3,
      path: [],
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          assignees: ['MPUserProfile:user'],
          deadline: 1515417692,
          status: 'MPStatusLabel:label',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, { status: 'MPFoo:1231231233123' })
      )
    ).toBe('/status: must match pattern "^MPStatusLabel:"');

    expect(validate(Object.assign({}, validObject, { priority: '1' }))).toBe(
      '/priority: must be integer'
    );

    expect(
      validate(Object.assign({}, validObject, { titleSuppressed: true }))
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, { category: 'MPSectionCategory:foo' })
      )
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { titleSuppressed: 1 }))
    ).toBe('/titleSuppressed: must be boolean');

    expect(
      validate(
        Object.assign({}, validObject, {
          priority: undefined,
        })
      )
    ).toBe("must have required property 'priority'");

    expect(
      validate(
        Object.assign({}, validObject, {
          maxCharacterCountRequirement:
            'MPMaximumSectionCharacterCountRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          minCharacterCountRequirement:
            'MPMinimumSectionCharacterCountRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          maxWordCountRequirement: 'MPMaximumSectionWordCountRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          minWordCountRequirement: 'MPMinimumSectionWordCountRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          captionStyle: 'MPCaptionStyle:foobar',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          auxiliaryObjectReferenceStyle:
            'MPAuxiliaryObjectReferenceStyle:foobar',
        })
      )
    ).toBeNull();

    expect(
      validate({
        ...validObject,
        label: '1.1',
      })
    ).toBeNull();

    expect(
      validate({
        ...validObject,
        label: 1,
      })
    ).toBe('/label: must be string');

    expect(
      validate(
        Object.assign({}, validObject, {
          numberingParticipation: 0,
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          numberingParticipation: 2,
        })
      )
    ).toBe(
      '/numberingParticipation: must be equal to one of the allowed values'
    );

    expect(
      validate(
        Object.assign({}, validObject, {
          numberingParticipation: '1',
        })
      )
    ).toBe('/numberingParticipation: must be integer');
  });

  test('StatusLabel', () => {
    const validObject = {
      _id: 'MPStatusLabel:231123-1233123-12331312',
      objectType: 'MPStatusLabel',
      containerID: 'MPProject:124123',
      manuscriptID: 'MPManuscript:123',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      name: 'foo',
    };

    expect(validate(validObject)).toBeNull();
  });

  test('Tag', () => {
    const validObject = {
      _id: 'MPTag:231123-1233123-12331312',
      objectType: 'MPTag',
      containerID: 'MPProject:124123',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      name: 'tag-name',
    };

    expect(validate(validObject)).toBeNull();
  });

  test('keywords', () => {
    const validObject = {
      _id: 'MPKeyword:231123-1233123-12331312',
      objectType: 'MPKeyword',
      containerID: 'MPProject:124123',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      name: 'foo',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { color: 'MPColor:id' }))
    ).toBeNull();

    const { name, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe("must have required property 'name'");

    expect(
      validate({
        _id: 'MPKeyword:231123-1233123-12331312',
        objectType: 'MPKeyword',
      })
    ).toBe("must have required property 'containerID'");

    expect(
      validate(Object.assign({}, validObject, { _id: 'MPFoo:1231231233123' }))
    ).toBe(
      '/_id: must match pattern "^(MPKeyword|MPManuscriptKeyword|MPResearchField|MPLibraryCollection|MPStatusLabel|MPTag):[0-9a-zA-Z\\-]+"'
    );
  });

  test('research fields', () => {
    const validObject = {
      _id: 'MPResearchField:231123-1233123-12331312',
      containerID: 'MPProject:123123123-3122312',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      objectType: 'MPResearchField',
      name: 'foo',
    };

    expect(validate(validObject)).toBeNull();

    const { name, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe("must have required property 'name'");

    expect(
      validate(Object.assign({}, validObject, { _id: 'MPFoo:1231231233123' }))
    ).toBe(
      '/_id: must match pattern "^(MPKeyword|MPManuscriptKeyword|MPResearchField|MPLibraryCollection|MPStatusLabel|MPTag):[0-9a-zA-Z\\-]+"'
    );
  });

  test('color', () => {
    const validObject = {
      _id: 'MPColor:09070E2C-E142-4AF9-8602-586AF77E508B',
      objectType: 'MPColor',
      containerID: 'MPProject:foo-bar-baz',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      title: 'Red',
      manuscriptID: 'MPManuscript:zorb',
      name: 'red',
      value: '#ff0000',
      priority: 1,
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate({
        ...validObject,
        templateID: 'MPManuscriptTemplate:1',
      })
    ).toBeNull();

    expect(
      validate({
        ...validObject,
        templateID: 'MPManuscript:1',
      })
    ).toBe('/templateID: must match pattern "^MPManuscriptTemplate:"');

    expect(
      validate({
        ...validObject,
        manuscriptID: 'MPManuscriptTemplate:1',
      })
    ).toBe('/manuscriptID: must match pattern "^MPManuscript:"');
  });

  test('project', () => {
    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: [],
        editors: [],
        viewers: [],
      })
    ).toBeNull();

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        viewers: [],
      })
    ).toBe("must have required property 'writers'");

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: 'foo',
        editors: [],
        viewers: [],
      })
    ).toBe('/writers: must be array');

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: ['Foo'],
        editors: [],
        viewers: [],
      })
    ).toBe('/writers/0: must match pattern "^User_.+"');

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: ['User_Foo'],
        editors: [],
        viewers: [],
      })
    ).toBeNull();

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: [],
        editors: ['User_Foo'],
        viewers: [],
      })
    ).toBeNull();

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: [],
        editors: [],
        viewers: ['User_Foo', '*'],
      })
    ).toBeNull();

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: [],
        editors: [],
        viewers: ['User_Foo', '*'],
      })
    ).toBeNull();

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: [],
        editors: [],
        viewers: ['User_Foo', 'User_Bar'],
      })
    ).toBeNull();

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: [],
        editors: [],
        viewers: ['*'],
      })
    ).toBeNull();

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: [],
        editors: [],
        viewers: ['nonsense'],
      })
    ).toBe('/viewers/0: must match pattern "^User_.+"');

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: [],
        editors: [],
        viewers: [],
        templateContainer: true,
      })
    ).toBeNull();

    expect(
      validate({
        objectType: 'MPProject',
        _id: 'MPProject:1E9C939E-B785-40AE-A8A5-9F534D91C754',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        owners: [],
        writers: [],
        editors: [],
        viewers: [],
        templateContainer: 'true',
      })
    ).toBe('/templateContainer: must be boolean');
  });

  test('library', () => {
    const validObject = {
      _id: 'MPLibrary:5685EAF5-A642-427F-9117-CDDC779CB926',
      objectType: 'MPLibrary',
      owners: ['User_foobar@baz.com'],
      writers: [],
      editors: [],
      viewers: [],
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
    };

    expect(validate(validObject)).toBeNull();

    // valid object with name
    expect(
      validate(
        Object.assign(
          {
            name: 'Very awesome name',
          },
          validObject
        )
      )
    ).toBeNull();

    // valid object with category
    expect(
      validate(
        Object.assign(
          {
            category: 'MPLibraryCategory:B8FEC1AD-676D-4C7C-9F36-6B1EFE587742',
          },
          validObject
        )
      )
    ).toBeNull();

    // invalid object with malformed category
    expect(
      validate(
        Object.assign(
          {
            category: 'B8FEC1AD-676D-4C7C-9F36-6B1EFE587742',
          },
          validObject
        )
      )
    ).toBe('/category: must match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"');

    // invalid object with wrong category prefix
    expect(
      validate(
        Object.assign(
          {
            category:
              'MPLibraryCollection:B8FEC1AD-676D-4C7C-9F36-6B1EFE587742',
          },
          validObject
        )
      )
    ).toBe('/category: must match pattern "^MPLibraryCategory:"');
  });

  test('library collection', () => {
    const validObject = {
      _id: 'MPLibraryCollection:5685EAF5-A642-427F-9117-CDDC779CB926',
      objectType: 'MPLibraryCollection',
      name: 'Very awesome name',
      containerID: 'MPLibrary:6AF4C325-ACCE-4930-B41A-92A783B46586',
      owners: ['User_foobar@baz.com'],
      inherited: [],
      writers: [],
      editors: [],
      viewers: [],
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
    };

    expect(validate(validObject)).toBeNull();

    // valid object with category
    expect(
      validate(
        Object.assign(
          {
            category:
              'MPLibraryCollectionCategory:B8FEC1AD-676D-4C7C-9F36-6B1EFE587742',
          },
          validObject
        )
      )
    ).toBeNull();

    // invalid object with malformed category
    expect(
      validate(
        Object.assign(
          {
            category: 'B8FEC1AD-676D-4C7C-9F36-6B1EFE587742',
          },
          validObject
        )
      )
    ).toBe('/category: must match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"');

    // invalid object with wrong category prefix
    expect(
      validate(
        Object.assign(
          {
            category: 'MPLibrary:B8FEC1AD-676D-4C7C-9F36-6B1EFE587742',
          },
          validObject
        )
      )
    ).toBe('/category: must match pattern "^MPLibraryCollectionCategory:"');

    const { writers, ...invalidObject1 } = validObject;
    expect(validate(invalidObject1)).toBe(
      "must have required property 'writers'"
    );

    const { owners, ...invalidObject2 } = validObject;
    expect(validate(invalidObject2)).toBe(
      "must have required property 'owners'"
    );

    const { editors, ...validObjectWithoutEditors } = validObject;
    expect(validate(validObjectWithoutEditors)).toBeNull();

    const { containerID, ...invalidObject4 } = validObject;
    expect(validate(invalidObject4)).toBe(
      "must have required property 'containerID'"
    );
  });

  test('color scheme', () => {
    const validObject = {
      colors: [
        'MPColor:2381683C-7426-4B39-BCC5-9C78C689A3CB',
        'MPColor:6AF4C325-ACCE-4930-B41A-92A783B46586',
        'MPColor:5FFC7D98-2A85-40CD-BE10-8802BE45CF2D',
        'MPColor:EB91A362-E71E-41C4-B396-CA73BEBEF7A8',
        'MPColor:9ED2442D-2BA0-48CD-A796-C65147C0B1DD',
        'MPColor:09070E2C-E142-4AF9-8602-586AF77E508B',
        'MPColor:42EEDDE8-D9A5-44A4-A4E1-6A5AC1C9C27D',
        'MPColor:5685EAF5-A642-427F-9117-CDDC779CB926',
      ],
      objectType: 'MPColorScheme',
      _id: 'MPColorScheme:1E9C939E-B785-40AE-A8A5-9F534D91C754',
      containerID: 'MPProject:foo-bar-baz',
      manuscriptID: 'MPManuscript:zorb',
      createdAt: 1515417692.477127,
      updatedAt: 1515494608.363229,
      name: 'Manuscripts default colour scheme',
      priority: 1,
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          colors: ['wBColour:2381683C-7426-4B39-BCC5-9C78C689A3CB'],
        })
      )
    ).toBe('/colors/0: must match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"');
  });

  test('error messages', () => {
    const validObject = {
      _id: 'MPNumberingStyle:231123-1233123-12331312',
      objectType: 'MPNumberingStyle',
      startIndex: 1,
    };

    expect(validate(Object.assign({}, validObject, { foobar: 1 }))).toBe(
      "must NOT have additional properties 'foobar'"
    );
  });

  test('_id property', () => {
    const validObject = {
      objectType: 'MPTOCElement',
      _id: 'MPTOCElement:E3391685EDA9',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      containerID: 'MPProject:foo-bar-baz',
      manuscriptID: 'MPManuscript:zorb',
      elementType: 'p',
      contents: 'Foo',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          _id: 'MPTOCElement:Z5326C7B-836D-4D6C-81EB-7E6CA6153E9A',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          _id: 'MPTOCElement:biology',
        })
      )
    ).toBeNull();
  });

  test('containerID property', () => {
    const validObject = {
      objectType: 'MPTOCElement',
      _id: 'MPTOCElement:E3391685EDA9',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      elementType: 'p',
      contents: 'Foo',
      manuscriptID: 'MPManuscript:potato',
    };

    expect(
      validate(Object.assign({}, validObject, { containerID: 'MPProject:bar' }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { containerID: 'zPFoo:bar' }))
    ).toBe(
      '/containerID: must match pattern "^(MPProject|MPLibrary|MPLibraryCollection):[0-9a-zA-Z\\-]+"'
    );

    expect(validate(validObject)).toBe(
      "must have required property 'containerID'"
    );

    expect(
      validate(Object.assign({}, validObject, { containerID: 'MPPotato:1000' }))
    ).toBe(
      '/containerID: must match pattern "^(MPProject|MPLibrary|MPLibraryCollection):[0-9a-zA-Z\\-]+"'
    );
  });

  test('manuscriptID property', () => {
    const validObject = {
      objectType: 'MPTOCElement',
      _id: 'MPTOCElement:E3391685EDA9',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      elementType: 'p',
      contents: 'Foo',
      containerID: 'MPProject:potato',
    };

    expect(
      validate(
        Object.assign({}, validObject, { manuscriptID: 'MPManuscript:bar' })
      )
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { manuscriptID: 'zPFoo:bar' }))
    ).toBe(
      '/manuscriptID: must match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"'
    );

    expect(validate(validObject)).toBe(
      "must have required property 'manuscriptID'"
    );

    expect(
      validate(
        Object.assign({}, validObject, { manuscriptID: 'MPPotato:1000' })
      )
    ).toBe('/manuscriptID: must match pattern "^MPManuscript:"');
  });

  test('bibliography element', () => {
    const validObject = {
      updatedAt: 1454537867.959872,
      objectType: 'MPBibliographyElement',
      _id: 'MPBibliographyElement:8C7F2071-29B1-4D2A-F884-E3391685EDA9',
      contents: 'foo',
      elementType: 'table',
      manuscriptID: 'MPManuscript:zorb',
      createdAt: 1454394584,
      containerID: 'MPProject:potato',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          paragraphStyle:
            'MPParagraphStyle:655CA525-623F-40CD-915E-9FB3BDFB833B',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, { paragraphStyle: 'MPNotPara:24421' })
      )
    ).toBe('/paragraphStyle: must match pattern "^MPParagraphStyle:"');
  });

  test('toc element', () => {
    const validObject = {
      objectType: 'MPTOCElement',
      _id: 'MPTOCElement:E3391685EDA9',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      elementType: 'p',
      contents: 'Foo',
      manuscriptID: 'MPManuscript:zorb',
      containerID: 'MPProject:potato',
    };

    expect(validate(validObject)).toBeNull();

    const { contents, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'contents'"
    );
  });

  test('listing element', () => {
    const validObject = {
      objectType: 'MPListingElement',
      _id: 'MPListingElement:E3391685EDA9',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      elementType: 'figure',
      caption: 'An example listing.',
      manuscriptID: 'MPManuscript:zorb',
      containedObjectID: 'MPBar:100',
      containerID: 'MPProject:potato',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { elementType: 'h1' }))
    ).toBe('/elementType: must be equal to one of the allowed values');

    const { caption, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'caption'"
    );
  });

  test('equation element', () => {
    const validObject = {
      objectType: 'MPEquationElement',
      _id: 'MPEquationElement:E3391685EDA9',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      elementType: 'p',
      caption: 'An example equation.',
      manuscriptID: 'MPManuscript:zorb',
      containedObjectID: 'MPBar:100',
      containerID: 'MPProject:potato',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          assignees: ['MPUserProfile:user'],
          deadline: 1515417692,
          status: 'MPStatusLabel:label',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, { status: 'MPFoo:1231231233123' })
      )
    ).toBe('/status: must match pattern "^MPStatusLabel:"');

    expect(
      validate(
        Object.assign({}, validObject, { assignees: 'MPUserProfile:user' })
      )
    ).toBe('/assignees: must be array');

    expect(
      validate(Object.assign({}, validObject, { suppressCaption: true }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { elementType: 'div' }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { elementType: 'foo' }))
    ).toBe('/elementType: must be equal to one of the allowed values');

    const { caption, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'caption'"
    );
  });

  test('footnotes element', () => {
    const validObject = {
      objectType: 'MPFootnotesElement',
      _id: 'MPFootnotesElement:E3391685EDA9',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      elementType: 'p',
      contents: 'Foo',
      manuscriptID: 'MPManuscript:zorb',
      containerID: 'MPProject:potato',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          collateByKind: 'MPFootnoteKindFootnote',
        })
      )
    ).toBeNull();

    const { contents, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'contents'"
    );
  });

  test('figure element', () => {
    const validObject = {
      containedObjectIDs: ['MPFigure:DE6E7B4A-C84D-4DC0-8C2A-2FE71DCF1C5F'],
      figureLayout: 'MPFigureLayout:E173019C-00BB-415E-926A-D0C57ED43303',
      figureStyle: 'MPFigureStyle:E173019C-00BB-415E-926A-D0C57ED43303',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      objectType: 'MPFigureElement',
      containerID: 'MPProject:990DC4B9-4AAE-4AEF-8630-04929F53B8EC',
      elementType: 'figure',
      manuscriptID: 'MPManuscript:841DAFAD-2CBF-4F88-876B-45E9B766A4C',
      alternatives: [
        {
          type: 'interactive',
          src: 'attachment:be0806dd-be82-47db-8f47-c4edf79ba9d0',
        },
        {
          type: 'dataset',
          src: 'attachment:be0806dd-be82-47db-8f47-c4edf79ba9d0',
        },
      ],
      _id: 'MPFigureElement:DF026E1B-394A-4A68-C761-9DB39349A714',
      label: '',
      suppressCaption: false,
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, { figureStyle: 'MPNotFigure:24421' })
      )
    ).toBe('/figureStyle: must match pattern "^MPFigureStyle:"');

    expect(
      validate(Object.assign({}, validObject, { suppressCaption: 1 }))
    ).toBe('/suppressCaption: must be boolean');

    expect(
      validate(Object.assign({}, validObject, { figureStyle: undefined }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { sizeFraction: 0.5 }))
    ).toBeNull();

    expect(validate(Object.assign({}, validObject, { sizeFraction: 50 }))).toBe(
      '/sizeFraction: must be <= 2'
    );

    expect(
      validate(Object.assign({}, validObject, { sizeFraction: '0.5' }))
    ).toBe('/sizeFraction: must be number');

    expect(
      validate(Object.assign({}, validObject, { alignment: 'center' }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { alignment: 'centre' }))
    ).toBe('/alignment: must be equal to one of the allowed values');

    expect(
      validate(Object.assign({}, validObject, { elementType: 'img' }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { elementType: 'frame' }))
    ).toBe('/elementType: must be equal to one of the allowed values');

    expect(
      validate(
        Object.assign({}, validObject, {
          alternatives: [
            {
              type: 'invalid',
              src: 'attachment:be0806dd-be82-47db-8f47-c4edf79ba9d0',
            },
          ],
        })
      )
    ).toBe('/alternatives/0/type: must be equal to one of the allowed values');
  });

  test('footnotes order', () => {
    const validObject = {
      objectType: 'MPFootnotesOrder',
      _id: 'MPFootnotesOrder:E3391685EDA9',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      footnotesList: [
        {
          id: 'MPFootnote:B659C104-C20B-4571-B597-84A6AF85D2BC',
          index: 0,
        },
      ],
      manuscriptID: 'MPManuscript:zorb',
      containerID: 'MPProject:potato',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          footnotesList: [
            {
              id: 'B659C104-C20B-4571-B597-84A6AF85D2BC',
              index: 0,
            },
          ],
        })
      )
    ).toBe(
      '/footnotesList/0/id: must match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"'
    );

    const { footnotesList, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'footnotesList'"
    );
  });

  test('list element', () => {
    const validObject = {
      _id: 'MPListElement:3E3C0A32-431A-4E60-AE12-07B1317C952E',
      objectType: 'MPListElement',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      elementType: 'ul',
      paragraphStyle: 'MPParagraphStyle:EB203751-238B-467A-A0A2-5BC6115FC960',
      contents: 'foo',
      containerID: 'MPProject:990DC4B9-4AAE-4AEF-8630-04929F53B8EC',
      manuscriptID: 'MPManuscript:841DAFAD-2CBF-4F88-876B-45E9B766A4C',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { elementType: 'foo' }))
    ).toBe('/elementType: must be equal to one of the allowed values');
  });

  test('table element', () => {
    const validObject = {
      updatedAt: 1454537867.959872,
      objectType: 'MPTableElement',
      suppressFooter: true,
      _id: 'MPTableElement:8C7F2071-29B1-4D2A-F884-E3391685EDA9',
      elementType: 'table',
      manuscriptID: 'MPManuscript:zorb',
      tableStyle: 'MPTableStyle:6C38D4AD-D718-4B4B-8AE9-05B567D2F203',
      paragraphStyle: 'MPParagraphStyle:655CA525-623F-40CD-915E-9FB3BDFB833B',
      createdAt: 1454394584,
      containerID: 'MPProject:potato',
      containedObjectID: 'MPTable:F40C327C-C02E-4A6E-8222-D9D0287E6864',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, { tableStyle: 'MPNotTable:24421' })
      )
    ).toBe('/tableStyle: must match pattern "^MPTableStyle:"');

    expect(
      validate(
        Object.assign({}, validObject, { paragraphStyle: 'MPNotPara:24421' })
      )
    ).toBe('/paragraphStyle: must match pattern "^MPParagraphStyle:"');

    expect(
      validate(Object.assign({}, validObject, { title: 'caption title' }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { suppressCaption: true }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { suppressTitle: true }))
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, { containedObjectID: '2424-4224' })
      )
    ).toBe(
      '/containedObjectID: must match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"'
    );

    expect(
      validate(Object.assign({}, validObject, { containedObjectID: undefined }))
    ).toBe("must have required property 'containedObjectID'");

    expect(
      validate({
        ...validObject,
        label: 'Table 1',
      })
    ).toBeNull();

    expect(
      validate({
        ...validObject,
        label: 1,
      })
    ).toBe('/label: must be string');

    expect(
      validate({
        ...validObject,
        caption: 'An example table',
      })
    ).toBeNull();

    expect(
      validate({
        ...validObject,
        caption: 1,
      })
    ).toBe('/caption: must be string');
  });

  test('figure style', () => {
    const validObject = {
      _id: 'MPFigureStyle:test',
      objectType: 'MPFigureStyle',
      updatedAt: 1,
      createdAt: 1,
      captionPosition: 'top',
      innerBorder: {
        _id: 'MPBorder:test',
        objectType: 'MPBorder',
        width: 2,
      },
      manuscriptID: 'MPManuscript:test',
      containerID: 'MPProject:potato',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { captionPosition: undefined }))
    ).toBe("must have required property 'captionPosition'");

    expect(
      validate(Object.assign({}, validObject, { captionPosition: 'inside' }))
    ).toBe('/captionPosition: must be equal to one of the allowed values');

    expect(
      validate(Object.assign({}, validObject, { alignment: 'justify' }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { alignment: 'justified' }))
    ).toBe('/alignment: must be equal to one of the allowed values');
  });

  test('inline style', () => {
    const validObject = {
      _id: 'MPInlineStyle:test',
      objectType: 'MPInlineStyle',
      updatedAt: 1,
      createdAt: 1,
      manuscriptID: 'MPManuscript:test',
      containerID: 'MPProject:potato',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { title: 'test' }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { priority: 10 }))
    ).toBeNull();
  });

  test('table style', () => {
    const validObject = {
      _id: 'MPTableStyle:test',
      objectType: 'MPTableStyle',
      updatedAt: 1,
      createdAt: 1,
      manuscriptID: 'MPManuscript:test',
      containerID: 'MPProject:potato',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { captionPosition: 'top' }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { captionPosition: 'inside' }))
    ).toBe('/captionPosition: must be equal to one of the allowed values');

    expect(
      validate(Object.assign({}, validObject, { alignment: 'justify' }))
    ).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { alignment: 'justified' }))
    ).toBe('/alignment: must be equal to one of the allowed values');
  });

  test('equation', () => {
    const validObject = {
      _id: 'MPEquation:foo',
      createdAt: 21312312.1,
      updatedAt: 23123123,
      objectType: 'MPEquation',
      containerID: 'MPProject:bar',
      manuscriptID: 'MPManuscript:baz',
      TeXRepresentation: '{}',
    };

    expect(validate(validObject)).toBeNull();

    const { TeXRepresentation, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'TeXRepresentation'"
    );
  });

  test('footnote', () => {
    const validObject = {
      _id: 'MPFootnote:foo',
      createdAt: 21312312.1,
      updatedAt: 23123123,
      objectType: 'MPFootnote',
      containerID: 'MPProject:bar',
      manuscriptID: 'MPManuscript:baz',
      contents: 'foo',
      containingObject: 'MPFo:1o',
      kind: 'footnote',
    };

    expect(validate(validObject)).toBeNull();

    expect(validate({ ...validObject, kind: 'footnote' })).toBeNull();

    expect(validate({ ...validObject, kind: 'foonote' })).toBe(
      '/kind: must be equal to one of the allowed values'
    );
  });

  test('corresp', () => {
    const validObject = {
      _id: 'MPCorresponding:foo',
      createdAt: 21312312.1,
      updatedAt: 23123123,
      objectType: 'MPCorresponding',
      containerID: 'MPProject:bar',
      manuscriptID: 'MPManuscript:baz',
      contents: 'foo',
    };

    expect(validate(validObject)).toBeNull();

    expect(validate({ ...validObject, contents: undefined })).toBe(
      "must have required property 'contents'"
    );
  });

  test('listing', () => {
    const validObject = {
      _id: 'MPListing:foo',
      createdAt: 21312312.1,
      updatedAt: 23123123,
      objectType: 'MPListing',
      containerID: 'MPProject:bar',
      manuscriptID: 'MPManuscript:baz',
      contents: 'foo',
      language: 'teascript',
      languageKey: 'obj-t',
      externalFileReferences: [
        {
          url: 'attachment:de864936-d319-4705-8278-6b0be53a70cc',
          kind: 'imageRepresentation',
        },
      ],
    };

    expect(validate(validObject)).toBeNull();

    const { language, ...objectWithoutLanguage } = Object.assign(
      {},
      validObject
    );

    expect(validate(objectWithoutLanguage)).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { title: 'Great code' }))
    ).toBeNull();
  });

  test('table', () => {
    const validObject = {
      _id: 'MPTable:foo',
      createdAt: 21312312.1,
      updatedAt: 23123123,
      objectType: 'MPTable',
      containerID: 'MPProject:bar',
      manuscriptID: 'MPManuscript:baz',
      contents: 'bar',
    };

    expect(validate(validObject)).toBeNull();

    const { contents, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'contents'"
    );

    const validObjectWithListingAttachment = {
      _id: 'MPTable:foo',
      createdAt: 21312312.1,
      updatedAt: 23123123,
      objectType: 'MPTable',
      containerID: 'MPProject:bar',
      manuscriptID: 'MPManuscript:baz',
      contents: 'bar',
      listingAttachment: {
        listingID: 'MPListing:X',
        attachmentKey: 'X',
      },
    };

    expect(validate(validObjectWithListingAttachment)).toBeNull();
  });

  test('figure', () => {
    const validObject = {
      _id: 'MPFigure:foo',
      updatedAt: 213123123.1,
      createdAt: 213123123.1,
      objectType: 'MPFigure',
      containerID: 'MPProject:bar',
      manuscriptID: 'MPManuscript:baz',
      contentType: 'bar',
    };

    expect(validate(validObject)).toBeNull();

    const { contentType, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBeNull();
  });

  test('auxiliary object reference', () => {
    const validObject = {
      _id: 'MPAuxiliaryObjectReference:231123-1233123-12331312',
      objectType: 'MPAuxiliaryObjectReference',
      containingObject: 'MPProject:foo-bar-baz',
      referencedObject: 'MPManuscript:23111',
      auxiliaryObjectReferenceStyle: 'MPAffiliation:foo-bar',
      containerID: 'MPProject:123123',
      createdAt: 123123123,
      updatedAt: 123123123,
    };

    expect(validate(validObject)).toBeNull();

    const validObjectWithMultipleReferences = {
      _id: 'MPAuxiliaryObjectReference:231123-1233123-12331312',
      objectType: 'MPAuxiliaryObjectReference',
      containingObject: 'MPProject:foo-bar-baz',
      referencedObjects: ['MPFigure:test1', 'MPFigure:test2'],
      auxiliaryObjectReferenceStyle: 'MPAffiliation:foo-bar',
      containerID: 'MPProject:123123',
      createdAt: 123123123,
      updatedAt: 123123123,
    };

    expect(validate(validObjectWithMultipleReferences)).toBeNull();
  });

  test('auxiliary object elements order', () => {
    const validObject = {
      _id: 'MPElementsOrder:1',
      elementType: 'MPFigureElement',
      elements: ['MPFigureElement:test1', 'MPFigureElement:test2'],
      containerID: 'MPProject:test',
      manuscriptID: 'MPManuscript:test',
      createdAt: 123123123,
      updatedAt: 123123123,
      objectType: 'MPElementsOrder',
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(
        Object.assign(
          {
            _id: 'MPElementsOrder:2',
            elementType: 'MPTableElement',
            elements: ['MPTableElement:test1', 'MPTableElement:test2'],
          },
          validObject
        )
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign(
          {
            _id: 'MPElementsOrder:3',
            elementType: 'MPEquationElement',
            elements: ['MPEquationElement:test1', 'MPEquationElement:test2'],
          },
          validObject
        )
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign(
          {
            _id: 'MPElementsOrder:4',
            elementType: 'MPListingElement',
            elements: ['MPListingElement:test1', 'MPListingElement:test2'],
          },
          validObject
        )
      )
    ).toBeNull();

    const { elements, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'elements'"
    );
  });

  test('inline math fragment', () => {
    const validObject = {
      _id: 'MPInlineMathFragment:foo',
      createdAt: 12312312.1,
      updatedAt: 12312312.1,
      objectType: 'MPInlineMathFragment',
      containerID: 'MPProject:bar',
      containingObject: 'MPParagraphElement:baz',
      TeXRepresentation: '{}',
    };

    expect(validate(validObject)).toBeNull();

    const { TeXRepresentation, ...invalidObject } = validObject;
    expect(validate(invalidObject)).toBe(
      "must have required property 'TeXRepresentation'"
    );

    expect(
      validate(
        Object.assign({}, validObject, {
          SVGRepresentation: '<>',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          MathMLRepresentation: '()',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          SVGGlyphs: '<>',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          OMMLRepresentation: '-',
        })
      )
    ).toBeNull();
  });

  test('invitation', () => {
    const validObjectA = {
      _id: 'MPInvitation:5480f0bfe3b0f69beb8fe360adab156e06c614ff',
      invitingUserID: 'User_valid-user@manuscriptsapp.com',
      invitedUserEmail: 'valid-google@manuscriptsapp.com',
      invitedUserID: 'User_valid-google@manuscriptsapp.com',
      invitingUserProfile: {
        _id: 'MPUserProfile:foo-bar-baz',
        objectType: 'MPUserProfile',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        bibliographicName: {
          _id: 'MPBibliographicName:foo-bar-baz',
          objectType: 'MPBibliographicName',
          createdAt: 1515417692.477127,
          updatedAt: 1515494608.363229,
        },
        userID: 'User_foobar@manuscriptsapp.com',
      },
      message: 'Message',
      createdAt: 1522231220.927,
      updatedAt: 1522231220.927,
      objectType: 'MPInvitation',
    };

    const { message, ...validObjectB } = validObjectA;
    const { invitedUserEmail, ...invalidObjectA } = validObjectA;
    const { invitingUserID, ...invalidObjectB } = validObjectA;

    expect(validate(validObjectA)).toBeNull();
    expect(validate(validObjectB)).toBeNull();
    expect(validate(invalidObjectA)).toBe(
      "must have required property 'invitedUserEmail'"
    );

    expect(validate(invalidObjectB)).toBe(
      "must have required property 'invitingUserID'"
    );
  });

  test('project invitation', () => {
    const validObjectA = {
      _id: 'MPContainerInvitation:b849af0d7a9076cd0302f22812fbe0a14633219b',
      invitingUserID: 'User_valid-user@manuscriptsapp.com',
      invitedUserEmail: 'valid-google@manuscriptsapp.com',
      containerID: 'MPProject:valid-project-id-2',
      containerTitle: 'Valid Project 2',
      invitedUserName: 'Valid User',
      role: 'Viewer',
      acceptedAt: 2000000000,
      invitingUserProfile: {
        _id: 'MPUserProfile:foo-bar-baz',
        objectType: 'MPUserProfile',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        bibliographicName: {
          _id: 'MPBibliographicName:foo-bar-baz',
          objectType: 'MPBibliographicName',
          createdAt: 1515417692.477127,
          updatedAt: 1515494608.363229,
        },
        userID: 'User_foobar@manuscriptsapp.com',
      },
      message: 'Message',
      createdAt: 1522231220.927,
      updatedAt: 1522231220.927,
      objectType: 'MPContainerInvitation',
    };

    const { message, ...validObjectB } = validObjectA;
    const { containerTitle, ...validObjectC } = validObjectA;
    const { invitedUserName, ...validObjectD } = validObjectA;
    const { invitedUserEmail, ...invalidObjectA } = validObjectA;
    const { invitingUserID, ...invalidObjectB } = validObjectA;
    const { containerID, ...invalidObjectC } = validObjectA;
    const { role, ...invalidObjectD } = validObjectA;
    const { acceptedAt, ...invalidObjectE } = validObjectA;

    expect(validate(validObjectA)).toBeNull();

    expect(validate(validObjectB)).toBeNull();

    expect(validate(validObjectC)).toBeNull();

    expect(validate(validObjectD)).toBeNull();

    expect(validate(invalidObjectE)).toBeNull();

    expect(validate(invalidObjectA)).toBe(
      "must have required property 'invitedUserEmail'"
    );

    expect(validate(invalidObjectB)).toBe(
      "must have required property 'invitingUserID'"
    );

    expect(validate(invalidObjectC)).toBe(
      "must have required property 'containerID'"
    );

    expect(validate(invalidObjectD)).toBe("must have required property 'role'");
  });

  test('section category', () => {
    const validObject = {
      _id: 'MPSectionCategory:cover-letter',
      name: 'Cover Letter',
      desc: 'A letter sent along with your manuscript to explain it.',
      objectType: 'MPSectionCategory',
      singular: true,
      priority: 2000,
      containerID: 'MPProject:foo',
      manuscriptID: 'MPManuscript:baz',
      updatedAt: 1515494608.245375,
      createdAt: 1515417692.476143,
      uniqueInScope: true,
      supplementary: true,
      titles: ['cover letter', 'coverletter'],
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { titleSuppressed: true }))
    ).toBeNull();

    expect(validate(Object.assign({}, validObject, { titles: [] }))).toBe(
      '/titles: must NOT have fewer than 1 items'
    );

    expect(
      validate(Object.assign({}, validObject, { titles: undefined }))
    ).toBe("must have required property 'titles'");

    expect(
      validate(
        Object.assign({}, validObject, {
          numberingParticipation: 0,
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          numberingParticipation: 2,
        })
      )
    ).toBe(
      '/numberingParticipation: must be equal to one of the allowed values'
    );

    expect(
      validate(
        Object.assign({}, validObject, {
          numberingParticipation: '1',
        })
      )
    ).toBe('/numberingParticipation: must be integer');
  });

  test('manuscript priority', () => {
    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        priority: 10,
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        priority: '10',
      })
    ).toBe('/priority: must be integer');
  });

  test('manuscript headerFigure', () => {
    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 0,
        updatedAt: 0,
        objectType: 'MPManuscript',
        containerID: 'MPProject:test',
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        headerFigure: 'MPFigure:test',
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        headerFigure: 'MPFig:test',
      })
    ).toBe('/headerFigure: must match pattern "^MPFigure:"');
  });

  test('manuscript DOI', () => {
    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 0,
        updatedAt: 0,
        objectType: 'MPManuscript',
        containerID: 'MPProject:test',
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        DOI: '10.0000/foo',
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        DOI: '100000',
      })
    ).toBe('/DOI: must match pattern "^10\\.[0-9]+/"');
  });

  test('manuscript title', () => {
    const validObject = {
      _id: 'MPManuscript:foo',
      createdAt: 0,
      updatedAt: 0,
      objectType: 'MPManuscript',
      containerID: 'MPProject:test',
    };

    expect(validate({ ...validObject })).toBeNull();

    expect(
      validate({
        ...validObject,
        title: 'The Title',
        subtitle: 'The Subtitle',
        runningTitle: 'The Running Title',
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        title: 1,
      })
    ).toBe('/title: must be string');
  });

  test('manuscript keyword', () => {
    expect(
      validate({
        _id: 'MPManuscriptKeyword:test',
        createdAt: 0,
        updatedAt: 0,
        objectType: 'MPManuscriptKeyword',
        containerID: 'MPProject:test',
        name: 'test',
        priority: 1,
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscriptKeyword:test',
        createdAt: 0,
        updatedAt: 0,
        objectType: 'MPManuscriptKeyword',
        containerID: 'MPProject:test',
        name: 'test',
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscriptKeyword:test',
        createdAt: 0,
        updatedAt: 0,
        objectType: 'MPManuscriptKeyword',
        containerID: 'MPProject:test',
      })
    ).toBe("must have required property 'name'");
  });

  test('manuscript keywords', () => {
    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 0,
        updatedAt: 0,
        objectType: 'MPManuscript',
        containerID: 'MPProject:test',
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        DOI: '10.0000/foo',
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        DOI: '10.0000/foo',
      })
    ).toBeNull();
  });

  test('comment', () => {
    const validObject = {
      _id: 'MPCommentAnnotation:foo',
      createdAt: 21312312.1,
      updatedAt: 23123123,
      objectType: 'MPCommentAnnotation',
      containerID: 'MPProject:bar',
      manuscriptID: 'MPManuscript:baz',
      contents: 'bar',
      target: 'MPParagraphElement:foo',
      originalText: '',
    };

    expect(validate(validObject)).toBeNull();

    const { contents, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'contents'"
    );

    expect(validate(Object.assign({ foo: 123 }, validObject))).toBe(
      "must NOT have additional properties 'foo'"
    );

    expect(validate(Object.assign({ resolved: true }, validObject))).toBeNull();

    expect(validate(Object.assign({ resolved: 'foo' }, validObject))).toBe(
      '/resolved: must be boolean'
    );
  });

  test('user project', () => {
    const validObject = {
      _id: 'MPUserProject:foo',
      objectType: 'MPUserProject',
      userID: 'MPUserProfile:bar',
      projectID: 'MPProject:bar',
      lastOpened: {
        xyz: {
          timestamp: 1234,
          manuscriptID: 'MPManuscript:abc',
          sectionID: 'MPSection:abc',
        },
      },
      createdAt: 21312312.1,
      updatedAt: 23123123,
    };

    expect(validate(validObject)).toBeNull();

    const { userID, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'userID'"
    );

    const invalidManuscriptID = {
      abc: {
        timestamp: 123123,
        sectionID: 'MPSection:foo',
        manuscriptID: 'MPProject:foo',
      },
    };

    const invalidObject2 = Object.assign(
      {},
      { ...validObject, lastOpened: invalidManuscriptID }
    );

    expect(validate(invalidObject2)).toBe(
      '/lastOpened/abc/manuscriptID: must match pattern "^MPManuscript:"'
    );

    const invalidSectionID = {
      abc: {
        timestamp: 123123,
        sectionID: 'MPProject:foo',
        manuscriptID: 'MPManuscript:foo',
      },
    };

    const invalidObject3 = Object.assign(
      {},
      { ...validObject, lastOpened: invalidSectionID }
    );

    expect(validate(invalidObject3)).toBe(
      '/lastOpened/abc/sectionID: must match pattern "^MPSection:"'
    );

    const invalidLastOpenedProperties = {
      abc: {
        timestamp: 123123,
        foobar: 'foobar',
        manuscriptID: 'MPManuscript:foo',
      },
    };

    const invalidObject4 = Object.assign(
      {},
      { ...validObject, lastOpened: invalidLastOpenedProperties }
    );

    expect(validate(invalidObject4)).toBe(
      "must NOT have additional properties 'foobar'"
    );
  });

  test('MPPublisher', () => {
    const validObject = {
      _id: `MPPublisher:XYZ`,
      objectType: 'MPPublisher',
      name: 'Kevin',
      websiteURL: 'www.kevinsURL.com',
      canArchivePreprint: false,
      canArchivePostprint: false,
      synonyms: ['abc'],
      createdAt: 21312312.1,
      updatedAt: 23123123,
    };

    expect(validate(validObject)).toBeNull();

    const { name, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe("must have required property 'name'");

    expect(validate(Object.assign({ foo: 'xyz' }, validObject))).toBe(
      "must NOT have additional properties 'foo'"
    );
  });

  test('MPSectionDescription', () => {
    const validObject = {
      _id: `MPSectionDescription:XYZ`,
      objectType: 'MPSectionDescription',
      sectionCategory: 'MPSectionCategory:ABC',
      required: true,
      title: 'Awesome Description',
      placeholder: 'Awesome Placeholder',
      titles: ['abc'],
      subsections: [
        { title: 'title1' },
        { title: 'title2', placeholder: 'placeholder2' },
      ],
      maxWordCount: 100,
      minWordCount: 30,
      maxKeywordCount: 200,
      minKeywordCount: 40,
      maxTitleCharLength: 40,
      maxReferenceCount: 30,
      priority: 3,
    };

    expect(validate(validObject)).toBeNull();

    const { sectionCategory, ...invalidObject } = Object.assign(
      {},
      validObject
    );

    expect(validate(invalidObject)).toBe(
      "must have required property 'sectionCategory'"
    );

    expect(validate(Object.assign({ foo: 'xyz' }, validObject))).toBe(
      "must NOT have additional properties 'foo'"
    );

    expect(validate(Object.assign({}, validObject, { priority: 'x' }))).toBe(
      '/priority: must be number'
    );

    const invalidSubsectionObject = validObject;
    //@ts-ignore
    invalidSubsectionObject.subsections.push('abc');

    expect(validate(invalidSubsectionObject)).toBe(
      '/subsections/2: must be object'
    );
  });

  test('MPManuscriptTemplate', () => {
    const validObject = {
      _id: 'MPManuscriptTemplate:1',
      objectType: 'MPManuscriptTemplate',
      containerID: 'MPProject:1',
      category: 'MPManuscriptCategory:1',
      title: 'Foo',
      createdAt: 0,
      updatedAt: 0,
      mandatorySectionRequirements: ['MPMandatorySubsectionsRequirement:1'],
    };

    expect(validate(validObject)).toBeNull();

    expect(validate(Object.assign({}, validObject, { title: undefined }))).toBe(
      "must have required property 'title'"
    );

    expect(validate(Object.assign({}, validObject, { foo: 'xyz' }))).toBe(
      "must NOT have additional properties 'foo'"
    );

    expect(
      validate(Object.assign({}, validObject, { containerID: undefined }))
    ).toBe("must have required property 'containerID'");

    expect(
      validate(
        Object.assign({}, validObject, {
          minManuscriptTitleWordCountRequirement:
            'MPMinimumManuscriptTitleWordCountRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          minManuscriptTitleCharacterCountRequirement:
            'MPMinimumManuscriptTitleCharacterCountRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          maxFigureCountRequirement: 'MPMaximumFigureCountRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          maxManuscriptReferenceCountRequirement:
            'MPMaximumManuscriptReferenceCountRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          minFigureWidthPixelsRequirement: 'MPMinimumFigurePixelsRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          minFigureHeightPixelsRequirement:
            'MPMinimumFigurePixelsRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          maxFigureWidthPixelsRequirement: 'MPMaximumFigurePixelsRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          maxFigureHeightPixelsRequirement:
            'MPMaximumFigurePixelsRequirement:1',
        })
      )
    ).toBeNull();

    expect(
      validate(
        Object.assign({}, validObject, {
          maxManuscriptRunningTitleCharacterCountRequirement:
            'MPMaximumRunningTitleCharacterCountRequirement:1',
        })
      )
    ).toBeNull();
  });

  test('Manuscript validation results', () => {
    const common = {
      containerID: 'MPProject:test',
      manuscriptID: 'MPManuscript:test',
      createdAt: 0,
      updatedAt: 0,
      severity: 0,
      passed: true,
      fixable: false,
      ignored: false,
    };
    const sectionTitleValidationResult = {
      ...common,
      _id: 'MPSectionTitleValidationResult:1',
      objectType: 'MPSectionTitleValidationResult',
      type: 'section-title-match',
      data: { id: 'MPSection:1' },
    };
    expect(validate(sectionTitleValidationResult)).toBeNull();

    expect(
      validate({
        ...sectionTitleValidationResult,
        containerID: undefined,
      })
    ).toBe("must have required property 'containerID'");

    expect(
      validate({
        ...sectionTitleValidationResult,
        manuscriptID: undefined,
      })
    ).toBe("must have required property 'manuscriptID'");

    expect(
      validate({
        ...sectionTitleValidationResult,
        fixable: undefined,
      })
    ).toBeNull();

    expect(
      validate({
        ...sectionTitleValidationResult,
        severity: undefined,
      })
    ).toBe("must have required property 'severity'");

    expect(
      validate({
        ...sectionTitleValidationResult,
        passed: undefined,
      })
    ).toBe("must have required property 'passed'");

    expect(
      validate({
        ...sectionTitleValidationResult,
        passed: 1,
      })
    ).toBe('/passed: must be boolean');

    const sectionCategoryValidationResult = {
      ...common,
      _id: 'MPSectionCategoryValidationResult:1',
      objectType: 'MPSectionCategoryValidationResult',
      type: 'section-category-uniqueness',
      data: { id: 'MPSection:1' },
    };
    expect(validate(sectionCategoryValidationResult)).toBeNull();

    const sectionBodyValidationResult = {
      ...common,
      _id: 'MPSectionBodyValidationResult:1',
      objectType: 'MPSectionBodyValidationResult',
      type: 'section-body-has-content',
      data: { id: 'MPSection:1' },
    };
    expect(validate(sectionBodyValidationResult)).toBeNull();

    const requiredSectionValidationResult = {
      ...common,
      _id: 'MPRequiredSectionValidationResult:1',
      objectType: 'MPRequiredSectionValidationResult',
      type: 'required-section',
      data: {
        sectionCategory: 'MPSectionCategory:test',
        sectionDescription: {
          _id: 'MPSectionDescription:1',
          objectType: 'MPSectionDescription',
          sectionCategory: 'MPSectionCategory:test',
        },
      },
    };
    expect(validate(requiredSectionValidationResult)).toBeNull();

    const sectionOrderValidationResult = {
      ...common,
      _id: 'MPSectionOrderValidationResult:1',
      objectType: 'MPSectionOrderValidationResult',
      type: 'section-order',
      data: {
        order: ['MPSectionCategory:Introduction', 'MPSectionCategory:Summary'],
      },
    };
    expect(validate(sectionOrderValidationResult)).toBeNull();

    const figureFormatValidationResult = {
      ...common,
      _id: 'MPFigureFormatValidationResult:1',
      objectType: 'MPFigureFormatValidationResult',
      type: 'figure-format-validation',
      data: { contentType: 'test', allowedImageTypes: ['jpg', 'png', 'tiff'] },
    };
    expect(validate(figureFormatValidationResult)).toBeNull();

    const countValidationResult = {
      ...common,
      _id: 'MPCountValidationResult:1',
      objectType: 'MPCountValidationResult',
      type: 'manuscript-maximum-characters',
      data: { count: 10, value: 20 },
    };
    expect(validate(countValidationResult)).toBeNull();

    const bibliographyValidationResult = {
      ...common,
      _id: 'MPBibliographyValidationResult:1',
      objectType: 'MPBibliographyValidationResult',
      type: 'bibliography-doi-format',
      affectedElementId: 'MPCitation:1',
    };
    expect(validate(bibliographyValidationResult)).toBeNull();

    const keywordsOrderValidationResult = {
      ...common,
      _id: 'MPKeywordsOrderValidationResult:1',
      objectType: 'MPKeywordsOrderValidationResult',
      type: 'keywords-order',
      data: { order: ['MPKeyword:1', 'MPKeyword:2'] },
    };
    expect(validate(keywordsOrderValidationResult)).toBeNull();

    const figureResolution = {
      ...common,
      _id: 'MPFigureResolution:1',
      objectType: 'MPFigureResolution',
      type: 'figure-minimum-width-resolution',
      data: { count: 10, value: 20, dpi: 10 },
    };
    expect(validate(figureResolution)).toBeNull();

    const figureImageValidationResult = {
      ...common,
      _id: 'MPFigureImageValidationResult:1',
      objectType: 'MPFigureImageValidationResult',
      type: 'figure-contains-image',
      affectedElementId: 'MPFigure:1',
    };
    expect(validate(figureImageValidationResult)).toBeNull();
  });

  test('MPSubmission', () => {
    const submission = {
      _id: 'MPSubmission:submission-1',
      objectType: 'MPSubmission',
      submittedAt: 23123123,
      status: 'confirmed',
      journalCode: 'jcb',
      createdAt: 21312312.1,
      updatedAt: 23123123,
      containerID: 'MPProject:1',
      manuscriptID: 'MPManuscript:1',
    };

    expect(validate(submission)).toBeNull();

    expect(
      validate(
        Object.assign({}, submission, {
          containerID: undefined,
        })
      )
    ).toBe("must have required property 'containerID'");

    expect(
      validate(
        Object.assign({}, submission, {
          manuscriptID: undefined,
        })
      )
    ).toBe("must have required property 'manuscriptID'");
  });

  test('MPSnapshot', () => {
    const snapshot = {
      _id: 'MPSnapshot:snapshot-1',
      objectType: 'MPSnapshot',
      createdAt: 23123123,
      updatedAt: 23123123,
      creator: 'stephencongly@gmail.com',
      s3Id: 'idforgettingarchivefromglacier',
      proof: ['random#string*of/characters'],
      containerID: 'MPProject:my-project',
      name: 'My Snapshot',
    };

    expect(validate(snapshot)).toBeNull();
  });

  test('Manuscript Template with requirements', () => {
    const validObject = {
      _id: 'MPManuscriptTemplate:1',
      objectType: 'MPManuscriptTemplate',
      createdAt: 0,
      updatedAt: 0,
      containerID: 'MPProject:1',
      title: 'Test Template',
      coverLetterRequirement: 'MPManuscriptCoverLetterRequirement:1',
    };

    expect(validate(validObject)).toBeNull();
  });

  test('MPHighlight', () => {
    const highlight = {
      _id: 'MPHighlight:1',
      objectType: 'MPHighlight',
      createdAt: 21312312,
      updatedAt: 23123123,
      containerID: 'MPProject:1',
      manuscriptID: 'MPManuscript:1',
    };

    expect(validate(highlight)).toBeNull();

    expect(
      validate(
        Object.assign({}, highlight, {
          containerID: undefined,
        })
      )
    ).toBe("must have required property 'containerID'");

    expect(
      validate(
        Object.assign({}, highlight, {
          manuscriptID: undefined,
        })
      )
    ).toBe("must have required property 'manuscriptID'");
  });

  test('MPHighlightMarker', () => {
    const highlightMarker = {
      _id: 'MPHighlightMarker:2',
      highlightID: 'MPHighlight:2',
      objectType: 'MPHighlightMarker',
      offset: 13,
      start: true,
      field: 'title',
    };

    expect(validate(highlightMarker)).toBeNull();

    expect(
      validate(
        Object.assign({}, highlightMarker, {
          offset: undefined,
        })
      )
    ).toBe("must have required property 'offset'");

    expect(
      validate(
        Object.assign({}, highlightMarker, {
          start: undefined,
        })
      )
    ).toBe("must have required property 'start'");

    expect(
      validate(
        Object.assign({}, highlightMarker, {
          field: undefined,
        })
      )
    ).toBe("must have required property 'field'");

    expect(
      validate(Object.assign({}, highlightMarker, { field: 'nthTest' }))
    ).toBe('/field: must be equal to one of the allowed values');

    expect(
      validate(
        Object.assign({}, highlightMarker, { highlightID: 'test:match' })
      )
    ).toBe('/highlightID: must match pattern "^MPHighlight:[0-9a-zA-Z\\-]+"');

    expect(
      validate(Object.assign({}, highlightMarker, { offset: 'test' }))
    ).toBe('/offset: must be integer');

    expect(
      validate(Object.assign({}, highlightMarker, { start: 'true' }))
    ).toBe('/start: must be boolean');
  });

  test('MPKeywordsElement', () => {
    const keywordsElement = {
      _id: 'MPKeywordsElement:1',
      objectType: 'MPKeywordsElement',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      containerID: 'MPProject:foo-bar-baz',
      manuscriptID: 'MPManuscript:zorb',
      elementType: 'p',
      contents: 'test, testing',
    };

    expect(validate(keywordsElement)).toBeNull();

    expect(
      validate(
        Object.assign({}, keywordsElement, {
          contents: undefined,
        })
      )
    ).toBe("must have required property 'contents'");
  });

  test('referenced fields can not be empty', () => {
    const validObject = {
      containedObjectIDs: ['MPFigure:DE6E7B4A-C84D-4DC0-8C2A-2FE71DCF1C5F'],
      figureLayout: '',
      figureStyle: 'MPFigureStyle:E173019C-00BB-415E-926A-D0C57ED43303',
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
      objectType: 'MPFigureElement',
      containerID: 'MPProject:990DC4B9-4AAE-4AEF-8630-04929F53B8EC',
      elementType: 'figure',
      manuscriptID: 'MPManuscript:841DAFAD-2CBF-4F88-876B-45E9B766A4C',
      _id: 'MPFigureElement:DF026E1B-394A-4A68-C761-9DB39349A714',
      label: '',
      suppressCaption: false,
    };

    expect(validate(validObject, null)).toBe(
      '/figureLayout: must match pattern "^[A-Z][a-zA-Z]+:[0-9a-zA-Z\\-]+"'
    );
  });

  test('container request', () => {
    const validObject = {
      _id: 'MPContainerRequest:DF026E1B-394A-4A68-C761-9DB39349A714',
      objectType: 'MPContainerRequest',
      containerID: 'MPProject:990DC4B9-4AAE-4AEF-8630-04929F53B8EC',
      userID: 'User_foobar@manuscriptsapp.com',
      role: 'Writer',
      userProfile: {
        _id: 'MPUserProfile:foo-bar-baz',
        objectType: 'MPUserProfile',
        createdAt: 1515417692.477127,
        updatedAt: 1515494608.363229,
        bibliographicName: {
          _id: 'MPBibliographicName:foo-bar-baz',
          objectType: 'MPBibliographicName',
          createdAt: 1515417692.477127,
          updatedAt: 1515494608.363229,
        },
        userID: 'User_foobar@manuscriptsapp.com',
      },
      createdAt: 1454394584,
      updatedAt: 1454537867.959872,
    };

    expect(validate(validObject)).toBeNull();

    expect(validate(Object.assign({}, validObject, { role: 'Clown' }))).toBe(
      '/role: must be equal to one of the allowed values'
    );
  });

  test('quote element', () => {
    // valid quoteType
    expect(
      validate({
        _id: 'MPQuoteElement:test',
        objectType: 'MPQuoteElement',
        containerID: 'MPProject:test',
        manuscriptID: 'MPManuscript:test',
        elementType: 'div',
        quoteType: 'block',
        contents: 'test',
        createdAt: 0,
        updatedAt: 0,
      })
    ).toBeNull();

    // valid quoteType
    expect(
      validate({
        _id: 'MPQuoteElement:test',
        objectType: 'MPQuoteElement',
        containerID: 'MPProject:test',
        manuscriptID: 'MPManuscript:test',
        elementType: 'div',
        quoteType: 'pull',
        contents: 'test',
        createdAt: 0,
        updatedAt: 0,
      })
    ).toBeNull();

    // invalid quoteType
    expect(
      validate({
        _id: 'MPQuoteElement:test',
        objectType: 'MPQuoteElement',
        containerID: 'MPProject:test',
        manuscriptID: 'MPManuscript:test',
        elementType: 'div',
        quoteType: 'pullover',
        contents: 'test',
        createdAt: 0,
        updatedAt: 0,
      })
    ).toBe('/quoteType: must be equal to one of the allowed values');

    // contents required
    expect(
      validate({
        _id: 'MPQuoteElement:test',
        objectType: 'MPQuoteElement',
        containerID: 'MPProject:test',
        manuscriptID: 'MPManuscript:test',
        elementType: 'div',
        quoteType: 'block',
        createdAt: 0,
        updatedAt: 0,
      })
    ).toBe("must have required property 'contents'");
  });

  test('contributor role', () => {
    const validObject = {
      _id: 'MPContributorRole:test',
      objectType: 'MPContributorRole',
      containerID: 'MPProject:test',
      manuscriptID: 'MPManuscript:test',
      name: 'Test',
      priority: 1,
      createdAt: 0,
      updatedAt: 0,
    };

    // valid object
    expect(validate(validObject)).toBeNull();

    // valid with optional fields
    expect(
      validate({
        ...validObject,
        desc: 'A test role',
        uri: 'http://example.com',
      })
    ).toBeNull();

    // missing name
    expect(
      validate({
        ...validObject,
        name: undefined,
      })
    ).toBe("must have required property 'name'");
  });

  test('contributor roles', () => {
    const validObject = {
      _id: 'MPContributor:test',
      objectType: 'MPContributor',
      containerID: 'MPProject:test',
      manuscriptID: 'MPManuscript:test',
      bibliographicName: {
        _id: 'MPBibliographicName:test',
        objectType: 'MPBibliographicName',
      },
      createdAt: 0,
      updatedAt: 0,
    };

    // valid object
    expect(validate(validObject)).toBeNull();

    // valid object with one role
    expect(
      validate({
        ...validObject,
        roles: ['MPContributorRole:test'],
      })
    ).toBeNull();

    // valid object with empty roles array
    expect(
      validate({
        ...validObject,
        roles: [],
      })
    ).toBeNull();

    // invalid role id
    expect(
      validate({
        ...validObject,
        roles: ['MPContributor:oops'],
      })
    ).toBe('/roles/0: must match pattern "^MPContributorRole:"');
  });

  test('paragraph style', () => {
    const validObject = {
      _id: 'MPParagraphStyle:test',
      objectType: 'MPParagraphStyle',
      alignment: 'left',
      firstLineIndent: 4,
      headIndent: 4,
      kind: 'test',
      lineSpacing: 1.2,
      preferredXHTMLElement: 'p',
      tailIndent: 4,
      topSpacing: 4,
      manuscriptID: 'MPManuscript:test',
      containerID: 'MPProject:test',
      createdAt: 0,
      updatedAt: 0,
    };

    // valid object
    expect(validate(validObject)).toBeNull();

    // valid object with optional boolean properties
    expect(
      validate({ ...validObject, partOfTOC: true, runIn: true })
    ).toBeNull();

    // invalid object with optional boolean properties as strings
    expect(validate({ ...validObject, partOfTOC: 'true', runIn: 'true' })).toBe(
      '/partOfTOC: must be boolean'
    );
  });

  test('manuscript note', () => {
    const validObject = {
      _id: 'MPManuscriptNote:foo',
      createdAt: 21312312.1,
      updatedAt: 23123123,
      objectType: 'MPManuscriptNote',
      containerID: 'MPProject:bar',
      manuscriptID: 'MPManuscript:baz',
      contents: 'bar',
      target: 'MPManuscript:baz',
      originalText: '',
      source: 'EDITOR',
    };

    expect(validate(validObject)).toBeNull();

    const { contents, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'contents'"
    );
  });

  test('Requirements Validation', () => {
    const validObject = {
      _id: 'MPRequirementsValidation:D4F97FCC-2CD5-4D89-91DB-5833E4EB1C41',
      manuscriptID: 'MPManuscript:311BF2B2-F22E-4A04-8EE8-AA9F5F23C03B',
      containerID: 'MPProject:nevermore',
      objectType: 'MPRequirementsValidation',
      updatedAt: 1,
      createdAt: 1,
      results: [
        {
          manuscriptID: 'MPManuscript:1001',
          containerID: 'MPProject:B09F2B1A-BBD6-4AEA-9EAB-C471CB317EE3',
          passed: false,
          severity: 0,
          objectType: 'MPSectionBodyValidationResult',
          _id: 'MPSectionBodyValidationResult:EF2589B7-9F0E-4F58-929C-20740246498B',
          affectedElementId: 'MPSection:BBBA3AB0-5892-4F07-BCC9-DA69C5205DCA',
          message: 'Competing Interests section must contains content',
        },
      ],
    };

    const { results, ...invalidObject } = validObject;

    expect(validate(invalidObject)).toBe(
      "must have required property 'results'"
    );
  });

  test('Journal metadata', () => {
    const validObject = {
      _id: 'MPJournal:1',
      manuscriptID: 'MPManuscript:311BF2B2-F22E-4A04-8EE8-AA9F5F23C03B',
      containerID: 'MPProject:1',
      objectType: 'MPJournal',
      updatedAt: 1,
      createdAt: 1,
      ISSNs: [{ ISSN: '123/45', publicationType: 'print' }],
      abbreviatedTitles: [
        { abbreviatedTitle: 'title', abbrevType: 'publisher' },
      ],
      journalIdentifiers: [{ journalID: 'Some id', journalIDType: 'pmc' }],
      title: 'journal title',
      publisherName: 'publisher',
      submittable: false,
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { publisherName: 15 }))
    ).toBe('/publisherName: must be string');

    expect(
      validate(Object.assign({}, validObject, { submittable: 'test' }))
    ).toBe('/submittable: must be boolean');

    expect(validate(Object.assign({}, validObject, { ISSNs: [{}] }))).toBe(
      "/ISSNs/0: must have required property 'ISSN'"
    );
  });

  test('Keyword group', () => {
    const validObject = {
      _id: 'MPKeywordGroup:1',
      manuscriptID: 'MPManuscript:311BF2B2-F22E-4A04-8EE8-AA9F5F23C03B',
      containerID: 'MPProject:1',
      objectType: 'MPKeywordGroup',
      updatedAt: 1,
      createdAt: 1,
      title: 'keyword title',
      label: 'label',
      type: 'author',
    };

    expect(validate(validObject)).toBeNull();

    expect(validate(Object.assign({}, validObject, { title: 15 }))).toBe(
      '/title: must be string'
    );
  });

  test('Validate manuscript history', () => {
    const validObject = {
      _id: 'MPManuscript:foo',
      createdAt: 12312312.1,
      updatedAt: 12312312.1,
      objectType: 'MPManuscript',
      containerID: 'MPProject:bar',
      revisionReceiveDate: 2000000,
      receiveDate: 20000000,
      retractionDate: 2000000,
    };
    expect(validate(validObject)).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { revisionReceiveDate: '4878' }))
    ).toBe('/revisionReceiveDate: must be number');

    expect(
      validate(Object.assign({}, validObject, { receiveDate: false }))
    ).toBe('/receiveDate: must be number');
  });
  test('Manuscript counts', () => {
    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        wordCount: 10,
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        tableCount: 10,
      })
    ).toBeNull();

    expect(
      validate({
        _id: 'MPManuscript:foo',
        createdAt: 12312312.1,
        updatedAt: 12312312.1,
        objectType: 'MPManuscript',
        containerID: 'MPProject:bar',
        tableCount: '10',
      })
    ).toBe('/tableCount: must be number');
  });
  test('MetaSection', () => {
    const validObject = {
      updatedAt: 1515494608.245375,
      objectType: 'MPMetaSection',
      containerID: 'MPProject:foo-bar-baz',
      _id: 'MPMetaSection:15326C7B-836D-4D6C-81EB-7E6CA6153E9A',
      manuscriptID: 'MPManuscript:zorb',
      createdAt: 1515417692.476143,
    };

    expect(validate(validObject)).toBeNull();

    expect(
      validate(Object.assign({}, validObject, { objectType: 'WBSomething' }))
    ).toBe('unsupported objectType: WBSomething');
  });
});
