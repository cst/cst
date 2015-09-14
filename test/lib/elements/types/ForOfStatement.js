import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('ForOfStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('for(i of x);').type).to.equal('ForOfStatement');
    });

    it('should accept single statement', () => {
        var statement = parseAndGetStatement('for (i of x) x;');
        expect(statement.left.type).to.equal('Identifier');
        expect(statement.left.name).to.equal('i');
        expect(statement.right.type).to.equal('Identifier');
        expect(statement.right.name).to.equal('x');
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
        expect(statement.each).to.equal(false);
    });

    it('should accept expression of parentheses', () => {
        var statement = parseAndGetStatement('for ((i) of (x)) x;');
        expect(statement.left.type).to.equal('Identifier');
        expect(statement.left.name).to.equal('i');
        expect(statement.right.type).to.equal('Identifier');
        expect(statement.right.name).to.equal('x');
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
        expect(statement.each).to.equal(false);
    });

    it('should accept variable declaration', () => {
        var statement = parseAndGetStatement('for ( var i of x ) x;');
        expect(statement.left.type).to.equal('VariableDeclaration');
        expect(statement.left.declarations[0].id.name).to.equal('i');
        expect(statement.right.type).to.equal('Identifier');
        expect(statement.right.name).to.equal('x');
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
        expect(statement.each).to.equal(false);
    });

    it('should accept whitespaces', () => {
        var statement = parseAndGetStatement('for ( ( i ) of ( x ) ) x;');
        expect(statement.left.type).to.equal('Identifier');
        expect(statement.left.name).to.equal('i');
        expect(statement.right.type).to.equal('Identifier');
        expect(statement.right.name).to.equal('x');
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
        expect(statement.each).to.equal(false);
    });

    it('should accept blocks', () => {
        var statement = parseAndGetStatement('for (i of x) { x; }');
        expect(statement.left.type).to.equal('Identifier');
        expect(statement.left.name).to.equal('i');
        expect(statement.right.type).to.equal('Identifier');
        expect(statement.right.name).to.equal('x');
        expect(statement.body.type).to.equal('BlockStatement');
        expect(statement.each).to.equal(false);
    });
});
