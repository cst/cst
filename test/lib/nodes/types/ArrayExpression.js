import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('ArrayExpression', () => {
    it('should accept empty array', () => {
        expect(parseAndGetExpression('[]').elements.length).to.equal(0);
    });
});
