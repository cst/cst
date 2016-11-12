import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('WhileStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('while(true);').type).to.equal('WhileStatement');
    });

    it('should accept single statement', () => {
        let statement = parseAndGetStatement('while (true) x;');
        expect(statement.test.type).to.equal('BooleanLiteral');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept expression in parentheses', () => {
        let statement = parseAndGetStatement('while ((true)) x;');
        expect(statement.test.type).to.equal('BooleanLiteral');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept whitespaces', () => {
        let statement = parseAndGetStatement('while ( true ) x ;');
        expect(statement.test.type).to.equal('BooleanLiteral');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept blocks', () => {
        let statement = parseAndGetStatement('while ( true ) { x; }');
        expect(statement.test.type).to.equal('BooleanLiteral');
        expect(statement.test.value).to.equal(true);
        expect(statement.body.type).to.equal('BlockStatement');
    });
});
