import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('ObjectExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('{x}').type).to.equal('ObjectExpression');
    });

    it('should accept single key', () => {
        let expression = parseAndGetExpression('{x}');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('x');
        expect(expression.properties[0].shorthand).to.equal(true);
        expect(expression.properties[0].kind).to.equal('init');
    });

    it('should accept single key with trailing comma', () => {
        let expression = parseAndGetExpression('{x,}');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('x');
        expect(expression.properties[0].shorthand).to.equal(true);
        expect(expression.properties[0].kind).to.equal('init');
    });

    it('should accept single key with spaces', () => {
        let expression = parseAndGetExpression('{ x }');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('x');
        expect(expression.properties[0].shorthand).to.equal(true);
        expect(expression.properties[0].kind).to.equal('init');
    });

    it('should accept single key with spaces and trailing comma', () => {
        let expression = parseAndGetExpression('{ x , }');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('x');
        expect(expression.properties[0].shorthand).to.equal(true);
        expect(expression.properties[0].kind).to.equal('init');
    });

    it('should accept multiple keys', () => {
        let expression = parseAndGetExpression('{x,y,z}');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('x');
        expect(expression.properties[0].shorthand).to.equal(true);
        expect(expression.properties[0].kind).to.equal('init');
        expect(expression.properties[1].key.type).to.equal('Identifier');
        expect(expression.properties[1].key.name).to.equal('y');
        expect(expression.properties[1].value.type).to.equal('Identifier');
        expect(expression.properties[1].value.name).to.equal('y');
        expect(expression.properties[1].shorthand).to.equal(true);
        expect(expression.properties[1].kind).to.equal('init');
        expect(expression.properties[2].key.type).to.equal('Identifier');
        expect(expression.properties[2].key.name).to.equal('z');
        expect(expression.properties[2].value.type).to.equal('Identifier');
        expect(expression.properties[2].value.name).to.equal('z');
        expect(expression.properties[2].shorthand).to.equal(true);
        expect(expression.properties[2].kind).to.equal('init');
    });

    it('should accept multiple keys with trailing comma', () => {
        let expression = parseAndGetExpression('{x,y,z,}');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('x');
        expect(expression.properties[0].shorthand).to.equal(true);
        expect(expression.properties[0].kind).to.equal('init');
        expect(expression.properties[1].key.type).to.equal('Identifier');
        expect(expression.properties[1].key.name).to.equal('y');
        expect(expression.properties[1].value.type).to.equal('Identifier');
        expect(expression.properties[1].value.name).to.equal('y');
        expect(expression.properties[1].shorthand).to.equal(true);
        expect(expression.properties[1].kind).to.equal('init');
        expect(expression.properties[2].key.type).to.equal('Identifier');
        expect(expression.properties[2].key.name).to.equal('z');
        expect(expression.properties[2].value.type).to.equal('Identifier');
        expect(expression.properties[2].value.name).to.equal('z');
        expect(expression.properties[2].shorthand).to.equal(true);
        expect(expression.properties[2].kind).to.equal('init');
    });

    it('should accept multiple keys with spaces', () => {
        let expression = parseAndGetExpression('{ x , y , z }');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('x');
        expect(expression.properties[0].shorthand).to.equal(true);
        expect(expression.properties[0].kind).to.equal('init');
        expect(expression.properties[1].key.type).to.equal('Identifier');
        expect(expression.properties[1].key.name).to.equal('y');
        expect(expression.properties[1].value.type).to.equal('Identifier');
        expect(expression.properties[1].value.name).to.equal('y');
        expect(expression.properties[1].shorthand).to.equal(true);
        expect(expression.properties[1].kind).to.equal('init');
        expect(expression.properties[2].key.type).to.equal('Identifier');
        expect(expression.properties[2].key.name).to.equal('z');
        expect(expression.properties[2].value.type).to.equal('Identifier');
        expect(expression.properties[2].value.name).to.equal('z');
        expect(expression.properties[2].shorthand).to.equal(true);
        expect(expression.properties[2].kind).to.equal('init');
    });

    it('should accept multiple keys with spaces and trailing comma', () => {
        let expression = parseAndGetExpression('{ x , y , z , }');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('x');
        expect(expression.properties[0].shorthand).to.equal(true);
        expect(expression.properties[0].kind).to.equal('init');
        expect(expression.properties[1].key.type).to.equal('Identifier');
        expect(expression.properties[1].key.name).to.equal('y');
        expect(expression.properties[1].value.type).to.equal('Identifier');
        expect(expression.properties[1].value.name).to.equal('y');
        expect(expression.properties[1].shorthand).to.equal(true);
        expect(expression.properties[1].kind).to.equal('init');
        expect(expression.properties[2].key.type).to.equal('Identifier');
        expect(expression.properties[2].key.name).to.equal('z');
        expect(expression.properties[2].value.type).to.equal('Identifier');
        expect(expression.properties[2].value.name).to.equal('z');
        expect(expression.properties[2].shorthand).to.equal(true);
        expect(expression.properties[2].kind).to.equal('init');
    });

    it('should accept single key with value', () => {
        let expression = parseAndGetExpression('{x:y}');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('y');
        expect(expression.properties[0].shorthand).to.equal(false);
        expect(expression.properties[0].kind).to.equal('init');
    });

    it('should accept single key with trailing comma', () => {
        let expression = parseAndGetExpression('{x:y,}');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('y');
        expect(expression.properties[0].shorthand).to.equal(false);
        expect(expression.properties[0].kind).to.equal('init');
    });

    it('should accept single key with spaces', () => {
        let expression = parseAndGetExpression('{ x : y }');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('y');
        expect(expression.properties[0].shorthand).to.equal(false);
        expect(expression.properties[0].kind).to.equal('init');
    });

    it('should accept single key with spaces and trailing comma', () => {
        let expression = parseAndGetExpression('{ x : y , }');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('y');
        expect(expression.properties[0].shorthand).to.equal(false);
        expect(expression.properties[0].kind).to.equal('init');
    });

    it('should accept multiple keys with values', () => {
        let expression = parseAndGetExpression('{x:y,y:z,z:w}');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('y');
        expect(expression.properties[0].shorthand).to.equal(false);
        expect(expression.properties[0].kind).to.equal('init');
        expect(expression.properties[1].key.type).to.equal('Identifier');
        expect(expression.properties[1].key.name).to.equal('y');
        expect(expression.properties[1].value.type).to.equal('Identifier');
        expect(expression.properties[1].value.name).to.equal('z');
        expect(expression.properties[1].shorthand).to.equal(false);
        expect(expression.properties[1].kind).to.equal('init');
        expect(expression.properties[2].key.type).to.equal('Identifier');
        expect(expression.properties[2].key.name).to.equal('z');
        expect(expression.properties[2].value.type).to.equal('Identifier');
        expect(expression.properties[2].value.name).to.equal('w');
        expect(expression.properties[2].shorthand).to.equal(false);
        expect(expression.properties[2].kind).to.equal('init');
    });

    it('should accept multiple keys with values and trailing comma', () => {
        let expression = parseAndGetExpression('{x:y,y:z,z:w,}');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('y');
        expect(expression.properties[0].shorthand).to.equal(false);
        expect(expression.properties[0].kind).to.equal('init');
        expect(expression.properties[1].key.type).to.equal('Identifier');
        expect(expression.properties[1].key.name).to.equal('y');
        expect(expression.properties[1].value.type).to.equal('Identifier');
        expect(expression.properties[1].value.name).to.equal('z');
        expect(expression.properties[1].shorthand).to.equal(false);
        expect(expression.properties[1].kind).to.equal('init');
        expect(expression.properties[2].key.type).to.equal('Identifier');
        expect(expression.properties[2].key.name).to.equal('z');
        expect(expression.properties[2].value.type).to.equal('Identifier');
        expect(expression.properties[2].value.name).to.equal('w');
        expect(expression.properties[2].shorthand).to.equal(false);
        expect(expression.properties[2].kind).to.equal('init');
    });

    it('should accept multiple keys with values and spaces', () => {
        let expression = parseAndGetExpression('{ x : y , y : z , z : w }');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('y');
        expect(expression.properties[0].shorthand).to.equal(false);
        expect(expression.properties[0].kind).to.equal('init');
        expect(expression.properties[1].key.type).to.equal('Identifier');
        expect(expression.properties[1].key.name).to.equal('y');
        expect(expression.properties[1].value.type).to.equal('Identifier');
        expect(expression.properties[1].value.name).to.equal('z');
        expect(expression.properties[1].shorthand).to.equal(false);
        expect(expression.properties[1].kind).to.equal('init');
        expect(expression.properties[2].key.type).to.equal('Identifier');
        expect(expression.properties[2].key.name).to.equal('z');
        expect(expression.properties[2].value.type).to.equal('Identifier');
        expect(expression.properties[2].value.name).to.equal('w');
        expect(expression.properties[2].shorthand).to.equal(false);
        expect(expression.properties[2].kind).to.equal('init');
    });

    it('should accept multiple keys with values and spaces and trailing comma', () => {
        let expression = parseAndGetExpression('{ x : y , y : z , z : w , }');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('Identifier');
        expect(expression.properties[0].value.name).to.equal('y');
        expect(expression.properties[0].shorthand).to.equal(false);
        expect(expression.properties[0].kind).to.equal('init');
        expect(expression.properties[1].key.type).to.equal('Identifier');
        expect(expression.properties[1].key.name).to.equal('y');
        expect(expression.properties[1].value.type).to.equal('Identifier');
        expect(expression.properties[1].value.name).to.equal('z');
        expect(expression.properties[1].shorthand).to.equal(false);
        expect(expression.properties[1].kind).to.equal('init');
        expect(expression.properties[2].key.type).to.equal('Identifier');
        expect(expression.properties[2].key.name).to.equal('z');
        expect(expression.properties[2].value.type).to.equal('Identifier');
        expect(expression.properties[2].value.name).to.equal('w');
        expect(expression.properties[2].shorthand).to.equal(false);
        expect(expression.properties[2].kind).to.equal('init');
    });

    it('should accept getters', () => {
        let expression = parseAndGetExpression('{get x(){;},get y(){;}}');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].value.type).to.equal('FunctionExpression');
        expect(expression.properties[0].kind).to.equal('get');
        expect(expression.properties[0].shorthand).to.equal(false);
        expect(expression.properties[0].method).to.equal(false);
        expect(expression.properties[1].key.type).to.equal('Identifier');
        expect(expression.properties[1].key.name).to.equal('y');
        expect(expression.properties[1].value.type).to.equal('FunctionExpression');
        expect(expression.properties[1].kind).to.equal('get');
        expect(expression.properties[1].shorthand).to.equal(false);
        expect(expression.properties[1].method).to.equal(false);
    });

    it('should accept setters', () => {
        let expression = parseAndGetExpression('{set x(v){;},set y(v){;}}');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].kind).to.equal('set');
        expect(expression.properties[0].value.type).to.equal('FunctionExpression');
        expect(expression.properties[1].key.type).to.equal('Identifier');
        expect(expression.properties[1].key.name).to.equal('y');
        expect(expression.properties[1].kind).to.equal('set');
        expect(expression.properties[1].value.type).to.equal('FunctionExpression');
    });

    it('should accept methods', () => {
        let expression = parseAndGetExpression('{x(v,w){;},y(v,w){;}}');
        expect(expression.properties[0].key.type).to.equal('Identifier');
        expect(expression.properties[0].key.name).to.equal('x');
        expect(expression.properties[0].kind).to.equal('init');
        expect(expression.properties[0].value.type).to.equal('FunctionExpression');
        expect(expression.properties[1].key.type).to.equal('Identifier');
        expect(expression.properties[1].key.name).to.equal('y');
        expect(expression.properties[1].kind).to.equal('init');
        expect(expression.properties[1].value.type).to.equal('FunctionExpression');
    });
});
