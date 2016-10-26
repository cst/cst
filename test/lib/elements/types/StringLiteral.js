import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('StringLiteral', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('"1"').type).to.equal('StringLiteral');
    });

    it('should accept double quoted string', () => {
        let expression = parseAndGetExpression('"123"');
        expect(expression.type).to.equal('StringLiteral');
        expect(expression.value).to.equal('123');
        expect(expression.raw).to.equal('"123"');
    });

    it('should accept single quoted string', () => {
        let expression = parseAndGetExpression('\'123\'');
        expect(expression.type).to.equal('StringLiteral');
        expect(expression.value).to.equal('123');
        expect(expression.raw).to.equal('\'123\'');
    });

    it('should accept string escapes', () => {
        let value = '" \\" \\n \\r \\t \\f \\b \\v \\0 \\\n \\u006F \\251 \\xa9 \\u{000000000061} "';
        let expression = parseAndGetExpression(value, {strictMode: false});
        expect(expression.type).to.equal('StringLiteral');
        expect(expression.value).to.equal(' " \n \r \t \f \b \u000b \0  o © © a ');
        expect(expression.raw).to.equal(value);
    });
});
