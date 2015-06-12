import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('IfStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('if(true);').type).to.equal('IfStatement');
    });

    it('should accept single statement', () => {
        var statement = parseAndGetStatement('if (true) x;');
        expect(statement.test.type).to.equal('Literal');
        expect(statement.test.value).to.equal(true);
        expect(statement.consequent.type).to.equal('ExpressionStatement');
        expect(statement.consequent.expression.type).to.equal('Identifier');
        expect(statement.consequent.expression.name).to.equal('x');
    });

    it('should accept single else statement', () => {
        var statement = parseAndGetStatement('if ( true ) x ; else y ;');
        expect(statement.test.type).to.equal('Literal');
        expect(statement.test.value).to.equal(true);
        expect(statement.consequent.type).to.equal('ExpressionStatement');
        expect(statement.consequent.expression.type).to.equal('Identifier');
        expect(statement.consequent.expression.name).to.equal('x');
        expect(statement.alternate.type).to.equal('ExpressionStatement');
        expect(statement.alternate.expression.type).to.equal('Identifier');
        expect(statement.alternate.expression.name).to.equal('y');
    });

    it('should accept blocks', () => {
        var statement = parseAndGetStatement('if ( true ) { x; } else { y; }');
        expect(statement.test.type).to.equal('Literal');
        expect(statement.test.value).to.equal(true);
        expect(statement.consequent.type).to.equal('BlockStatement');
        expect(statement.alternate.type).to.equal('BlockStatement');
    });
});
