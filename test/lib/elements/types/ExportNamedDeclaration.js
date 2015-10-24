import {parseAndGetStatement} from '../../../utils';
import Token from '../../../../src/elements/Token';
import {expect} from 'chai';

describe('ExportNamedDeclaration', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('export var foo = 1;').type).to.equal('ExportNamedDeclaration');
    });

    it('should accept a VariableDeclaration', () => {
        var statement = parseAndGetStatement('export var foo = 1;');
        expect(statement.declaration.type).to.equal('VariableDeclaration');
        expect(statement.declaration.kind).to.equal('var');

        statement = parseAndGetStatement('export let foo = 1;');
        expect(statement.declaration.type).to.equal('VariableDeclaration');
        expect(statement.declaration.kind).to.equal('let');

        statement = parseAndGetStatement('export const foo = 1;');
        expect(statement.declaration.type).to.equal('VariableDeclaration');
        expect(statement.declaration.kind).to.equal('const');
    });

    it('should accept a FunctionDeclaration', () => {
        var statement = parseAndGetStatement('export function f() {};');
        expect(statement.declaration.type).to.equal('FunctionDeclaration');
    });

    it('should accept a ClassDeclaration', () => {
        var statement = parseAndGetStatement('export class C {};');
        expect(statement.declaration.type).to.equal('ClassDeclaration');
    });

    it('should accept a ModuleSpecifier without a new name', () => {
        var statement = parseAndGetStatement('export {x};');
        expect(statement.type).to.equal('ExportNamedDeclaration');
        expect(statement.specifiers.length).to.equal(1);
        expect(statement.specifiers[0].type).to.equal('ExportSpecifier');
        expect(statement.specifiers[0].local.type).to.equal('Identifier');
        expect(statement.specifiers[0].local.name).to.equal('x');
        expect(statement.specifiers[0].exported.type).to.equal('Identifier');
        expect(statement.specifiers[0].exported.name).to.equal('x');
    });

    it('should accept a ModuleSpecifier with a new name', () => {
        var statement = parseAndGetStatement('export {x as y};');
        expect(statement.type).to.equal('ExportNamedDeclaration');
        expect(statement.specifiers.length).to.equal(1);
        expect(statement.specifiers[0].type).to.equal('ExportSpecifier');
        expect(statement.specifiers[0].local.type).to.equal('Identifier');
        expect(statement.specifiers[0].local.name).to.equal('x');
        expect(statement.specifiers[0].exported.type).to.equal('Identifier');
        expect(statement.specifiers[0].exported.name).to.equal('y');
    });

    it('should accept a ModuleSpecifier without a new name from another module', () => {
        var statement = parseAndGetStatement('export {x} from "m";');
        expect(statement.type).to.equal('ExportNamedDeclaration');
        expect(statement.specifiers.length).to.equal(1);
        expect(statement.specifiers[0].type).to.equal('ExportSpecifier');
        expect(statement.specifiers[0].local.type).to.equal('Identifier');
        expect(statement.specifiers[0].local.name).to.equal('x');
        expect(statement.specifiers[0].exported.type).to.equal('Identifier');
        expect(statement.specifiers[0].exported.name).to.equal('x');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('m');
    });

    it('should accept ModuleSpecifiers with a new name from another module', () => {
        var statement = parseAndGetStatement('export {x as y, a as b} from "m";');
        expect(statement.type).to.equal('ExportNamedDeclaration');
        expect(statement.specifiers.length).to.equal(2);
        expect(statement.specifiers[0].type).to.equal('ExportSpecifier');
        expect(statement.specifiers[0].local.type).to.equal('Identifier');
        expect(statement.specifiers[0].local.name).to.equal('x');
        expect(statement.specifiers[0].exported.type).to.equal('Identifier');
        expect(statement.specifiers[0].exported.name).to.equal('y');
        expect(statement.specifiers[1].type).to.equal('ExportSpecifier');
        expect(statement.specifiers[1].local.type).to.equal('Identifier');
        expect(statement.specifiers[1].local.name).to.equal('a');
        expect(statement.specifiers[1].exported.type).to.equal('Identifier');
        expect(statement.specifiers[1].exported.name).to.equal('b');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('m');
    });

    it('should accept a default ModuleSpecifier with a new name from another module', () => {
        var statement = parseAndGetStatement('export {default as y} from "m";');
        expect(statement.type).to.equal('ExportNamedDeclaration');
        expect(statement.specifiers.length).to.equal(1);
        expect(statement.specifiers[0].type).to.equal('ExportSpecifier');
        expect(statement.specifiers[0].local.type).to.equal('Identifier');
        expect(statement.specifiers[0].local.name).to.equal('default');
        expect(statement.specifiers[0].exported.type).to.equal('Identifier');
        expect(statement.specifiers[0].exported.name).to.equal('y');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('m');
    });

    it('should accept a ExportDefaultSpecifier from another module - exportExtensions', () => {
        var statement = parseAndGetStatement('export x from "m";');
        expect(statement.type).to.equal('ExportNamedDeclaration');
        expect(statement.specifiers.length).to.equal(1);
        expect(statement.specifiers[0].type).to.equal('ExportDefaultSpecifier');
        expect(statement.specifiers[0].exported.type).to.equal('Identifier');
        expect(statement.specifiers[0].exported.name).to.equal('x');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('m');
    });

    it('should accept a ExportNamespaceSpecifier from another module - exportExtensions', () => {
        var statement = parseAndGetStatement('export * as x from "m";');
        expect(statement.type).to.equal('ExportNamedDeclaration');
        expect(statement.specifiers.length).to.equal(1);
        expect(statement.specifiers[0].type).to.equal('ExportNamespaceSpecifier');
        expect(statement.specifiers[0].exported.type).to.equal('Identifier');
        expect(statement.specifiers[0].exported.name).to.equal('x');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('m');
    });

    it('should not accept trailing whitespace', () => {
        var statement = parseAndGetStatement('export var a;');
        expect(() => {
            statement.appendChild(new Token('Whitespace', '   '));
        }).to.throw('Expected end of node list but "Whitespace" found');
    });
});
