import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('ForInStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('for(;;);').type).to.equal('ForStatement');
    });

    it('should accept empty agruments', () => {
        let statement = parseAndGetStatement('for ( ; ; ) ;');
        expect(statement.body.type).to.equal('EmptyStatement');
    });

    it('should accept single statement', () => {
        let statement = parseAndGetStatement('for (;;) x;');
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept variable declaration for init', () => {
        let statement = parseAndGetStatement('for ( var i = 0 ;;) ;');
        expect(statement.init.type).to.equal('VariableDeclaration');
        expect(statement.init.declarations[0].id.name).to.equal('i');
        expect(statement.body.type).to.equal('EmptyStatement');
    });

    it('should accept expression for init', () => {
        let statement = parseAndGetStatement('for ( i() ;;) x;');
        expect(statement.init.type).to.equal('CallExpression');
        expect(statement.body.type).to.equal('ExpressionStatement');
        expect(statement.body.expression.type).to.equal('Identifier');
        expect(statement.body.expression.name).to.equal('x');
    });

    it('should accept parentheses for init', () => {
        let statement = parseAndGetStatement('for ( ( i() ) ;;) ;');
        expect(statement.init.type).to.equal('CallExpression');
        expect(statement.body.type).to.equal('EmptyStatement');
    });

    it('should accept expression for test', () => {
        let statement = parseAndGetStatement('for (; i() ;) ;');
        expect(statement.test.type).to.equal('CallExpression');
        expect(statement.body.type).to.equal('EmptyStatement');
    });

    it('should accept parentheses for test', () => {
        let statement = parseAndGetStatement('for (; ( i() ) ;) ;');
        expect(statement.test.type).to.equal('CallExpression');
        expect(statement.body.type).to.equal('EmptyStatement');
    });

    it('should accept expression for update', () => {
        let statement = parseAndGetStatement('for (;; i() ) ;');
        expect(statement.update.type).to.equal('CallExpression');
        expect(statement.body.type).to.equal('EmptyStatement');
    });

    it('should accept parentheses for update', () => {
        let statement = parseAndGetStatement('for (;; ( i() ) ) ;');
        expect(statement.update.type).to.equal('CallExpression');
        expect(statement.body.type).to.equal('EmptyStatement');
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
    });

    it('should accept blocks', () => {
        let statement = parseAndGetStatement('for (;;) { x; }');
        expect(statement.body.type).to.equal('BlockStatement');
    });
});
