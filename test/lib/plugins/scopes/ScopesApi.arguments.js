import {expect} from 'chai';
import ScopesPlugin from '../../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram} from '../../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()]
    });
}

describe('ScopesPlugin', () => {
    describe('arguments', () => {
        it('should process normal arguments', () => {
            let program = parse(`
                (function(a) {
                    a++;
                })
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            let param = globalScope.childScopes[0].variables[0];
            expect(param.name).to.equal('a');
            expect(param.type).to.equal('Parameter');
            expect(param.definitions[0].type).to.equal('Parameter');
            expect(param.definitions[0].node.parentElement.type).to.equal('FunctionExpression');
            expect(param.references[0].node.parentElement.type).to.equal('UpdateExpression');
            expect(param.references[0].isReadWrite).to.equal(true);
        });

        it('should process rest arguments', () => {
            let program = parse(`
                (function(a, ...b) {
                    a++;
                    b;
                })
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let paramA = globalScope.childScopes[0].variables[0];
            expect(paramA.name).to.equal('a');
            expect(paramA.type).to.equal('Parameter');
            expect(paramA.definitions[0].type).to.equal('Parameter');
            expect(paramA.definitions[0].node.parentElement.type).to.equal('FunctionExpression');
            expect(paramA.references[0].node.parentElement.type).to.equal('UpdateExpression');
            expect(paramA.references[0].isReadWrite).to.equal(true);

            let paramB = globalScope.childScopes[0].variables[1];

            expect(paramB.name).to.equal('b');
            expect(paramB.type).to.equal('Parameter');
            expect(paramB.definitions[0].type).to.equal('Parameter');
            expect(paramB.definitions[0].node.parentElement.type).to.equal('RestElement');
            expect(paramB.references[0].node.parentElement.type).to.equal('ExpressionStatement');
            expect(paramB.references[0].isReadOnly).to.equal(true);
        });

        it('should process patterns', () => {
            let program = parse(`
                (function({a}, [b]) {
                    a++;
                    b;
                })
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let paramA = globalScope.childScopes[0].variables[1];

            expect(paramA.name).to.equal('a');
            expect(paramA.type).to.equal('Parameter');
            expect(paramA.definitions[0].type).to.equal('Parameter');
            expect(paramA.definitions[0].node.parentElement.type).to.equal('ObjectProperty');
            expect(paramA.references[0].node.parentElement.type).to.equal('UpdateExpression');
            expect(paramA.references[0].isReadWrite).to.equal(true);

            let paramB = globalScope.childScopes[0].variables[0];

            expect(paramB.name).to.equal('b');
            expect(paramB.type).to.equal('Parameter');
            expect(paramB.definitions[0].type).to.equal('Parameter');
            expect(paramB.definitions[0].node.parentElement.type).to.equal('ArrayPattern');
            expect(paramB.references[0].node.parentElement.type).to.equal('ExpressionStatement');
            expect(paramB.references[0].isReadOnly).to.equal(true);
        });

        it('should process non-shortcut patterns', () => {
            let program = parse(`
                (function({name: a}, [[b]]) {
                    a++;
                    b;
                })
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let paramA = globalScope.childScopes[0].variables[0];

            expect(paramA.name).to.equal('a');
            expect(paramA.type).to.equal('Parameter');
            expect(paramA.definitions[0].type).to.equal('Parameter');
            expect(paramA.definitions[0].node.parentElement.type).to.equal('ObjectProperty');
            expect(paramA.references[0].node.parentElement.type).to.equal('UpdateExpression');
            expect(paramA.references[0].isReadWrite).to.equal(true);

            let paramB = globalScope.childScopes[0].variables[1];

            expect(paramB.name).to.equal('b');
            expect(paramB.type).to.equal('Parameter');
            expect(paramB.definitions[0].type).to.equal('Parameter');
            expect(paramB.definitions[0].node.parentElement.type).to.equal('ArrayPattern');
            expect(paramB.references[0].node.parentElement.type).to.equal('ExpressionStatement');
            expect(paramB.references[0].isReadOnly).to.equal(true);
        });

        it('should process nested patterns', () => {
            let program = parse(`
                (function({name: {title: a}}, [[b]]) {
                    a++;
                    b;
                })
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let paramA = globalScope.childScopes[0].variables[1];

            expect(paramA.name).to.equal('a');
            expect(paramA.type).to.equal('Parameter');
            expect(paramA.definitions[0].type).to.equal('Parameter');
            expect(paramA.definitions[0].node.parentElement.type).to.equal('ObjectProperty');
            expect(paramA.references[0].node.parentElement.type).to.equal('UpdateExpression');
            expect(paramA.references[0].isReadWrite).to.equal(true);

            let paramB = globalScope.childScopes[0].variables[0];

            expect(paramB.name).to.equal('b');
            expect(paramB.type).to.equal('Parameter');
            expect(paramB.definitions[0].type).to.equal('Parameter');
            expect(paramB.definitions[0].node.parentElement.type).to.equal('ArrayPattern');
            expect(paramB.references[0].node.parentElement.type).to.equal('ExpressionStatement');
            expect(paramB.references[0].isReadOnly).to.equal(true);
        });

        it('should process arguments built-in', () => {
            let program = parse(`
                (function() {
                    arguments;
                })
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            let param = globalScope.childScopes[0].variables[0];
            expect(param.name).to.equal('arguments');
            expect(param.type).to.equal('BuiltIn');
            expect(param.definitions.length).to.equal(0);
            expect(param.references[0].node.parentElement.type).to.equal('ExpressionStatement');
            expect(param.references[0].isReadOnly).to.equal(true);
        });

        it('should process this built-in', () => {
            let program = parse(`
                (function() {
                    this;
                })
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            let param = globalScope.childScopes[0].variables[0];
            expect(param.name).to.equal('this');
            expect(param.type).to.equal('BuiltIn');
            expect(param.definitions.length).to.equal(0);
            expect(param.references[0].node.parentElement.type).to.equal('ExpressionStatement');
            expect(param.references[0].isReadOnly).to.equal(true);
        });

        it('should treat arguments in program as global', () => {
            let program = parse(`
                arguments;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.variables.length).to.equal(1);
            expect(globalScope.variables[0].name).to.equal('arguments');
            expect(globalScope.variables[0].type).to.equal('ImplicitGlobal');
            expect(globalScope.variables[0].references[0].node.parentElement.type).to.equal('ExpressionStatement');
            expect(globalScope.variables[0].references[0].isReadOnly).to.equal(true);
        });

        it('should treat this in program as global', () => {
            let program = parse(`
                this;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.variables.length).to.equal(1);
            expect(globalScope.variables[0].name).to.equal('this');
            expect(globalScope.variables[0].type).to.equal('ImplicitGlobal');
            expect(globalScope.variables[0].references[0].node.parentElement.type).to.equal('ExpressionStatement');
            expect(globalScope.variables[0].references[0].isReadOnly).to.equal(true);
        });
    });
});
