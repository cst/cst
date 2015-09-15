import {parseAndGetExpression} from '../../../utils';
import Token from '../../../../src/elements/Token';
import {expect} from 'chai';

describe('ConditionalExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('x?y:z').type).to.equal('ConditionalExpression');
    });

    it('should accept expressions', () => {
        var expression = parseAndGetExpression('x ? y : z');
        expect(expression.test.type).to.equal('Identifier');
        expect(expression.test.name).to.equal('x');
        expect(expression.consequent.type).to.equal('Identifier');
        expect(expression.consequent.name).to.equal('y');
        expect(expression.alternate.type).to.equal('Identifier');
        expect(expression.alternate.name).to.equal('z');
    });

    it('should accept parentheses', () => {
        var expression = parseAndGetExpression('( x ) ? ( y ) : ( z )');
        expect(expression.test.type).to.equal('Identifier');
        expect(expression.test.name).to.equal('x');
        expect(expression.consequent.type).to.equal('Identifier');
        expect(expression.consequent.name).to.equal('y');
        expect(expression.alternate.type).to.equal('Identifier');
        expect(expression.alternate.name).to.equal('z');
    });

    it('should not accept trailing whitespace', () => {
        var expression = parseAndGetExpression('x ? y : z');
        expect(() => {
            expression.appendChild(new Token('Whitespace', '   '));
        }).to.throw('Expected end of node list but "Whitespace" found');
    });
});
