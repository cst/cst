import {parseAndGetSuper} from '../../../utils';
import {expect} from 'chai';

describe('Super', () => {
    it('should accept super call', () => {
        expect(parseAndGetSuper('super(a, 1)').type).to.equal('CallExpression');
    });

    it('should accept super member call', () => {
        expect(parseAndGetSuper('super.member()').type).to.equal('CallExpression');
    });

    it('should accept super member access', () => {
        expect(parseAndGetSuper('super.member').type).to.equal('MemberExpression');
    });
});
