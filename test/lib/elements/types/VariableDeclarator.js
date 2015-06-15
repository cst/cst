import {parseAndGetStatementInVariableDeclarator} from '../../../utils';
import {expect} from 'chai';

describe('VariableDeclarator', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatementInVariableDeclarator('x').type).to.equal('VariableDeclarator');
    });

    it('should accept declaration without init', () => {
        var statement = parseAndGetStatementInVariableDeclarator('x');
        expect(statement.type).to.equal('VariableDeclarator');
        expect(statement.id.name).to.equal('x');
        expect(statement.init).to.equal(null);
    });

    it('should accept declaration with init', () => {
        var statement = parseAndGetStatementInVariableDeclarator('x = 1');
        expect(statement.type).to.equal('VariableDeclarator');
        expect(statement.id.name).to.equal('x');
        expect(statement.init.type).to.equal('Literal');
        expect(statement.init.value).to.equal(1);
    });

    it('should accept declaration with parentheses', () => {
        var statement = parseAndGetStatementInVariableDeclarator('x = ( 1 )');
        expect(statement.type).to.equal('VariableDeclarator');
        expect(statement.id.name).to.equal('x');
        expect(statement.init.type).to.equal('Literal');
        expect(statement.init.value).to.equal(1);
    });

    it('should accept array pattern', () => {
        var statement = parseAndGetStatementInVariableDeclarator('[ x ] = ( 1 )');
        expect(statement.type).to.equal('VariableDeclarator');
        expect(statement.id.type).to.equal('ArrayPattern');
        expect(statement.id.elements[0].type).to.equal('Identifier');
        expect(statement.id.elements[0].name).to.equal('x');
        expect(statement.init.type).to.equal('Literal');
        expect(statement.init.value).to.equal(1);
    });

    it('should accept object pattern', () => {
        var statement = parseAndGetStatementInVariableDeclarator('{ x } = ( 1 )');
        expect(statement.type).to.equal('VariableDeclarator');
        expect(statement.id.type).to.equal('ObjectPattern');
        expect(statement.id.properties[0].key.type).to.equal('Identifier');
        expect(statement.id.properties[0].key.name).to.equal('x');
        expect(statement.init.type).to.equal('Literal');
        expect(statement.init.value).to.equal(1);
    });
});
