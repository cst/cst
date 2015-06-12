import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('ExpressionStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('x;').type).to.equal('ExpressionStatement');
    });

    it('should accept space before semicolon', () => {
        expect(parseAndGetStatement('x ;').type).to.equal('ExpressionStatement');
    });

    it('should accept expression without semicolon', () => {
        expect(parseAndGetStatement('x').type).to.equal('ExpressionStatement');
    });
});
