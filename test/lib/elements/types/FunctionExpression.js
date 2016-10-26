import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('FunctionExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('(function(){})').type).to.equal('FunctionExpression');
    });

    it('should accept empty params', () => {
        let expression = parseAndGetExpression('(function(){})');
        expect(expression.params.length).to.equal(0);
        expect(expression.body.type).to.equal('BlockStatement');
        expect(expression.body.body.length).to.equal(0);
        expect(expression.generator).to.equal(false);
        expect(expression.expression).to.equal(false);
    });

    it('should accept statement', () => {
        let expression = parseAndGetExpression('(function(){x;})');
        expect(expression.params.length).to.equal(0);
        expect(expression.body.type).to.equal('BlockStatement');
        expect(expression.body.body.length).to.equal(1);
        expect(expression.generator).to.equal(false);
        expect(expression.expression).to.equal(false);
    });

    it('should accept single argument', () => {
        let expression = parseAndGetExpression('(function ( x ) { })');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.generator).to.equal(false);
    });

    it('should accept multiple arguments', () => {
        let expression = parseAndGetExpression('(function ( x , y ) { })');
        expect(expression.params.length).to.equal(2);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.params[1].type).to.equal('Identifier');
        expect(expression.params[1].name).to.equal('y');
        expect(expression.generator).to.equal(false);
    });

    it('should accept multiple arguments and a trailing comma', () => {
        let expression = parseAndGetExpression('(function ( x , y , ) { })');
        expect(expression.params.length).to.equal(2);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.params[1].type).to.equal('Identifier');
        expect(expression.params[1].name).to.equal('y');
        expect(expression.generator).to.equal(false);
    });

    it('should accept array pattern', () => {
        let expression = parseAndGetExpression('(function ( [ x ] ) { ; })');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('ArrayPattern');
        expect(expression.generator).to.equal(false);
    });

    it('should accept object pattern', () => {
        let expression = parseAndGetExpression('(function ( { x } ) { ; })');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('ObjectPattern');
        expect(expression.generator).to.equal(false);
    });

    it('should support generator', () => {
        let expression = parseAndGetExpression('(function * ( x ) { ; })');
        expect(expression.generator).to.equal(true);
    });

    it('should support named expression', () => {
        let expression = parseAndGetExpression('(function named ( x ) { ; })');
        expect(expression.id.name).to.equal('named');
    });

    it('should support named generator expression', () => {
        let expression = parseAndGetExpression('(function * named ( x ) { ; })');
        expect(expression.id.name).to.equal('named');
        expect(expression.generator).to.equal(true);
    });

    it('should support async', () => {
        let expression = parseAndGetExpression('(async function ( x ) { ; })');
        expect(expression.type).to.equal('FunctionExpression');
        expect(expression.async).to.equal(true);
    });
});
