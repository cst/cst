import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('WhileStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('while(true);').type).to.equal('WhileStatement');
    });

    it('should accept single statement', () => {
        var statement = parseAndGetStatement('while (true) x;');
        expect(statement.test.type).to.equal('Literal');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept expression in parentheses', () => {
        var statement = parseAndGetStatement('while ((true)) x;');
        expect(statement.test.type).to.equal('Literal');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept whitespaces', () => {
        var statement = parseAndGetStatement('while ( true ) x ;');
        expect(statement.test.type).to.equal('Literal');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept blocks', () => {
        var statement = parseAndGetStatement('while ( true ) { x; }');
        expect(statement.test.type).to.equal('Literal');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('BlockStatement');
    });
});
