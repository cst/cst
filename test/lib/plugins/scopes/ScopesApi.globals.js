import {expect} from 'chai';
import ScopesPlugin from '../../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram} from '../../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()]
    });
}

describe('ScopesPlugin', () => {
    describe('globals', () => {
        it('should support read reference', () => {
            let program = parse(`
                x;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('x');
            expect(variableA.type).to.equal('ImplicitGlobal');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('ExpressionStatement');
            expect(variableA.getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should support write reference', () => {
            let program = parse(`
                x = 1;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('x');
            expect(variableA.type).to.equal('ImplicitGlobal');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('AssignmentExpression');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support increment reference', () => {
            let program = parse(`
                x++;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('x');
            expect(variableA.type).to.equal('ImplicitGlobal');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('UpdateExpression');
            expect(variableA.getReferences()[0].isReadWrite()).to.equal(true);
        });

        it('should support read reference in nested scope', () => {
            let program = parse(`
                (function() {
                    x;
                })
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('x');
            expect(variableA.type).to.equal('ImplicitGlobal');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('ExpressionStatement');
            expect(variableA.getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should support write reference in nested scope', () => {
            let program = parse(`
                (function() {
                    x = 1;
                })
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('x');
            expect(variableA.type).to.equal('ImplicitGlobal');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('AssignmentExpression');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support increment reference in nested scope', () => {
            let program = parse(`
                (function() {
                    x++;
                })
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('x');
            expect(variableA.type).to.equal('ImplicitGlobal');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('UpdateExpression');
            expect(variableA.getReferences()[0].isReadWrite()).to.equal(true);
        });
    });
});
