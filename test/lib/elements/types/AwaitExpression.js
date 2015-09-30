import {parseAndGetExpressionInAsyncFunction} from '../../../utils';
import {expect} from 'chai';

describe('AwaitExpression', () => {

    it('should return correct type', () => {
        expect(parseAndGetExpressionInAsyncFunction('await 1').type).to.equal('AwaitExpression');
    });

    it('should accept argument', () => {
        var statement = parseAndGetExpressionInAsyncFunction('await 1');
        expect(statement.type).to.equal('AwaitExpression');
        expect(statement.argument.type).to.equal('Literal');
        expect(statement.argument.value).to.equal(1);
    });

    it('should accept function call', () => {
        var statement = parseAndGetExpressionInAsyncFunction('await a()');
        expect(statement.type).to.equal('AwaitExpression');
        expect(statement.argument.type).to.equal('CallExpression');
        expect(statement.argument.callee.type).to.equal('Identifier');
        expect(statement.argument.callee.name).to.equal('a');
    });

    it('should accept argument in parentheses', () => {
        var statement = parseAndGetExpressionInAsyncFunction('await ( 1 )');
        expect(statement.type).to.equal('AwaitExpression');
        expect(statement.argument.type).to.equal('Literal');
        expect(statement.argument.value).to.equal(1);
    });

    it('should work without semicolon', () => {
        var statement = parseAndGetExpressionInAsyncFunction('await 1');
        expect(statement.type).to.equal('AwaitExpression');
        expect(statement.argument.type).to.equal('Literal');
        expect(statement.argument.value).to.equal(1);
    });
});
