import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('RegExpLiteral', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('/123/').type).to.equal('RegExpLiteral');
    });

    it('should accept regexp', () => {
        var expression = parseAndGetExpression('/123/');
        expect(expression.type).to.equal('RegExpLiteral');
        expect(expression.value).to.equal(undefined);
        expect(expression.pattern).to.equal('123');
        expect(expression.flags).to.equal('');
        expect(expression.extra.raw).to.equal('/123/');
        expect(expression.extra.rawValue).to.equal(undefined);
    });

    it('should accept regexp with flags', () => {
        var expression = parseAndGetExpression('/123/gm');
        expect(expression.type).to.equal('RegExpLiteral');
        expect(expression.value).to.equal(undefined);
        expect(expression.pattern).to.equal('123');
        expect(expression.flags).to.equal('gm');
        expect(expression.extra.raw).to.equal('/123/gm');
        expect(expression.extra.rawValue).to.equal(undefined);
    });
});
