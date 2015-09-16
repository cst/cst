import {parseAndGetStatementInFunction} from '../../../utils';
import {expect} from 'chai';

describe('Super', () => {
    it('should accept super call', () => {
        expect(parseAndGetStatementInFunction('super(a, 1)').expression.type).to.equal('CallExpression');
    });
    it('should accept super call with braces', () => {
        expect(parseAndGetStatementInFunction('(super)(a, 1)').expression.type).to.equal('CallExpression');
    });

    it('should accept super member call', () => {
        expect(parseAndGetStatementInFunction('super.member()').expression.type).to.equal('CallExpression');
    });

    it('should accept super member call with braces', () => {
        expect(parseAndGetStatementInFunction('(super).member()').expression.type).to.equal('CallExpression');
    });

    it('should accept super member access', () => {
        expect(parseAndGetStatementInFunction('super.member').expression.type).to.equal('MemberExpression');
    });

    it('should accept super member access with braces', () => {
        expect(parseAndGetStatementInFunction('(super).member').expression.type).to.equal('MemberExpression');
    });
});
