import {parseAndGetExpression, parseAndGetObjectProperty} from '../../../utils';
import {expect} from 'chai';

describe('NumericLiteral', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('1').type).to.equal('NumericLiteral');
    });

    it('should get numeric from object expression', () => {
        expect(parseAndGetObjectProperty('0: 1').type).to.equal('ObjectProperty');
    });

    it('should accept integer', () => {
        let expression = parseAndGetExpression('123');
        expect(expression.type).to.equal('NumericLiteral');
        expect(expression.value).to.equal(123);
        expect(expression.raw).to.equal('123');
    });

    it('should accept float', () => {
        let expression = parseAndGetExpression('1.5');
        expect(expression.type).to.equal('NumericLiteral');
        expect(expression.value).to.equal(1.5);
        expect(expression.raw).to.equal('1.5');
    });

    it('should accept float starting with dot', () => {
        let expression = parseAndGetExpression('.5');
        expect(expression.type).to.equal('NumericLiteral');
        expect(expression.value).to.equal(0.5);
        expect(expression.raw).to.equal('.5');
    });

    it('should accept hex', () => {
        let expression = parseAndGetExpression('0x10');
        expect(expression.type).to.equal('NumericLiteral');
        expect(expression.value).to.equal(16);
        expect(expression.raw).to.equal('0x10');
    });

    it('should accept binary', () => {
        let expression = parseAndGetExpression('0b10');
        expect(expression.type).to.equal('NumericLiteral');
        expect(expression.value).to.equal(2);
        expect(expression.raw).to.equal('0b10');
    });

    it('should accept octal', () => {
        let expression = parseAndGetExpression('0o10');
        expect(expression.type).to.equal('NumericLiteral');
        expect(expression.value).to.equal(8);
        expect(expression.raw).to.equal('0o10');
    });

    it('should accept E-notation', () => {
        let expression = parseAndGetExpression('1e5');
        expect(expression.type).to.equal('NumericLiteral');
        expect(expression.value).to.equal(100000);
        expect(expression.raw).to.equal('1e5');
    });
});
