import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('ForInStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('for(i in x);').type).to.equal('ForInStatement');
    });

    it('should accept single statement', () => {
        let statement = parseAndGetStatement('for (i in x) x;');
        expect(statement.left.type).to.equal('Identifier');
        expect(statement.left.name).to.equal('i');
        expect(statement.right.type).to.equal('Identifier');
        expect(statement.right.name).to.equal('x');
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
        expect(statement.each).to.equal(false);
    });

    it('should accept expression in parentheses', () => {
        let statement = parseAndGetStatement('for ((i) in (x)) x;');
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
        let statement = parseAndGetStatement('for ( var i in x ) x;');
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
        let statement = parseAndGetStatement('for ( ( i ) in ( x ) ) x;');
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
        let statement = parseAndGetStatement('for (i in x) { x; }');
        expect(statement.left.type).to.equal('Identifier');
        expect(statement.left.name).to.equal('i');
        expect(statement.right.type).to.equal('Identifier');
        expect(statement.right.name).to.equal('x');
        expect(statement.body.type).to.equal('BlockStatement');
        expect(statement.each).to.equal(false);
    });
});
