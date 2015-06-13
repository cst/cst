import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('LabeledStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('1').type).to.equal('Literal');
    });

    it('should accept integer', () => {
        var expression = parseAndGetExpression('123');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.equal(123);
        expect(expression.raw).to.equal('123');
    });

    it('should accept float', () => {
        var expression = parseAndGetExpression('1.5');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.equal(1.5);
        expect(expression.raw).to.equal('1.5');
    });

    it('should accept float starting with dot', () => {
        var expression = parseAndGetExpression('.5');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.equal(.5);
        expect(expression.raw).to.equal('.5');
    });

    it('should accept hex', () => {
        var expression = parseAndGetExpression('0x10');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.equal(16);
        expect(expression.raw).to.equal('0x10');
    });

    it('should accept binary', () => {
        var expression = parseAndGetExpression('0b10');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.equal(2);
        expect(expression.raw).to.equal('0b10');
    });

    it('should accept octal', () => {
        var expression = parseAndGetExpression('0o10');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.equal(8);
        expect(expression.raw).to.equal('0o10');
    });

    it('should accept E-notation', () => {
        var expression = parseAndGetExpression('1e5');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.equal(100000);
        expect(expression.raw).to.equal('1e5');
    });

    it('should accept boolean true', () => {
        var expression = parseAndGetExpression('true');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.equal(true);
        expect(expression.raw).to.equal('true');
    });

    it('should accept boolean false', () => {
        var expression = parseAndGetExpression('false');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.equal(false);
        expect(expression.raw).to.equal('false');
    });

    it('should accept null', () => {
        var expression = parseAndGetExpression('null');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.equal(null);
        expect(expression.raw).to.equal('null');
    });

    it('should accept regexp', () => {
        var expression = parseAndGetExpression('/123/');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.be.a('RegExp');
        expect(String(expression.value)).to.equal('/123/');
        expect(expression.raw).to.equal('/123/');
    });

    it('should accept regexp with flags', () => {
        var expression = parseAndGetExpression('/12\\/3/gm');
        expect(expression.type).to.equal('Literal');
        expect(expression.value).to.be.a('RegExp');
        expect(String(expression.value)).to.equal('/12\\/3/gm');
        expect(expression.raw).to.equal('/12\\/3/gm');
    });
});
