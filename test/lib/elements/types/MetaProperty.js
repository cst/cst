import {
  parseAndGetExpressionInFunction,
  parseAndGetExpression,
} from '../../../utils';
import {expect} from 'chai';

describe('MetaProperty', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpressionInFunction('new.target').type).to.equal('MetaProperty');
    });

    it('should accept new.target', () => {
        let expression = parseAndGetExpressionInFunction('new.target');
        expect(expression.meta.type).to.equal('Identifier');
        expect(expression.meta.name).to.equal('new');
        expect(expression.property.type).to.equal('Identifier');
        expect(expression.property.name).to.equal('target');
    });

    it('should accept new.target with spaces', () => {
        let expression = parseAndGetExpressionInFunction('new . /* asdf */ target');
        expect(expression.meta.type).to.equal('Identifier');
        expect(expression.meta.name).to.equal('new');
        expect(expression.property.type).to.equal('Identifier');
        expect(expression.property.name).to.equal('target');
    });

    it('should error if meta.property is not new.target', () => {
        expect(() => {
            parseAndGetExpressionInFunction('new.asdf');
        }).to.throw(/The only valid meta property for new is new.target \(\d+:\d+\)/);
    });

    it('should error if not in function', () => {
        expect(() => {
            parseAndGetExpression('new.target');
        }).to.throw(/new.target can only be used in functions \(\d+:\d+\)/);
    });
});
