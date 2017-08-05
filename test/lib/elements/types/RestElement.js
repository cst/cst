import {parseAndGetStatement, parseAndGetStatementInFunctionParams, parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('RestElement', () => {
    it('should yield correct type', () => {
        expect(parseAndGetStatementInFunctionParams('...a')[0].type).to.equal('RestElement');
    });

    it('should accept a single identifier', () => {
        let statement = parseAndGetStatementInFunctionParams('...a')[0];
        expect(statement.type).to.equal('RestElement');
        expect(statement.argument.type).to.equal('Identifier');
        expect(statement.argument.name).to.equal('a');
    });

    it('should accept a single identifier with whitespace in between', () => {
        let statement = parseAndGetStatementInFunctionParams('... a')[0];
        expect(statement.type).to.equal('RestElement');
        expect(statement.argument.type).to.equal('Identifier');
        expect(statement.argument.name).to.equal('a');
    });

    it('should accept a single identifier with a comment in between', () => {
        let statement = parseAndGetStatementInFunctionParams('... /* adsf */ a')[0];
        expect(statement.type).to.equal('RestElement');
        expect(statement.argument.type).to.equal('Identifier');
        expect(statement.argument.name).to.equal('a');
    });

    it('should allow other params on the left', () => {
        let statements = parseAndGetStatementInFunctionParams('a, ...b');
        expect(statements[0].type).to.equal('Identifier');
        expect(statements[0].name).to.equal('a');

        expect(statements[1].type).to.equal('RestElement');
        expect(statements[1].argument.type).to.equal('Identifier');
        expect(statements[1].argument.name).to.equal('b');
    });

    it('should support rest element with pattern in assignment', () => {
        let expression = parseAndGetExpression('[a, ...b] = 1');
        expect(expression.left.type).to.equal('ArrayPattern');
        expect(expression.left.elements[1].type).to.equal('RestElement');
        expect(expression.left.elements[1].argument.type).to.equal('Identifier');
        expect(expression.left.elements[1].argument.name).to.equal('b');
    });

    it('should support rest element with expression in assignment', () => {
        let expression = parseAndGetExpression('[a, ...x.b] = 1');
        expect(expression.left.type).to.equal('ArrayPattern');
        expect(expression.left.elements[1].type).to.equal('RestElement');
        expect(expression.left.elements[1].argument.type).to.equal('MemberExpression');
        expect(expression.left.elements[1].argument.object.name).to.equal('x');
        expect(expression.left.elements[1].argument.property.name).to.equal('b');
    });
});

describe('RestElement in ObjectPattern', () => {
    it('should yield correct type', () => {
        let properties = parseAndGetStatement('let {...a} = b;').declarations[0].id.properties;
        expect(properties[0].type).to.equal('RestElement');
    });

    it('should accept a single identifier', () => {
        let properties = parseAndGetStatement('let {...a} = b;').declarations[0].id.properties;
        expect(properties[0].type).to.equal('RestElement');
        expect(properties[0].argument.type).to.equal('Identifier');
        expect(properties[0].argument.name).to.equal('a');
    });

    it('should accept a single identifier with a comment in between', () => {
        let properties = parseAndGetStatement('let {... /* a */ a} = b;').declarations[0].id.properties;
        expect(properties[0].type).to.equal('RestElement');
        expect(properties[0].argument.type).to.equal('Identifier');
        expect(properties[0].argument.name).to.equal('a');
    });

    it('should allow other params', () => {
        let properties = parseAndGetStatement('let { a, ... b } = c ;').declarations[0].id.properties;
        expect(properties[0].type).to.equal('ObjectProperty');
        expect(properties[0].key.type).to.equal('Identifier');
        expect(properties[0].key.name).to.equal('a');
        expect(properties[0].value.type).to.equal('Identifier');
        expect(properties[0].value.name).to.equal('a');
        expect(properties[1].type).to.equal('RestElement');
        expect(properties[1].argument.type).to.equal('Identifier');
        expect(properties[1].argument.name).to.equal('b');
    });
});
