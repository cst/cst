import {parseAndGetExpressionInFunction} from '../../../utils';
import {expect} from 'chai';

describe('Super', () => {
    it('should accept super call', () => {
        expect(parseAndGetExpressionInFunction('super(a, 1)').type).to.equal('CallExpression');
    });
    it('should accept super call with parens', () => {
        expect(parseAndGetExpressionInFunction('(super)(a, 1)').type).to.equal('CallExpression');
    });

    it('should accept super member call', () => {
        expect(parseAndGetExpressionInFunction('super.member()').type).to.equal('CallExpression');
    });

    it('should accept super member call with parens', () => {
        expect(parseAndGetExpressionInFunction('(super).member()').type).to.equal('CallExpression');
    });

    it('should accept super member access', () => {
        expect(parseAndGetExpressionInFunction('super.member').type).to.equal('MemberExpression');
    });

    it('should accept super member access with parens', () => {
        expect(parseAndGetExpressionInFunction('(super).member').type).to.equal('MemberExpression');
    });
});
