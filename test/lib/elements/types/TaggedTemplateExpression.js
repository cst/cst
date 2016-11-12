import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('TaggedTemplateExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('a``').type).to.equal('TaggedTemplateExpression');
        expect(parseAndGetExpression('a`1`').type).to.equal('TaggedTemplateExpression');
        expect(parseAndGetExpression('a`${a}`').type).to.equal('TaggedTemplateExpression');
    });

    it('should accept a tagged template with only a template element', () => {
        let expression = parseAndGetExpression('a`1`');
        expect(expression.type).to.equal('TaggedTemplateExpression');
        expect(expression.tag.type).to.equal('Identifier');
        expect(expression.tag.name).to.equal('a');
        expect(expression.quasi.type).to.equal('TemplateLiteral');
        expect(expression.quasi.quasis.length).to.equal(1);
        expect(expression.quasi.quasis[0].type).to.equal('TemplateElement');
        expect(expression.quasi.quasis[0].tail).to.equal(true);
        expect(expression.quasi.quasis[0].value.cooked).to.equal('1');
        expect(expression.quasi.quasis[0].value.raw).to.equal('1');
        expect(expression.quasi.expressions.length).to.equal(0);
    });

    it('should accept a tagged template with only a template element with whitespace', () => {
        let expression = parseAndGetExpression('a `1`');
        expect(expression.type).to.equal('TaggedTemplateExpression');
        expect(expression.tag.type).to.equal('Identifier');
        expect(expression.tag.name).to.equal('a');
        expect(expression.quasi.type).to.equal('TemplateLiteral');
        expect(expression.quasi.quasis.length).to.equal(1);
        expect(expression.quasi.quasis[0].type).to.equal('TemplateElement');
        expect(expression.quasi.quasis[0].tail).to.equal(true);
        expect(expression.quasi.quasis[0].value.cooked).to.equal('1');
        expect(expression.quasi.quasis[0].value.raw).to.equal('1');
        expect(expression.quasi.expressions.length).to.equal(0);
    });

    it('should accept a tagged template with multiple expressions', () => {
        let expression = parseAndGetExpression('a`a${b}c${d}e`');
        expect(expression.type).to.equal('TaggedTemplateExpression');
        expect(expression.tag.type).to.equal('Identifier');
        expect(expression.tag.name).to.equal('a');
        expect(expression.quasi.type).to.equal('TemplateLiteral');
        expect(expression.quasi.quasis.length).to.equal(3);
        expect(expression.quasi.quasis[0].tail).to.equal(false);
        expect(expression.quasi.quasis[0].value.cooked).to.equal('a');
        expect(expression.quasi.quasis[0].value.raw).to.equal('a');
        expect(expression.quasi.quasis[1].tail).to.equal(false);
        expect(expression.quasi.quasis[1].value.cooked).to.equal('c');
        expect(expression.quasi.quasis[1].value.raw).to.equal('c');
        expect(expression.quasi.quasis[2].tail).to.equal(true);
        expect(expression.quasi.quasis[2].value.cooked).to.equal('e');
        expect(expression.quasi.quasis[2].value.raw).to.equal('e');
        expect(expression.quasi.expressions.length).to.equal(2);
        expect(expression.quasi.expressions[0].type).to.equal('Identifier');
        expect(expression.quasi.expressions[0].name).to.equal('b');
        expect(expression.quasi.expressions[1].type).to.equal('Identifier');
        expect(expression.quasi.expressions[1].name).to.equal('d');
    });
});
