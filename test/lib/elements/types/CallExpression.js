import {parseAndGetExpression} from '../../../utils';
import baseCallExpression from './baseCallExpression';
import {expect} from 'chai';

describe('CallExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('x()').type).to.equal('CallExpression');
    });

    baseCallExpression();
});
