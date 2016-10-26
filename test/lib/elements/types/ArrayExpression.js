import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('ArrayExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('[]').type).to.equal('ArrayExpression');
    });

    it('should accept empty array', () => {
        expect(parseAndGetExpression('[]').elements.length).to.equal(0);
    });

    it('should accept 1-element array', () => {
        let array = parseAndGetExpression('[x]');
        expect(array.elements.length).to.equal(1);
        expect(array.elements[0].type).to.equal('Identifier');
    });

    it('should accept multiple elements array', () => {
        let array = parseAndGetExpression('[x, 1]');
        expect(array.elements.length).to.equal(2);
        expect(array.elements[0].type).to.equal('Identifier');
        expect(array.elements[1].type).to.equal('NumericLiteral');
    });

    it('should accept expressions', () => {
        let array = parseAndGetExpression('[(x = 1), (1)]');
        expect(array.elements.length).to.equal(2);
        expect(array.elements[0].type).to.equal('AssignmentExpression');
        expect(array.elements[1].type).to.equal('NumericLiteral');
    });

    it('should accept holes', () => {
        let array = parseAndGetExpression('[,x,,1,,]');
        expect(array.elements.length).to.equal(5);
        expect(array.elements[0]).to.equal(null);
        expect(array.elements[1].type).to.equal('Identifier');
        expect(array.elements[2]).to.equal(null);
        expect(array.elements[3].type).to.equal('NumericLiteral');
        expect(array.elements[4]).to.equal(null);
    });

    it('should accept holes-only', () => {
        let array = parseAndGetExpression('[,,,]');
        expect(array.elements.length).to.equal(3);
        expect(array.elements[0]).to.equal(null);
        expect(array.elements[1]).to.equal(null);
    });
});
