import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('MetaProperty', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('new.target').type).to.equal('MetaProperty');
    });

    it('should accept new.target', () => {
        var expression = parseAndGetExpression('new.target');
        expect(expression.meta.type).to.equal('Identifier');
        expect(expression.meta.name).to.equal('new');
        expect(expression.property.type).to.equal('Identifier');
        expect(expression.property.name).to.equal('target');
    });

    it('should accept new.target with spaces', () => {
        var expression = parseAndGetExpression('new . /* asdf */ target');
        expect(expression.meta.type).to.equal('Identifier');
        expect(expression.meta.name).to.equal('new');
        expect(expression.property.type).to.equal('Identifier');
        expect(expression.property.name).to.equal('target');
    });

    it('should error if meta.property isn not new.target', () => {
        expect(() => {
            parseAndGetExpression('new.asdf');
        }).to.throw('The only valid meta property for new is new.target (1:5)');
    });
});
