import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('NullLiteral', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('null').type).to.equal('NullLiteral');
    });

    it('should accept null', () => {
        var expression = parseAndGetExpression('null');
        expect(expression.type).to.equal('NullLiteral');
        expect(expression.value).to.equal(undefined);
        expect(expression.raw).to.equal(undefined);
    });
});
