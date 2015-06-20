import {parseLooseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('WithStatement', () => {
    it('should return correct type', () => {
        expect(parseLooseAndGetStatement('with(true);').type).to.equal('WithStatement');
    });

    it('should accept single statement', () => {
        var statement = parseLooseAndGetStatement('with (true) x;');
        expect(statement.object.type).to.equal('Literal');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept expression in parentheses', () => {
        var statement = parseLooseAndGetStatement('with ((true)) x;');
        expect(statement.object.type).to.equal('Literal');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept whitespaces', () => {
        var statement = parseLooseAndGetStatement('with ( true ) x ;');
        expect(statement.object.type).to.equal('Literal');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept blocks', () => {
        var statement = parseLooseAndGetStatement('with ( true ) { x; }');
        expect(statement.object.type).to.equal('Literal');
        expect(statement.object.value).to.equal(true);
        expect(statement.body.type).to.equal('BlockStatement');
    });
});
