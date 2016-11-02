import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

export default function baseCallExpression(prefix = '') {
    it('should accept empty arguments', () => {
        var expression = parseAndGetExpression(`${prefix}x ( )`);
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('x');
        expect(expression.arguments.length).to.equal(0);
    });

    it('should accept single argument', () => {
        var expression = parseAndGetExpression(`${prefix}x ( x )`);
        expect(expression.callee.name).to.equal('x');
        expect(expression.arguments.length).to.equal(1);
        expect(expression.arguments[0].type).to.equal('Identifier');
        expect(expression.arguments[0].name).to.equal('x');
    });

    it('should accept multiple arguments', () => {
        var expression = parseAndGetExpression(`${prefix}x ( x , y )`);
        expect(expression.callee.name).to.equal('x');
        expect(expression.arguments.length).to.equal(2);
        expect(expression.arguments[0].type).to.equal('Identifier');
        expect(expression.arguments[0].name).to.equal('x');
        expect(expression.arguments[1].type).to.equal('Identifier');
        expect(expression.arguments[1].name).to.equal('y');
    });

    it('should accept multiple arguments with a trailing comma', () => {
        var expression = parseAndGetExpression(`${prefix}x ( x , y , )`);
        expect(expression.callee.name).to.equal('x');
        expect(expression.arguments.length).to.equal(2);
        expect(expression.arguments[0].type).to.equal('Identifier');
        expect(expression.arguments[0].name).to.equal('x');
        expect(expression.arguments[1].type).to.equal('Identifier');
        expect(expression.arguments[1].name).to.equal('y');
    });

    it('should accept multiple arguments with parentheses', () => {
        var expression = parseAndGetExpression(`${prefix}x ( (x) , (y) )`);
        expect(expression.callee.name).to.equal('x');
        expect(expression.arguments.length).to.equal(2);
        expect(expression.arguments[0].type).to.equal('Identifier');
        expect(expression.arguments[0].name).to.equal('x');
        expect(expression.arguments[1].type).to.equal('Identifier');
        expect(expression.arguments[1].name).to.equal('y');
    });
}
