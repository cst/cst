import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('WithStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('with(true);', {strictMode: false}).type).to.equal('WithStatement');
    });

    it('should accept single statement', () => {
        var statement = parseAndGetStatement('with (true) x;', {strictMode: false});
        expect(statement.object.type).to.equal('BooleanLiteral');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept expression in parentheses', () => {
        var statement = parseAndGetStatement('with ((true)) x;', {strictMode: false});
        expect(statement.object.type).to.equal('BooleanLiteral');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept whitespaces', () => {
        var statement = parseAndGetStatement('with ( true ) x ;', {strictMode: false});
        expect(statement.object.type).to.equal('BooleanLiteral');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept blocks', () => {
        var statement = parseAndGetStatement('with ( true ) { x; }', {strictMode: false});
        expect(statement.object.type).to.equal('BooleanLiteral');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('BlockStatement');
    });
});
