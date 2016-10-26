import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('ArrowFunctionExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('(() => {})').type).to.equal('ArrowFunctionExpression');
    });

    it('should accept empty params', () => {
        let expression = parseAndGetExpression('(() => {})');
        expect(expression.params.length).to.equal(0);
        expect(expression.body.type).to.equal('BlockStatement');
        expect(expression.body.body.length).to.equal(0);
        expect(expression.generator).to.equal(false);
        expect(expression.expression).to.equal(false);
    });

    it('should accept statement', () => {
        let expression = parseAndGetExpression('(() => {x;})');
        expect(expression.params.length).to.equal(0);
        expect(expression.body.type).to.equal('BlockStatement');
        expect(expression.body.body.length).to.equal(1);
        expect(expression.generator).to.equal(false);
        expect(expression.expression).to.equal(false);
    });

    it('should accept expression', () => {
        let expression = parseAndGetExpression('(() => 1)');
        expect(expression.params.length).to.equal(0);
        expect(expression.body.type).to.equal('NumericLiteral');
        expect(expression.body.value).to.equal(1);
        expect(expression.generator).to.equal(false);
        expect(expression.expression).to.equal(true);
    });

    it('should accept expression with parentheses', () => {
        let expression = parseAndGetExpression('(() => (1))');
        expect(expression.params.length).to.equal(0);
        expect(expression.body.type).to.equal('NumericLiteral');
        expect(expression.body.value).to.equal(1);
        expect(expression.generator).to.equal(false);
        expect(expression.expression).to.equal(true);
    });

    it('should accept single argument without parentheses', () => {
        let expression = parseAndGetExpression('(x => 1)');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.generator).to.equal(false);
    });

    it('should accept single argument', () => {
        let expression = parseAndGetExpression('(( x ) => (1))');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.generator).to.equal(false);
    });

    it('should accept multiple arguments', () => {
        let expression = parseAndGetExpression('(( x , y ) => (1))');
        expect(expression.params.length).to.equal(2);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.params[1].type).to.equal('Identifier');
        expect(expression.params[1].name).to.equal('y');
        expect(expression.generator).to.equal(false);
    });

    it('should accept multiple arguments and a trailing comma', () => {
        let expression = parseAndGetExpression('(( x , y , ) => (1))');
        expect(expression.params.length).to.equal(2);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.params[1].type).to.equal('Identifier');
        expect(expression.params[1].name).to.equal('y');
        expect(expression.generator).to.equal(false);
    });

    it('should accept array pattern', () => {
        let expression = parseAndGetExpression('(([x]) => (1))');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('ArrayPattern');
        expect(expression.generator).to.equal(false);
    });

    it('should accept object pattern', () => {
        let expression = parseAndGetExpression('(({x}) => (1))');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('ObjectPattern');
        expect(expression.generator).to.equal(false);
    });

    it('should support async', () => {
        let expression = parseAndGetExpression('(async ({x}) => (1))');
        expect(expression.type).to.equal('ArrowFunctionExpression');
        expect(expression.async).to.equal(true);
    });
});
