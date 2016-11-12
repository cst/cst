import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('FunctionDeclaration', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('function func(){}').type).to.equal('FunctionDeclaration');
    });

    it('should accept empty params', () => {
        let expression = parseAndGetStatement('function func(){}');
        expect(expression.params.length).to.equal(0);
        expect(expression.body.type).to.equal('BlockStatement');
        expect(expression.body.body.length).to.equal(0);
        expect(expression.generator).to.equal(false);
        expect(expression.expression).to.equal(false);
    });

    it('should accept statement', () => {
        let expression = parseAndGetStatement('function func(){x;}');
        expect(expression.params.length).to.equal(0);
        expect(expression.body.type).to.equal('BlockStatement');
        expect(expression.body.body.length).to.equal(1);
        expect(expression.generator).to.equal(false);
        expect(expression.expression).to.equal(false);
    });

    it('should accept single argument', () => {
        let expression = parseAndGetStatement('function func ( x ) { }');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.generator).to.equal(false);
    });

    it('should accept multiple arguments', () => {
        let expression = parseAndGetStatement('function func ( x , y ) { }');
        expect(expression.params.length).to.equal(2);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.params[1].type).to.equal('Identifier');
        expect(expression.params[1].name).to.equal('y');
        expect(expression.generator).to.equal(false);
    });

    it('should accept multiple arguments and a trailing comma', () => {
        let expression = parseAndGetStatement('function func ( x , y , ) { }');
        expect(expression.params.length).to.equal(2);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.params[1].type).to.equal('Identifier');
        expect(expression.params[1].name).to.equal('y');
        expect(expression.generator).to.equal(false);
    });

    it('should accept array pattern', () => {
        let expression = parseAndGetStatement('function func ( [ x ] ) { ; }');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('ArrayPattern');
        expect(expression.generator).to.equal(false);
    });

    it('should accept object pattern', () => {
        let expression = parseAndGetStatement('function func ( { x } ) { ; }');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('ObjectPattern');
        expect(expression.generator).to.equal(false);
    });

    it('should accept object pattern with object pattern', () => {
        let expression = parseAndGetStatement('function func ( { x = 1 } ) { ; }');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('ObjectPattern');
        expect(expression.params[0].properties[0].value.type).to.equal('AssignmentPattern');
    });

    it('should accept object pattern with assignment pattern', () => {
        let expression = parseAndGetStatement('function func ( { x = 1 } = 1 ) { ; }');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('AssignmentPattern');
        expect(expression.params[0].left.type).to.equal('ObjectPattern');
        expect(expression.params[0].left.properties[0].key.type).to.equal('Identifier');
        expect(expression.params[0].left.properties[0].value.type).to.equal('AssignmentPattern');
    });

    it('should support generator', () => {
        let expression = parseAndGetStatement('function * func ( x ) { ; }');
        expect(expression.generator).to.equal(true);
    });

    it('should support async', () => {
        let expression = parseAndGetStatement('async function func ( x ) { ; }');
        expect(expression.type).to.equal('FunctionDeclaration');
        expect(expression.async).to.equal(true);
    });
});
