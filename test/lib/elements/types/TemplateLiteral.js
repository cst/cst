import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('TemplateLiteral', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('``').type).to.equal('TemplateLiteral');
        expect(parseAndGetExpression('`1`').type).to.equal('TemplateLiteral');
        expect(parseAndGetExpression('`${a}`').type).to.equal('TemplateLiteral');
    });

    it('should accept template with only a template element', () => {
        var expression = parseAndGetExpression('`1`');
        expect(expression.type).to.equal('TemplateLiteral');
        expect(expression.quasis.length).to.equal(1);
        expect(expression.quasis[0].type).to.equal('TemplateElement');
        expect(expression.quasis[0].tail).to.equal(true);
        expect(expression.quasis[0].value.cooked).to.equal('1');
        expect(expression.quasis[0].value.raw).to.equal('1');
        expect(expression.expressions.length).to.equal(0);
    });

    it('should accept multiline template', () => {
        var expression = parseAndGetExpression('`a\n' +
            'b\n' +
            'c\n' +
        '`');
        expect(expression.type).to.equal('TemplateLiteral');
        expect(expression.quasis.length).to.equal(1);
        expect(expression.quasis[0].type).to.equal('TemplateElement');
        expect(expression.quasis[0].tail).to.equal(true);
        expect(expression.quasis[0].value.cooked).to.equal('a\nb\nc\n');
        expect(expression.quasis[0].value.raw).to.equal('a\nb\nc\n');
        expect(expression.expressions.length).to.equal(0);
    });

    it('should accept template with only an expression', () => {
        var expression = parseAndGetExpression('`${a}`');
        expect(expression.type).to.equal('TemplateLiteral');
        expect(expression.quasis.length).to.equal(2);
        expect(expression.quasis[0].tail).to.equal(false);
        expect(expression.quasis[0].value.cooked).to.equal('');
        expect(expression.quasis[0].value.raw).to.equal('');
        expect(expression.quasis[1].tail).to.equal(true);
        expect(expression.quasis[1].value.cooked).to.equal('');
        expect(expression.quasis[1].value.raw).to.equal('');
        expect(expression.expressions.length).to.equal(1);
        expect(expression.expressions[0].type).to.equal('Identifier');
        expect(expression.expressions[0].name).to.equal('a');
    });

    it('should accept template with only an expression with spaces', () => {
        var expression = parseAndGetExpression('` ${ a } `');
        expect(expression.type).to.equal('TemplateLiteral');
        expect(expression.quasis.length).to.equal(2);
        expect(expression.quasis[0].tail).to.equal(false);
        expect(expression.quasis[0].value.cooked).to.equal(' ');
        expect(expression.quasis[0].value.raw).to.equal(' ');
        expect(expression.quasis[1].tail).to.equal(true);
        expect(expression.quasis[1].value.cooked).to.equal(' ');
        expect(expression.quasis[1].value.raw).to.equal(' ');
        expect(expression.expressions.length).to.equal(1);
        expect(expression.expressions[0].type).to.equal('Identifier');
        expect(expression.expressions[0].name).to.equal('a');
    });

    it('should accept template with multiple expressions', () => {
        var expression = parseAndGetExpression('`a${b}c${d}e`');
        expect(expression.type).to.equal('TemplateLiteral');
        expect(expression.quasis.length).to.equal(3);
        expect(expression.quasis[0].tail).to.equal(false);
        expect(expression.quasis[0].value.cooked).to.equal('a');
        expect(expression.quasis[0].value.raw).to.equal('a');
        expect(expression.quasis[1].tail).to.equal(false);
        expect(expression.quasis[1].value.cooked).to.equal('c');
        expect(expression.quasis[1].value.raw).to.equal('c');
        expect(expression.quasis[2].tail).to.equal(true);
        expect(expression.quasis[2].value.cooked).to.equal('e');
        expect(expression.quasis[2].value.raw).to.equal('e');
        expect(expression.expressions.length).to.equal(2);
        expect(expression.expressions[0].type).to.equal('Identifier');
        expect(expression.expressions[0].name).to.equal('b');
        expect(expression.expressions[1].type).to.equal('Identifier');
        expect(expression.expressions[1].name).to.equal('d');
    });

    it('should accept nested templates', () => {
        var expression = parseAndGetExpression('`b${`${1+1}c`}3`');
        expect(expression.type).to.equal('TemplateLiteral');
        expect(expression.quasis.length).to.equal(2);
        expect(expression.quasis[0].tail).to.equal(false);
        expect(expression.quasis[0].value.cooked).to.equal('b');
        expect(expression.quasis[0].value.raw).to.equal('b');
        expect(expression.quasis[1].tail).to.equal(true);
        expect(expression.quasis[1].value.cooked).to.equal('3');
        expect(expression.quasis[1].value.raw).to.equal('3');
        expect(expression.expressions.length).to.equal(1);
        expect(expression.expressions[0].type).to.equal('TemplateLiteral');
        expect(expression.expressions[0].quasis.length).to.equal(2);
        expect(expression.expressions[0].quasis[0].tail).to.equal(false);
        expect(expression.expressions[0].quasis[0].value.cooked).to.equal('');
        expect(expression.expressions[0].quasis[0].value.raw).to.equal('');
        expect(expression.expressions[0].quasis[1].tail).to.equal(true);
        expect(expression.expressions[0].quasis[1].value.cooked).to.equal('c');
        expect(expression.expressions[0].quasis[1].value.raw).to.equal('c');
        expect(expression.expressions[0].expressions.length).to.equal(1);
        expect(expression.expressions[0].expressions[0].type).to.equal('BinaryExpression');
        expect(expression.expressions[0].expressions[0].operator).to.equal('+');
        expect(expression.expressions[0].expressions[0].left.type).to.equal('Literal');
        expect(expression.expressions[0].expressions[0].left.value).to.equal(1);
        expect(expression.expressions[0].expressions[0].right.type).to.equal('Literal');
        expect(expression.expressions[0].expressions[0].left.value).to.equal(1);
    });
});
