const validate = require('../../dist/cjs/validate').validate

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

        expect(validate(validObject)).toBe('must NOT have additional properties \'id\'');
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
        expect(validate(Object.assign({}, validObject, { pattern: 1 }))).toBe('/pattern: must be array');
    });
});