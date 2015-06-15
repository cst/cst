import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('FunctionDeclaration', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('function func(){}').type).to.equal('FunctionDeclaration');
    });

    it('should accept empty params', () => {
        var expression = parseAndGetStatement('function func(){}');
        expect(expression.params.length).to.equal(0);
        expect(expression.body.type).to.equal('BlockStatement');
        expect(expression.body.body.length).to.equal(0);
        expect(expression.generator).to.equal(false);
        expect(expression.expression).to.equal(false);
    });

    it('should accept statement', () => {
        var expression = parseAndGetStatement('function func(){x;}');
        expect(expression.params.length).to.equal(0);
        expect(expression.body.type).to.equal('BlockStatement');
        expect(expression.body.body.length).to.equal(1);
        expect(expression.generator).to.equal(false);
        expect(expression.expression).to.equal(false);
    });

    it('should accept single argument', () => {
        var expression = parseAndGetStatement('function func ( x ) { }');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.generator).to.equal(false);
    });

    it('should accept multiple arguments', () => {
        var expression = parseAndGetStatement('function func ( x , y ) { }');
        expect(expression.params.length).to.equal(2);
        expect(expression.params[0].type).to.equal('Identifier');
        expect(expression.params[0].name).to.equal('x');
        expect(expression.params[1].type).to.equal('Identifier');
        expect(expression.params[1].name).to.equal('y');
        expect(expression.generator).to.equal(false);
    });

    it('should accept array pattern', () => {
        var expression = parseAndGetStatement('function func ( [ x ] ) { ; }');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('ArrayPattern');
        expect(expression.generator).to.equal(false);
    });

    it('should accept object pattern', () => {
        var expression = parseAndGetStatement('function func ( { x } ) { ; }');
        expect(expression.params.length).to.equal(1);
        expect(expression.params[0].type).to.equal('ObjectPattern');
        expect(expression.generator).to.equal(false);
    });

    it('should support generator', () => {
        var expression = parseAndGetStatement('function * func ( x ) { ; }');
        expect(expression.generator).to.equal(true);
    });
});
