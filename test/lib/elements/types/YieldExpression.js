import {parseAndGetExpressionInGenerator} from '../../../utils';
import {expect} from 'chai';

describe('YieldExpression', () => {

    it('should yield correct type', () => {
        expect(parseAndGetExpressionInGenerator('yield').type).to.equal('YieldExpression');
    });

    it('should accept argument', () => {
        var statement = parseAndGetExpressionInGenerator('yield 1');
        expect(statement.type).to.equal('YieldExpression');
        expect(statement.argument.type).to.equal('Literal');
        expect(statement.argument.value).to.equal(1);
    });

    it('should accept function call', () => {
        var statement = parseAndGetExpressionInGenerator('yield a()');
        expect(statement.type).to.equal('YieldExpression');
        expect(statement.argument.type).to.equal('CallExpression');
        expect(statement.argument.callee.type).to.equal('Identifier');
        expect(statement.argument.callee.name).to.equal('a');
    });

    it('should accept delegate (*)', () => {
        var statement = parseAndGetExpressionInGenerator('yield* a()');
        expect(statement.type).to.equal('YieldExpression');
        expect(statement.delegate).to.equal(true);
        expect(statement.argument.type).to.equal('CallExpression');
        expect(statement.argument.callee.type).to.equal('Identifier');
        expect(statement.argument.callee.name).to.equal('a');
    });

    it('should accept argument in parentheses', () => {
        var statement = parseAndGetExpressionInGenerator('yield ( 1 )');
        expect(statement.type).to.equal('YieldExpression');
        expect(statement.argument.type).to.equal('Literal');
        expect(statement.argument.value).to.equal(1);
    });

    it('should work without semicolon', () => {
        var statement = parseAndGetExpressionInGenerator('yield 1');
        expect(statement.type).to.equal('YieldExpression');
        expect(statement.argument.type).to.equal('Literal');
        expect(statement.argument.value).to.equal(1);
    });

    it('should work without semicolon and argument', () => {
        var statement = parseAndGetExpressionInGenerator('yield');
        expect(statement.type).to.equal('YieldExpression');
    });
});
