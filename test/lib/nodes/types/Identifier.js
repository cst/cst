import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('Identifier', () => {
    it('should accept single identifier', () => {
        let identifier = parseAndGetExpression('x');
        expect(identifier.name).to.equal('x');
        expect(identifier.type).to.equal('Identifier');
    });
});
