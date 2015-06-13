import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('MemberExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('x.y').type).to.equal('MemberExpression');
    });

    it('should support non-computed', () => {
        var expression = parseAndGetExpression('x.y');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('x');
        expect(expression.property.type).to.equal('Identifier');
        expect(expression.property.name).to.equal('y');
        expect(expression.computed).to.equal(false);
    });

    it('should accept spaces for non-computed', () => {
        var expression = parseAndGetExpression('x . y');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('x');
        expect(expression.property.type).to.equal('Identifier');
        expect(expression.property.name).to.equal('y');
        expect(expression.computed).to.equal(false);
    });

    it('should support computed', () => {
        var expression = parseAndGetExpression('x[y]');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('x');
        expect(expression.property.type).to.equal('Identifier');
        expect(expression.property.name).to.equal('y');
        expect(expression.computed).to.equal(true);
    });

    it('should accept spaces for computed', () => {
        var expression = parseAndGetExpression('x [ y ]');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('x');
        expect(expression.property.type).to.equal('Identifier');
        expect(expression.property.name).to.equal('y');
        expect(expression.computed).to.equal(true);
    });

    it('should accept parentheses for computed', () => {
        var expression = parseAndGetExpression('x [ ( y ) ]');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('x');
        expect(expression.property.type).to.equal('Identifier');
        expect(expression.property.name).to.equal('y');
        expect(expression.computed).to.equal(true);
    });
});
