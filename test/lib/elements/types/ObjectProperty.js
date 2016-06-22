import {
    parseAndGetObjectProperty,
    parseAndGetObjectPropertyDefaultValue
} from '../../../utils';

import Parser from '../../../../src/Parser';

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

    it('should generate correct code with one property', () => {
        let code = '({ test = 1 } = {})';
        let tree = new Parser().parse(code);

        expect(tree.getSourceCode()).to.equal(code);
    });

    it('should generate correct code with two properties', () => {
        let code = '({ a = 1, b = 2 } = {})';
        let tree = new Parser().parse(code);

        expect(tree.getSourceCode()).to.equal(code);
    });

    it('should generate correct code for function arguments', () => {
        let code = 'function a ({ foo = false, bar = null } = {}) {}';
        let tree = new Parser().parse(code);

        expect(tree.getSourceCode()).to.equal(code);
    });
});
