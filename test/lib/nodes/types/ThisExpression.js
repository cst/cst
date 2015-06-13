import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('ThisExpression', () => {
    it('should accept single keyword', () => {
        expect(parseAndGetExpression('this').type).to.equal('ThisExpression');
    });
});
