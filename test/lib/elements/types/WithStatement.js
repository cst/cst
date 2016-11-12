import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('WithStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('with(true);', {strictMode: false}).type).to.equal('WithStatement');
    });

    it('should accept single statement', () => {
        let statement = parseAndGetStatement('with (true) x;', {strictMode: false});
        expect(statement.object.type).to.equal('BooleanLiteral');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept expression in parentheses', () => {
        let statement = parseAndGetStatement('with ((true)) x;', {strictMode: false});
        expect(statement.object.type).to.equal('BooleanLiteral');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept whitespaces', () => {
        let statement = parseAndGetStatement('with ( true ) x ;', {strictMode: false});
        expect(statement.object.type).to.equal('BooleanLiteral');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept blocks', () => {
        let statement = parseAndGetStatement('with ( true ) { x; }', {strictMode: false});
        expect(statement.object.type).to.equal('BooleanLiteral');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('BlockStatement');
    });
});
