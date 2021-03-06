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
        expect(param.left.properties[0].type).to.equal('ObjectProperty');
        expect(param.left.properties[0].shorthand).to.equal(true);
        expect(param.left.properties[0].key.type).to.equal('Identifier');
        expect(param.left.properties[0].key.name).to.equal('x');
        expect(param.left.properties[0].value.type).to.equal('Identifier');
        expect(param.left.properties[0].value.name).to.equal('x');

        expect(param.left.properties[1].type).to.equal('ObjectProperty');
        expect(param.left.properties[1].shorthand).to.equal(true);
        expect(param.left.properties[1].key.type).to.equal('Identifier');
        expect(param.left.properties[1].key.name).to.equal('y');
        expect(param.left.properties[1].value.type).to.equal('Identifier');
        expect(param.left.properties[1].value.name).to.equal('y');

        expect(param.right.type).to.equal('ObjectExpression');
        expect(param.right.properties.length).to.equal(2);
        expect(param.right.properties[0].type).to.equal('ObjectProperty');
        expect(param.right.properties[0].shorthand).to.equal(false);
        expect(param.right.properties[0].key.type).to.equal('Identifier');
        expect(param.right.properties[0].key.name).to.equal('x');
        expect(param.right.properties[0].value.type).to.equal('NumericLiteral');
        expect(param.right.properties[0].value.value).to.equal(1);

        expect(param.right.properties[1].type).to.equal('ObjectProperty');
        expect(param.right.properties[1].shorthand).to.equal(false);
        expect(param.right.properties[1].key.type).to.equal('Identifier');
        expect(param.right.properties[1].key.name).to.equal('y');
        expect(param.right.properties[1].value.type).to.equal('NumericLiteral');
        expect(param.right.properties[1].value.value).to.equal(2);
    });

    it('should accept destructed object with defaults and spaces', () => {
        let param = parseAndGetStatementInFunctionParams(' {x = 1, y = 2} = {} ')[0];
        expect(param.left.type).to.equal('ObjectPattern');
        expect(param.left.properties.length).to.equal(2);
        expect(param.left.properties[0].type).to.equal('ObjectProperty');
        expect(param.left.properties[0].shorthand).to.equal(false);
        expect(param.left.properties[0].key.type).to.equal('Identifier');
        expect(param.left.properties[0].key.name).to.equal('x');
        expect(param.left.properties[0].value.type).to.equal('AssignmentPattern');
        expect(param.left.properties[0].value.left.name).to.equal('x');
        expect(param.left.properties[0].value.right.value).to.equal(1);

        expect(param.left.properties[1].type).to.equal('ObjectProperty');
        expect(param.left.properties[1].shorthand).to.equal(false);
        expect(param.left.properties[1].key.type).to.equal('Identifier');
        expect(param.left.properties[1].key.name).to.equal('y');
        expect(param.left.properties[1].value.type).to.equal('AssignmentPattern');
        expect(param.left.properties[1].value.left.name).to.equal('y');
        expect(param.left.properties[1].value.right.value).to.equal(2);

        expect(param.right.type).to.equal('ObjectExpression');
        expect(param.right.properties).to.eql([]);
    });

    it('should accept destructed object with rename', () => {
        let param = parseAndGetStatementInFunctionParams(' {x: a, y: b} = {} ')[0];
        expect(param.left.type).to.equal('ObjectPattern');
        expect(param.left.properties.length).to.equal(2);
        expect(param.left.properties[0].type).to.equal('ObjectProperty');
        expect(param.left.properties[0].shorthand).to.equal(false);
        expect(param.left.properties[0].key.type).to.equal('Identifier');
        expect(param.left.properties[0].key.name).to.equal('x');
        expect(param.left.properties[0].value.type).to.equal('Identifier');
        expect(param.left.properties[0].value.name).to.equal('a');

        expect(param.left.properties[1].type).to.equal('ObjectProperty');
        expect(param.left.properties[1].shorthand).to.equal(false);
        expect(param.left.properties[1].key.type).to.equal('Identifier');
        expect(param.left.properties[1].key.name).to.equal('y');
        expect(param.left.properties[1].value.type).to.equal('Identifier');
        expect(param.left.properties[1].value.name).to.equal('b');

        expect(param.right.type).to.equal('ObjectExpression');
        expect(param.right.properties).to.eql([]);
    });

    it('should accept destructed object with rename and defaults', () => {
        const param = parseAndGetStatementInFunctionParams(' {x: a = 1, y: b = 2} = {} ')[0];
        expect(param.left.type).to.equal('ObjectPattern');
        expect(param.left.properties.length).to.equal(2);
        expect(param.left.properties[0].type).to.equal('ObjectProperty');
        expect(param.left.properties[0].shorthand).to.equal(false);
        expect(param.left.properties[0].key.type).to.equal('Identifier');
        expect(param.left.properties[0].key.name).to.equal('x');
        expect(param.left.properties[0].value.type).to.equal('AssignmentPattern');
        expect(param.left.properties[0].value.left.type).to.equal('Identifier');
        expect(param.left.properties[0].value.left.name).to.equal('a');
        expect(param.left.properties[0].value.right.type).to.equal('NumericLiteral');
        expect(param.left.properties[0].value.right.value).to.equal(1);


        expect(param.left.properties[1].type).to.equal('ObjectProperty');
        expect(param.left.properties[1].shorthand).to.equal(false);
        expect(param.left.properties[1].key.type).to.equal('Identifier');
        expect(param.left.properties[1].key.name).to.equal('y');
        expect(param.left.properties[1].value.type).to.equal('AssignmentPattern');
        expect(param.left.properties[1].value.left.type).to.equal('Identifier');
        expect(param.left.properties[1].value.left.name).to.equal('b');
        expect(param.left.properties[1].value.right.type).to.equal('NumericLiteral');
        expect(param.left.properties[1].value.right.value).to.equal(2);

        expect(param.right.type).to.equal('ObjectExpression');
        expect(param.right.properties).to.eql([]);
    });

    it('should accect nested object pattern', () => {
        let param = parseAndGetStatementInFunctionParams('{ x: { y } } = {}')[0];
        expect(param.left.type).to.equal('ObjectPattern');
        expect(param.left.properties.length).to.equal(1);
        const x = param.left.properties[0];
        expect(x.type).to.equal('ObjectProperty');
        expect(x.shorthand).to.equal(false);
        expect(x.key.type).to.equal('Identifier');
        expect(x.key.name).to.equal('x');

        expect(x.value.type).to.equal('ObjectPattern');
        expect(x.value.properties.length).to.equal(1);
        const y = x.value.properties[0];
        expect(y.type).to.equal('ObjectProperty');
        expect(y.shorthand).to.equal(true);
        expect(y.key.type).to.equal('Identifier');
        expect(y.key.name).to.equal('y');
        expect(y.value).to.equal(y.key);

        expect(param.right.type).to.equal('ObjectExpression');
        expect(param.right.properties).to.eql([]);
    });

    it('should accept nested object pattern with default', () => {
        let param = parseAndGetStatementInFunctionParams('{ x: { y = 2 } } = {}')[0];
        expect(param.left.type).to.equal('ObjectPattern');
        expect(param.left.properties.length).to.equal(1);
        const x = param.left.properties[0];
        expect(x.type).to.equal('ObjectProperty');
        expect(x.shorthand).to.equal(false);
        expect(x.key.type).to.equal('Identifier');
        expect(x.key.name).to.equal('x');

        expect(x.value.type).to.equal('ObjectPattern');
        expect(x.value.properties.length).to.equal(1);
        const y = x.value.properties[0];
        expect(y.type).to.equal('ObjectProperty');
        expect(y.shorthand).to.equal(false);
        expect(y.key.type).to.equal('Identifier');
        expect(y.key.name).to.equal('y');
        expect(y.value.type).to.equal('AssignmentPattern');
        expect(y.value.left.type).to.equal('Identifier');
        expect(y.value.left.name).to.equal('y');
        expect(y.value.right.type).to.equal('NumericLiteral');
        expect(y.value.right.value).to.equal(2);

        expect(param.right.type).to.equal('ObjectExpression');
        expect(param.right.properties).to.eql([]);
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

    it('should accept destructed array with defaults and spaces', () => {
        let param = parseAndGetStatementInFunctionParams(' [x = 1, y = 2] = [] ')[0];
        expect(param.left.type).to.equal('ArrayPattern');
        expect(param.left.elements.length).to.equal(2);
        expect(param.left.elements[0].type).to.equal('AssignmentPattern');
        expect(param.left.elements[0].left.name).to.equal('x');
        expect(param.left.elements[0].right.value).to.equal(1);
        expect(param.left.elements[1].type).to.equal('AssignmentPattern');
        expect(param.left.elements[1].left.name).to.equal('y');
        expect(param.left.elements[1].right.value).to.equal(2);

        expect(param.right.type).to.equal('ArrayExpression');
        expect(param.right.elements.length).to.equal(0);
    });
});
