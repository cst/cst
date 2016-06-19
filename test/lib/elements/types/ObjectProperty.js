import {
    parseAndGetObjectProperty,
    parseAndGetObjectPropertyDefaultValue
} from '../../../utils';

import {expect} from 'chai';

describe('ObjectProperty', () => {
    it('should return correct type', () => {
        const property = parseAndGetObjectProperty('x: 1');
        expect(property.type).to.equal('ObjectProperty');
        expect(property.key.name).to.equal('x');
        expect(property.value.value).to.equal(1);
    });

    it('should parse with assignment pattern', () => {
        const property = parseAndGetObjectPropertyDefaultValue('x = 1');
        expect(property.type).to.equal('ObjectProperty');
        expect(property.key.name).to.equal('x');
        expect(property.value.type).to.equal('AssignmentPattern');
    });
});
