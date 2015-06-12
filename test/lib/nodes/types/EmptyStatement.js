import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('EmptyStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement(';').type).to.equal('EmptyStatement');
    });
});
