import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('NewExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('new x').type).to.equal('NewExpression');
    });

    it('should without arguments', () => {
        var expression = parseAndGetExpression('new x');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('x');
        expect(expression.arguments.length).to.equal(0);
    });

    it('should accept empty arguments', () => {
        var expression = parseAndGetExpression('new x ( )');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('x');
        expect(expression.arguments.length).to.equal(0);
    });

    it('should accept single argument', () => {
        var expression = parseAndGetExpression('new x ( x )');
        expect(expression.callee.name).to.equal('x');
        expect(expression.arguments.length).to.equal(1);
        expect(expression.arguments[0].type).to.equal('Identifier');
        expect(expression.arguments[0].name).to.equal('x');
    });

    it('should accept multiple arguments', () => {
        var expression = parseAndGetExpression('new x ( x , y )');
        expect(expression.callee.name).to.equal('x');
        expect(expression.arguments.length).to.equal(2);
        expect(expression.arguments[0].type).to.equal('Identifier');
        expect(expression.arguments[0].name).to.equal('x');
        expect(expression.arguments[1].type).to.equal('Identifier');
        expect(expression.arguments[1].name).to.equal('y');
    });

    it('should accept multiple arguments with parentheses', () => {
        var expression = parseAndGetExpression('new x ( (x) , (y) )');
        expect(expression.callee.name).to.equal('x');
        expect(expression.arguments.length).to.equal(2);
        expect(expression.arguments[0].type).to.equal('Identifier');
        expect(expression.arguments[0].name).to.equal('x');
        expect(expression.arguments[1].type).to.equal('Identifier');
        expect(expression.arguments[1].name).to.equal('y');
    });
});
