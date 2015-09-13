import {parseAndGetClassMember} from '../../../utils';
import {expect} from 'chai';

describe('MethodDefinition', () => {

    it('should accept getters', () => {
        let member = parseAndGetClassMember('get x ( ) { ; }');
        expect(member.key.type).to.equal('Identifier');
        expect(member.key.name).to.equal('x');
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params).to.deep.equal([]);
        expect(member.kind).to.equal('get');
        expect(member.static).to.equal(false);
    });

    it('should accept getters with calculated name', () => {
        let member = parseAndGetClassMember('get [x + 1] ( ) { ; }');
        expect(member.key.type).to.equal('BinaryExpression');
        expect(member.key.left.type).to.equal('Identifier');
        expect(member.key.left.name).to.equal('x');
        expect(member.key.right.type).to.equal('Literal');
        expect(member.key.right.value).to.equal(1);
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params).to.deep.equal([]);
        expect(member.kind).to.equal('get');
        expect(member.static).to.equal(false);
    });

    it('should accept setters', () => {
        let member = parseAndGetClassMember('set x ( v ) { ; }');
        expect(member.key.type).to.equal('Identifier');
        expect(member.key.name).to.equal('x');
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params[0].type).to.deep.equal('Identifier');
        expect(member.value.params[0].name).to.deep.equal('v');
        expect(member.kind).to.equal('set');
        expect(member.static).to.equal(false);
    });

    it('should accept setters with calculated name', () => {
        let member = parseAndGetClassMember('set [x + 1] ( v ) { ; }');
        expect(member.key.type).to.equal('BinaryExpression');
        expect(member.key.left.type).to.equal('Identifier');
        expect(member.key.left.name).to.equal('x');
        expect(member.key.right.type).to.equal('Literal');
        expect(member.key.right.value).to.equal(1);
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params[0].type).to.deep.equal('Identifier');
        expect(member.value.params[0].name).to.deep.equal('v');
        expect(member.kind).to.equal('set');
        expect(member.static).to.equal(false);
    });

    it('should accept methods', () => {
        let member = parseAndGetClassMember('x ( v , w ) { ; }');
        expect(member.key.type).to.equal('Identifier');
        expect(member.key.name).to.equal('x');
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params[0].type).to.deep.equal('Identifier');
        expect(member.value.params[0].name).to.deep.equal('v');
        expect(member.value.params[1].type).to.deep.equal('Identifier');
        expect(member.value.params[1].name).to.deep.equal('w');
        expect(member.kind).to.equal('method');
        expect(member.static).to.equal(false);
    });

    it('should accept constructor', () => {
        let member = parseAndGetClassMember('constructor ( v , w ) { ; }');
        expect(member.key.type).to.equal('Identifier');
        expect(member.key.name).to.equal('constructor');
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params[0].type).to.deep.equal('Identifier');
        expect(member.value.params[0].name).to.deep.equal('v');
        expect(member.value.params[1].type).to.deep.equal('Identifier');
        expect(member.value.params[1].name).to.deep.equal('w');
        expect(member.kind).to.equal('constructor');
        expect(member.static).to.equal(false);
    });

    it('should accept methods with calculated name', () => {
        let member = parseAndGetClassMember('[x + 1] ( v , w ) { ; }');
        expect(member.key.type).to.equal('BinaryExpression');
        expect(member.key.left.type).to.equal('Identifier');
        expect(member.key.left.name).to.equal('x');
        expect(member.key.right.type).to.equal('Literal');
        expect(member.key.right.value).to.equal(1);
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params[0].type).to.deep.equal('Identifier');
        expect(member.value.params[0].name).to.deep.equal('v');
        expect(member.value.params[1].type).to.deep.equal('Identifier');
        expect(member.value.params[1].name).to.deep.equal('w');
        expect(member.kind).to.equal('method');
        expect(member.static).to.equal(false);
    });

    it('should accept static getters', () => {
        let member = parseAndGetClassMember('static get x ( ) { ; }');
        expect(member.key.type).to.equal('Identifier');
        expect(member.key.name).to.equal('x');
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params).to.deep.equal([]);
        expect(member.kind).to.equal('get');
        expect(member.static).to.equal(true);
    });

    it('should accept getters with calculated name', () => {
        let member = parseAndGetClassMember('static get [x + 1] ( ) { ; }');
        expect(member.key.type).to.equal('BinaryExpression');
        expect(member.key.left.type).to.equal('Identifier');
        expect(member.key.left.name).to.equal('x');
        expect(member.key.right.type).to.equal('Literal');
        expect(member.key.right.value).to.equal(1);
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params).to.deep.equal([]);
        expect(member.kind).to.equal('get');
        expect(member.static).to.equal(true);
    });

    it('should accept setters', () => {
        let member = parseAndGetClassMember('static set x ( v ) { ; }');
        expect(member.key.type).to.equal('Identifier');
        expect(member.key.name).to.equal('x');
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params[0].type).to.deep.equal('Identifier');
        expect(member.value.params[0].name).to.deep.equal('v');
        expect(member.kind).to.equal('set');
        expect(member.static).to.equal(true);
    });

    it('should accept setters with calculated name', () => {
        let member = parseAndGetClassMember('static set [x + 1] ( v ) { ; }');
        expect(member.key.type).to.equal('BinaryExpression');
        expect(member.key.left.type).to.equal('Identifier');
        expect(member.key.left.name).to.equal('x');
        expect(member.key.right.type).to.equal('Literal');
        expect(member.key.right.value).to.equal(1);
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params[0].type).to.deep.equal('Identifier');
        expect(member.value.params[0].name).to.deep.equal('v');
        expect(member.kind).to.equal('set');
        expect(member.static).to.equal(true);
    });

    it('should accept methods', () => {
        let member = parseAndGetClassMember('static x ( v , w ) { ; }');
        expect(member.key.type).to.equal('Identifier');
        expect(member.key.name).to.equal('x');
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params[0].type).to.deep.equal('Identifier');
        expect(member.value.params[0].name).to.deep.equal('v');
        expect(member.value.params[1].type).to.deep.equal('Identifier');
        expect(member.value.params[1].name).to.deep.equal('w');
        expect(member.kind).to.equal('method');
        expect(member.static).to.equal(true);
    });

    it('should accept methods with calculated name', () => {
        let member = parseAndGetClassMember('static [x + 1] ( v , w ) { ; }');
        expect(member.key.type).to.equal('BinaryExpression');
        expect(member.key.left.type).to.equal('Identifier');
        expect(member.key.left.name).to.equal('x');
        expect(member.key.right.type).to.equal('Literal');
        expect(member.key.right.value).to.equal(1);
        expect(member.value.type).to.equal('FunctionExpression');
        expect(member.value.params[0].type).to.deep.equal('Identifier');
        expect(member.value.params[0].name).to.deep.equal('v');
        expect(member.value.params[1].type).to.deep.equal('Identifier');
        expect(member.value.params[1].name).to.deep.equal('w');
        expect(member.kind).to.equal('method');
        expect(member.static).to.equal(true);
    });
});
