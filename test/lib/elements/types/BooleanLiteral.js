import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('BooleanLiteral', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('true').type).to.equal('BooleanLiteral');
    });

    it('should accept boolean true', () => {
        var expression = parseAndGetExpression('true');
        expect(expression.type).to.equal('BooleanLiteral');
        expect(expression.value).to.equal(true);
        expect(expression.raw).to.equal(undefined);
    });

    it('should accept boolean false', () => {
        var expression = parseAndGetExpression('false');
        expect(expression.type).to.equal('BooleanLiteral');
        expect(expression.value).to.equal(false);
        expect(expression.raw).to.equal(undefined);
    });
});
