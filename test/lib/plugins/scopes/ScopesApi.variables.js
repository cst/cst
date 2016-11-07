import {expect} from 'chai';
import ScopesPlugin from '../../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram} from '../../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()],
    });
}

describe('ScopesPlugin', () => {
    describe('variable', () => {
        it('should support var', () => {
            let program = parse(`
                var a;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences().length).to.equal(0);
        });

        it('should support reference-first', () => {
            let program = parse(`
                a;
                var a;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('ExpressionStatement');
            expect(variableA.getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should support var with init', () => {
            let program = parse(`
                var a = 1;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should merge multiple vars', () => {
            let program = parse(`
                var a = 1;
                var a = 2;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA.getDefinitions()[1].type).to.equal('Variable');
            expect(variableA.getDefinitions()[1].node.parentElement.init.value).to.equal(2);
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should merge multiple vars in sub block scopes', () => {
            let program = parse(`
                var a = 1;
                if (true) {
                    if (true) {
                        var a = 2;
                    }
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA.getDefinitions()[1].type).to.equal('Variable');
            expect(variableA.getDefinitions()[1].node.parentElement.init.value).to.equal(2);
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support var patterns', () => {
            let program = parse(`
                var {a, b} = 1;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].node.parentElement.parentElement.parentElement.init.value).to.equal(1);
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
            let variableB = globalScope.getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('Variable');
            expect(variableB.getDefinitions()[0].type).to.equal('Variable');
            expect(variableB.getDefinitions()[0].node.parentElement.parentElement.parentElement.init.value).to.equal(1);
            expect(variableB.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support nested var patterns', () => {
            let program = parse(`
                var {prop1: {a}, prop2: {b}} = 1;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].type).to.equal('Variable');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
            let variableB = globalScope.getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('Variable');
            expect(variableB.getDefinitions()[0].type).to.equal('Variable');
            expect(variableB.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support multiple var', () => {
            let program = parse(`
                var a, b;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);

            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences().length).to.equal(0);

            let variableB = globalScope.getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('Variable');
            expect(variableB.getDefinitions()[0].type).to.equal('Variable');
            expect(variableB.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableB.getReferences().length).to.equal(0);
        });

        it('should support multiple var with init', () => {
            let program = parse(`
                var a = 1, b = 2;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);

            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].type).to.equal('Variable');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);

            let variableB = globalScope.getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('Variable');
            expect(variableB.getDefinitions()[0].type).to.equal('Variable');
            expect(variableB.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableB.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableB.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support let', () => {
            let program = parse(`
                let a;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences().length).to.equal(0);
        });

        it('should support let with init', () => {
            let program = parse(`
                let a = 1;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should merge multiple lets', () => {
            let program = parse(`
                let a = 1;
                let a = 2;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA.getDefinitions()[1].type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[1].node.parentElement.init.value).to.equal(2);
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support referencing in nested blocks', () => {
            let program = parse(`
                let a = 1;
                if (true) {
                    a++;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
            expect(variableA.getReferences()[1].node.parentElement.type).to.equal('UpdateExpression');
            expect(variableA.getReferences()[1].isReadWrite()).to.equal(true);
        });

        it('should support let-let definitions in nested blocks', () => {
            let program = parse(`
                let a = 1;
                if (true) {
                    let a = 2;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA1.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA1.getReferences()[0].isWriteOnly()).to.equal(true);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA2.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support var-let definitions in nested blocks', () => {
            let program = parse(`
                var a = 1;
                if (true) {
                    let a = 2;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('Variable');
            expect(variableA1.getDefinitions()[0].type).to.equal('Variable');
            expect(variableA1.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA1.getReferences()[0].isWriteOnly()).to.equal(true);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA2.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support const-let definitions in nested blocks', () => {
            let program = parse(`
                const a = 1;
                if (true) {
                    let a = 2;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('Constant');
            expect(variableA1.getDefinitions()[0].type).to.equal('Constant');
            expect(variableA1.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA1.getReferences()[0].isWriteOnly()).to.equal(true);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA2.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support let-const definitions in nested blocks', () => {
            let program = parse(`
                let a = 1;
                if (true) {
                    const a = 2;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA1.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA1.getReferences()[0].isWriteOnly()).to.equal(true);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('Constant');
            expect(variableA2.getDefinitions()[0].type).to.equal('Constant');
            expect(variableA2.getDefinitions()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA2.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support multiple let', () => {
            let program = parse(`
                let a, b;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);

            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences().length).to.equal(0);

            let variableB = globalScope.getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('LetVariable');
            expect(variableB.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableB.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableB.getReferences().length).to.equal(0);
        });

        it('should support multiple let with init', () => {
            let program = parse(`
                let a = 1, b = 2;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);

            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);

            let variableB = globalScope.getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('LetVariable');
            expect(variableB.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableB.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableB.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableB.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support let patterns', () => {
            let program = parse(`
                let {a, b} = 1;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].node.parentElement.parentElement.parentElement.init.value).to.equal(1);
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
            let variableB = globalScope.getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('LetVariable');
            expect(variableB.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableB.getDefinitions()[0].node.parentElement.parentElement.parentElement.init.value).to.equal(1);
            expect(variableB.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support nested let patterns', () => {
            let program = parse(`
                let {prop1: {a}, prop2: {b}} = 1;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('LetVariable');
            expect(variableA.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
            let variableB = globalScope.getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('LetVariable');
            expect(variableB.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableB.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support const', () => {
            let program = parse(`
                const a = 1;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Constant');
            expect(variableA.getDefinitions()[0].type).to.equal('Constant');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support multiple const', () => {
            let program = parse(`
                const a = 1, b = 2;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);

            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Constant');
            expect(variableA.getDefinitions()[0].type).to.equal('Constant');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);

            let variableB = globalScope.getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('Constant');
            expect(variableB.getDefinitions()[0].type).to.equal('Constant');
            expect(variableB.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableB.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableB.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support const patterns', () => {
            let program = parse(`
                const {a, b} = 1;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Constant');
            expect(variableA.getDefinitions()[0].type).to.equal('Constant');
            expect(variableA.getDefinitions()[0].node.parentElement.parentElement.parentElement.init.value).to.equal(1);
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
            let variableB = globalScope.getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('Constant');
            expect(variableB.getDefinitions()[0].type).to.equal('Constant');
            expect(variableB.getDefinitions()[0].node.parentElement.parentElement.parentElement.init.value).to.equal(1);
            expect(variableB.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support nested let patterns', () => {
            let program = parse(`
                const {prop1: {a}, prop2: {b}} = 1;
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);
            let variableA = globalScope.getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('Constant');
            expect(variableA.getDefinitions()[0].type).to.equal('Constant');
            expect(variableA.getReferences()[0].isWriteOnly()).to.equal(true);
            let variableB = globalScope.getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('Constant');
            expect(variableB.getDefinitions()[0].type).to.equal('Constant');
            expect(variableB.getReferences()[0].isWriteOnly()).to.equal(true);
        });
    });
});
