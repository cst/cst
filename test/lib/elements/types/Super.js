import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('Super', () => {
    it('should accept super call', () => {
        expect(parseAndGetExpression('super(a, 1)').type).to.equal('CallExpression');
    });
    it('should accept super call with braces', () => {
        expect(parseAndGetExpression('(super)(a, 1)').type).to.equal('CallExpression');
    });

    it('should accept super member call', () => {
        expect(parseAndGetExpression('super.member()').type).to.equal('CallExpression');
    });

    it('should accept super member call with braces', () => {
        expect(parseAndGetExpression('(super).member()').type).to.equal('CallExpression');
    });

    it('should accept super member access', () => {
        expect(parseAndGetExpression('super.member').type).to.equal('MemberExpression');
    });

    it('should accept super member access with braces', () => {
        expect(parseAndGetExpression('(super).member').type).to.equal('MemberExpression');
    });
});
