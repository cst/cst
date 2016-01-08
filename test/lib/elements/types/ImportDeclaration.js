import {parseAndGetStatement} from '../../../utils';
import Token from '../../../../src/elements/Token';
import {expect} from 'chai';

describe('ImportDeclaration', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('import "jquery";').type).to.equal('ImportDeclaration');
    });

    it('should accept import with no specifiers', () => {
        var statement = parseAndGetStatement('import "jquery";');
        expect(statement.specifiers.length).to.be.equal(0);
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('jquery');
    });

    it('should accept import with a default specifier', () => {
        var statement = parseAndGetStatement('import $ from "jquery";');
        expect(statement.type).to.equal('ImportDeclaration');
        expect(statement.specifiers[0].type).to.equal('ImportDefaultSpecifier');
        expect(statement.specifiers[0].local.type).to.equal('Identifier');
        expect(statement.specifiers[0].local.name).to.equal('$');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('jquery');
    });

    it('should accept import with a named import specifier', () => {
        var statement = parseAndGetStatement('import {$} from "jquery";');
        expect(statement.type).to.equal('ImportDeclaration');
        expect(statement.specifiers[0].type).to.equal('ImportSpecifier');
        expect(statement.specifiers[0].local.type).to.equal('Identifier');
        expect(statement.specifiers[0].local.name).to.equal('$');
        expect(statement.specifiers[0].imported.type).to.equal('Identifier');
        expect(statement.specifiers[0].imported.name).to.equal('$');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('jquery');
    });

    it('should accept import with a re-named import specifier', () => {
        var statement = parseAndGetStatement('import {$ as jQuery} from "jquery";');
        expect(statement.type).to.equal('ImportDeclaration');
        expect(statement.specifiers[0].type).to.equal('ImportSpecifier');
        expect(statement.specifiers[0].imported.type).to.equal('Identifier');
        expect(statement.specifiers[0].imported.name).to.equal('$');
        expect(statement.specifiers[0].local.type).to.equal('Identifier');
        expect(statement.specifiers[0].local.name).to.equal('jQuery');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('jquery');
    });

    it('should accept import of entire module', () => {
        var statement = parseAndGetStatement('import * as $ from "jquery";');
        expect(statement.type).to.equal('ImportDeclaration');
        expect(statement.specifiers[0].type).to.equal('ImportNamespaceSpecifier');
        expect(statement.specifiers[0].local.type).to.equal('Identifier');
        expect(statement.specifiers[0].local.name).to.equal('$');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('jquery');
    });

    it('should accept default import and name imports', () => {
        var statement = parseAndGetStatement('import $, { b,c } from "jquery";');
        expect(statement.type).to.equal('ImportDeclaration');
        expect(statement.specifiers.length).to.equal(3);
        expect(statement.specifiers[0].type).to.equal('ImportDefaultSpecifier');
        expect(statement.specifiers[0].local.type).to.equal('Identifier');
        expect(statement.specifiers[0].local.name).to.equal('$');
        expect(statement.specifiers[1].type).to.equal('ImportSpecifier');
        expect(statement.specifiers[1].local.type).to.equal('Identifier');
        expect(statement.specifiers[1].local.name).to.equal('b');
        expect(statement.specifiers[2].type).to.equal('ImportSpecifier');
        expect(statement.specifiers[2].local.type).to.equal('Identifier');
        expect(statement.specifiers[2].local.name).to.equal('c');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('jquery');
    });

    it('should accept default pattern import and name imports', () => {
        var statement = parseAndGetStatement('import { default as a } from "jquery";');
        expect(statement.type).to.equal('ImportDeclaration');
        expect(statement.specifiers.length).to.equal(1);
        expect(statement.specifiers[0].type).to.equal('ImportSpecifier');
        expect(statement.specifiers[0].local.type).to.equal('Identifier');
        expect(statement.specifiers[0].local.name).to.equal('a');
        expect(statement.specifiers[0].imported.type).to.equal('Identifier');
        expect(statement.specifiers[0].imported.name).to.equal('default');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('jquery');
    });

    it('should not accept trailing whitespace', () => {
        var statement = parseAndGetStatement('import "jquery";');
        expect(() => {
            statement.appendChild(new Token('Whitespace', '   '));
        }).to.throw('Expected end of node list but "Whitespace" found');
    });
});
