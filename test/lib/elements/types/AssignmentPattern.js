import {parseAndGetStatementInFunctionParams} from '../../../utils';
import {expect} from 'chai';

describe('AssignmentPattern', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatementInFunctionParams('x = 1')[0].type).to.equal('AssignmentPattern');
    });

    it('should accept single default param', () => {
        let param = parseAndGetStatementInFunctionParams('x=1')[0];
        expect(param.left.type).to.equal('Identifier');
        expect(param.left.name).to.equal('x');
        expect(param.right.type).to.equal('NumericLiteral');
        expect(param.right.value).to.equal(1);
    });

    it('should accept single default param with spaces', () => {
        let param = parseAndGetStatementInFunctionParams(' x = 1 ')[0];
        expect(param.left.type).to.equal('Identifier');
        expect(param.left.name).to.equal('x');
        expect(param.right.type).to.equal('NumericLiteral');
        expect(param.right.value).to.equal(1);
    });

    it('should accept multiple default params', () => {
        let params = parseAndGetStatementInFunctionParams('x=1,y=2,z=3');
        expect(params[0].left.type).to.equal('Identifier');
        expect(params[0].left.name).to.equal('x');
        expect(params[0].right.type).to.equal('NumericLiteral');
        expect(params[0].right.value).to.equal(1);
        expect(params[1].left.type).to.equal('Identifier');
        expect(params[1].left.name).to.equal('y');
        expect(params[1].right.type).to.equal('NumericLiteral');
        expect(params[1].right.value).to.equal(2);
        expect(params[2].left.type).to.equal('Identifier');
        expect(params[2].left.name).to.equal('z');
        expect(params[2].right.type).to.equal('NumericLiteral');
        expect(params[2].right.value).to.equal(3);
    });

    it('should accept multiple keys with spaces', () => {
        let params = parseAndGetStatementInFunctionParams(' x = 1, y = 2, z = 3 ');
        expect(params[0].left.type).to.equal('Identifier');
        expect(params[0].left.name).to.equal('x');
        expect(params[0].right.type).to.equal('NumericLiteral');
        expect(params[0].right.value).to.equal(1);
        expect(params[1].left.type).to.equal('Identifier');
        expect(params[1].left.name).to.equal('y');
        expect(params[1].right.type).to.equal('NumericLiteral');
        expect(params[1].right.value).to.equal(2);
        expect(params[2].left.type).to.equal('Identifier');
        expect(params[2].left.name).to.equal('z');
        expect(params[2].right.type).to.equal('NumericLiteral');
        expect(params[2].right.value).to.equal(3);
    });

    it('should accept single default param expression', () => {
        let param = parseAndGetStatementInFunctionParams('x=1+2')[0];
        expect(param.left.type).to.equal('Identifier');
        expect(param.left.name).to.equal('x');
        expect(param.right.type).to.equal('BinaryExpression');
        expect(param.right.left.type).to.equal('NumericLiteral');
        expect(param.right.left.value).to.equal(1);
        expect(param.right.operator).to.equal('+');
        expect(param.right.right.type).to.equal('NumericLiteral');
        expect(param.right.right.value).to.equal(2);
    });

    it('should accept single default param expression with spaces', () => {
        let param = parseAndGetStatementInFunctionParams(' x = 1 + 2 ')[0];
        expect(param.left.type).to.equal('Identifier');
        expect(param.left.name).to.equal('x');
        expect(param.right.type).to.equal('BinaryExpression');
        expect(param.right.left.type).to.equal('NumericLiteral');
        expect(param.right.left.value).to.equal(1);
        expect(param.right.operator).to.equal('+');
        expect(param.right.right.type).to.equal('NumericLiteral');
        expect(param.right.right.value).to.equal(2);
    });

    it('should accept destructed object with default and spaces', () => {
        let param = parseAndGetStatementInFunctionParams(' {x, y} = {x: 1, y: 2} ')[0];
        expect(param.left.type).to.equal('ObjectPattern');
        expect(param.left.properties.length).to.equal(2);
        expect(param.left.properties[0].type).to.equal('Property');
        expect(param.left.properties[0].shorthand).to.equal(true);
        expect(param.left.properties[0].key.type).to.equal('Identifier');
        expect(param.left.properties[0].key.name).to.equal('x');
        expect(param.left.properties[0].value.type).to.equal('Identifier');
        expect(param.left.properties[0].value.name).to.equal('x');

        expect(param.left.properties[1].type).to.equal('Property');
        expect(param.left.properties[1].shorthand).to.equal(true);
        expect(param.left.properties[1].key.type).to.equal('Identifier');
        expect(param.left.properties[1].key.name).to.equal('y');
        expect(param.left.properties[1].value.type).to.equal('Identifier');
        expect(param.left.properties[1].value.name).to.equal('y');

        expect(param.right.type).to.equal('ObjectExpression');
        expect(param.right.properties.length).to.equal(2);
        expect(param.right.properties[0].type).to.equal('Property');
        expect(param.right.properties[0].shorthand).to.equal(false);
        expect(param.right.properties[0].key.type).to.equal('Identifier');
        expect(param.right.properties[0].key.name).to.equal('x');
        expect(param.right.properties[0].value.type).to.equal('NumericLiteral');
        expect(param.right.properties[0].value.value).to.equal(1);

        expect(param.right.properties[1].type).to.equal('Property');
        expect(param.right.properties[1].shorthand).to.equal(false);
        expect(param.right.properties[1].key.type).to.equal('Identifier');
        expect(param.right.properties[1].key.name).to.equal('y');
        expect(param.right.properties[1].value.type).to.equal('NumericLiteral');
        expect(param.right.properties[1].value.value).to.equal(2);
    });

    it('should accept destructed array with default and spaces', () => {
        let param = parseAndGetStatementInFunctionParams(' [x, y] = [1, 2] ')[0];
        expect(param.left.type).to.equal('ArrayPattern');
        expect(param.left.elements.length).to.equal(2);
        expect(param.left.elements[0].type).to.equal('Identifier');
        expect(param.left.elements[0].name).to.equal('x');
        expect(param.left.elements[1].type).to.equal('Identifier');
        expect(param.left.elements[1].name).to.equal('y');

        expect(param.right.type).to.equal('ArrayExpression');
        expect(param.right.elements.length).to.equal(2);
        expect(param.right.elements[0].type).to.equal('NumericLiteral');
        expect(param.right.elements[0].value).to.equal(1);
        expect(param.right.elements[1].type).to.equal('NumericLiteral');
        expect(param.right.elements[1].value).to.equal(2);
    });
});
