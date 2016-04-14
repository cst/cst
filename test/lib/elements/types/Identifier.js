import {parseAndGetExpression, parseAndGetObjectKey} from '../../../utils';
import {expect} from 'chai';

describe('Identifier', () => {
    it('should accept single identifier', () => {
        let identifier = parseAndGetExpression('x');
        expect(identifier.name).to.equal('x');
        expect(identifier.type).to.equal('Identifier');
    });

    it('should accept true keyword', () => {
        let identifier = parseAndGetObjectKey('true');
        expect(identifier.name).to.equal('true');
        expect(identifier.type).to.equal('Identifier');
    });

    it('should accept false keyword', () => {
        let identifier = parseAndGetObjectKey('false');
        expect(identifier.name).to.equal('false');
        expect(identifier.type).to.equal('Identifier');
    });

    it('should accept null keyword', () => {
        let identifier = parseAndGetObjectKey('null');
        expect(identifier.name).to.equal('null');
        expect(identifier.type).to.equal('Identifier');
    });

    it('should accept for keyword', () => {
        let identifier = parseAndGetObjectKey('for');
        expect(identifier.name).to.equal('for');
        expect(identifier.type).to.equal('Identifier');
    });
});
