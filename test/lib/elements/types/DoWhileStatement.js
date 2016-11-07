import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('DoWhileStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('do; while(true);').type).to.equal('DoWhileStatement');
    });

    it('should accept single statement', () => {
        let statement = parseAndGetStatement('do x; while (true);');
        expect(statement.test.type).to.equal('BooleanLiteral');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept expression in parentheses', () => {
        let statement = parseAndGetStatement('do x; while ((true));');
        expect(statement.test.type).to.equal('BooleanLiteral');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept whitespaces', () => {
        let statement = parseAndGetStatement('do x ; while ( true );');
        expect(statement.test.type).to.equal('BooleanLiteral');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept blocks', () => {
        let statement = parseAndGetStatement('do { x; } while ( true );');
        expect(statement.test.type).to.equal('BooleanLiteral');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('BlockStatement');
    });

    it('should work without semicolon', () => {
        let statement = parseAndGetStatement('do x ; while ( true )');
        expect(statement.test.type).to.equal('BooleanLiteral');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });
});
