import {expect} from 'chai';
import ScopesPlugin from '../../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram} from '../../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()],
    });
}

describe('ScopesPlugin', () => {
    describe('blocks', () => {
        it('should support custom block', () => {
            let program = parse(`
                let a = 1;
                {
                    let a = 2;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getReferences()[0].node.parentElement.init.value).to.equal(2);
        });

        it('should support function declaration block scope (ES6 behaviour)', () => {
            let program = parse(`
                {
                    function test() {}
                    test();
                }
                test();
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableTestGlobal = globalScope.getVariables()[0];
            expect(variableTestGlobal.name).to.equal('test');
            expect(variableTestGlobal.type).to.equal('ImplicitGlobal');
            expect(variableTestGlobal.getReferences()[0].node.parentElement.type).to.equal('CallExpression');

            let variableTest = globalScope.childScopes[0].getVariables()[0];
            expect(variableTest.name).to.equal('test');
            expect(variableTest.type).to.equal('LetVariable');
            expect(variableTest.getReferences()[0].node.parentElement.type).to.equal('FunctionDeclaration');
            expect(variableTest.getReferences()[1].node.parentElement.type).to.equal('CallExpression');
        });

        it('should support if block', () => {
            let program = parse(`
                let a = 1;
                if (true) {
                    let a = 2;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getReferences()[0].node.parentElement.init.value).to.equal(2);
        });

        it('should support switch block', () => {
            let program = parse(`
                var a = 1;
                switch (true) {
                    case true:
                        let a = 2;
                        a = 3;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('Variable');
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getReferences()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[1].node.parentElement.right.value).to.equal(3);
        });

        it('should support for block', () => {
            let program = parse(`
                let a = 1;
                for (let a = 2;;) {
                    let a = 3;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getDefinitions()[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.getReferences()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[1].node.parentElement.init.value).to.equal(3);
        });

        it('should support for-in block', () => {
            let program = parse(`
                let a = 1;
                for (let a in 2) {
                    let a = 3;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].node.parentElement.parentElement.parentElement.right.value)
                .to.equal(2);
            expect(variableA2.getDefinitions()[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.getReferences()[0].node.parentElement.parentElement.parentElement.right.value)
                .to.equal(2);
            expect(variableA2.getReferences()[0].isWriteOnly()).to.equal(true);
            expect(variableA2.getReferences()[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.getReferences()[1].isWriteOnly()).to.equal(true);
        });

        it('should support global references in for-in block', () => {
            let program = parse(`
                for (a in 2);
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('ImplicitGlobal');
            expect(variableA1.getDefinitions().length).to.equal(0);
            expect(variableA1.getReferences()[0].node.parentElement.type).to.equal('ForInStatement');
        });

        it('should support patterns in for-in block', () => {
            let program = parse(`
                let a = 1;
                for (let [a] in 2) {
                    let a = 3;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.getReferences()[0].isWriteOnly()).to.equal(true);
            expect(variableA2.getReferences()[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.getReferences()[1].isWriteOnly()).to.equal(true);
        });

        it('should support for-of block', () => {
            let program = parse(`
                let a = 1;
                for (let a of 2) {
                    let a = 3;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].node.parentElement.parentElement.parentElement.right.value)
                .to.equal(2);
            expect(variableA2.getDefinitions()[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.getReferences()[0].node.parentElement.parentElement.parentElement.right.value)
                .to.equal(2);
            expect(variableA2.getReferences()[0].isWriteOnly()).to.equal(true);
            expect(variableA2.getReferences()[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.getReferences()[1].isWriteOnly()).to.equal(true);
        });

        it('should support global references in for-of block', () => {
            let program = parse(`
                for (a of 2);
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('ImplicitGlobal');
            expect(variableA1.getDefinitions().length).to.equal(0);
            expect(variableA1.getReferences()[0].node.parentElement.type).to.equal('ForOfStatement');
        });

        it('should support patterns in for-of block', () => {
            let program = parse(`
                let a = 1;
                for (let [a] of 2) {
                    let a = 3;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.getReferences()[0].isWriteOnly()).to.equal(true);
            expect(variableA2.getReferences()[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.getReferences()[1].isWriteOnly()).to.equal(true);
        });

        it('should support try-catch block', () => {
            let program = parse(`
                var a = 1;
                try {
                    let a = 2;
                } catch (a) {
                    a = 3;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('Variable');
            expect(variableA1.getDefinitions()[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getDefinitions()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[0].isWriteOnly()).to.equal(true);

            let variableA3 = globalScope.childScopes[1].getVariables()[0];
            expect(variableA3.name).to.equal('a');
            expect(variableA3.type).to.equal('CatchClauseError');
            expect(variableA3.getDefinitions()[0].node.parentElement.type).to.equal('CatchClause');
            expect(variableA3.getReferences()[0].node.parentElement.right.value).to.equal(3);
            expect(variableA3.getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should support patterns try-catch block', () => {
            let program = parse(`
                try {
                } catch ({ a, b, c, d }) {
                    let e = 20;
                    a;
                    b;
                    let c = 30;
                    c;
                    d;
                }
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            expect(globalScope.getVariables().length).to.equal(0);

            let variableA = globalScope.childScopes[1].getVariables()[0];
            expect(variableA.name).to.equal('a');
            expect(variableA.type).to.equal('CatchClauseError');
            expect(variableA.getDefinitions()[0].node.parentElement.type).to.equal('ObjectProperty');
            expect(variableA.getReferences()[0].node.parentElement.type).to.equal('ExpressionStatement');

            let variableB = globalScope.childScopes[1].getVariables()[1];
            expect(variableB.name).to.equal('b');
            expect(variableB.type).to.equal('CatchClauseError');
            expect(variableB.getDefinitions()[0].node.parentElement.type).to.equal('ObjectProperty');
            expect(variableB.getReferences()[0].node.parentElement.type).to.equal('ExpressionStatement');

            let variableC1 = globalScope.childScopes[1].getVariables()[2];
            expect(variableC1.name).to.equal('c');
            expect(variableC1.type).to.equal('LetVariable');
            expect(variableC1.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableC1.getReferences()[0].node.parentElement.type).to.equal('ExpressionStatement');

            let variableC2 = globalScope.childScopes[1].getVariables()[3];
            expect(variableC2.name).to.equal('c');
            expect(variableC2.type).to.equal('CatchClauseError');
            expect(variableC2.getDefinitions()[0].node.parentElement.type).to.equal('ObjectProperty');

            let variableD = globalScope.childScopes[1].getVariables()[4];
            expect(variableD.name).to.equal('d');
            expect(variableD.type).to.equal('CatchClauseError');
            expect(variableD.getDefinitions()[0].node.parentElement.type).to.equal('ObjectProperty');
            expect(variableD.getReferences()[0].node.parentElement.type).to.equal('ExpressionStatement');

            let variableE = globalScope.childScopes[1].getVariables()[5];
            expect(variableE.name).to.equal('e');
            expect(variableE.type).to.equal('LetVariable');
            expect(variableE.getDefinitions()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(variableE.getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
        });

        it('should support arrow function expression block', () => {
            let program = parse(`
                var a = 1;
                (() => {
                    let a = 2;
                    a = 3;
                })();
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('Variable');
            expect(variableA1.getReferences().length).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getReferences()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[1].node.parentElement.right.value).to.equal(3);
        });

        it('should support function expression block', () => {
            let program = parse(`
                var a = 1;
                (function() {
                    let a = 2;
                    a = 3;
                })();
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('Variable');
            expect(variableA1.getReferences().length).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].getVariables()[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getReferences()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[1].node.parentElement.right.value).to.equal(3);
        });

        it('should support named function expression block', () => {
            let program = parse(`
                var a = 1;
                (function f() {
                    let a = 2;
                    a = 3;
                    f();
                })();
            `);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('Variable');
            expect(variableA1.getReferences().length).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableF = globalScope.childScopes[0].getVariables()[0];
            expect(variableF.name).to.equal('f');
            expect(variableF.type).to.equal('SelfReference');
            expect(variableF.getDefinitions()[0].node.parentElement.type).to.equal('FunctionExpression');
            expect(variableF.getReferences()[0].node.parentElement.type).to.equal('FunctionExpression');
            expect(variableF.getReferences()[1].node.parentElement.type).to.equal('CallExpression');

            let variableA2 = globalScope.childScopes[0].getVariables()[1];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getReferences()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[1].node.parentElement.right.value).to.equal(3);
        });

        it('should support arrow function expression block', () => {
            let program = parse(`
                function func() {
                    var a = 1;
                    ((z) => {
                        let a = 2;
                        a = 3;
                        arguments;
                        this;
                    })();
                }
            `);

            let functionScope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(functionScope.getVariables().length).to.equal(3);

            let variableA1 = functionScope.getVariables()[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('Variable');
            expect(variableA1.getReferences().length).to.equal(1);
            expect(variableA1.getReferences()[0].node.parentElement.init.value).to.equal(1);

            let variableArgs = functionScope.getVariables()[1];
            expect(variableArgs.name).to.equal('arguments');
            expect(variableArgs.type).to.equal('BuiltIn');
            expect(variableArgs.getReferences().length).to.equal(1);
            expect(variableArgs.getReferences()[0].node.parentElement.type).to.equal('ExpressionStatement');

            let variableThis = functionScope.getVariables()[2];
            expect(variableThis.name).to.equal('this');
            expect(variableThis.type).to.equal('BuiltIn');
            expect(variableThis.getReferences().length).to.equal(1);
            expect(variableThis.getReferences()[0].node.parentElement.type).to.equal('ExpressionStatement');

            let arrowFunctionScope = functionScope.childScopes[0];
            let variableZ = arrowFunctionScope.getVariables()[0];
            expect(variableZ.name).to.equal('z');
            expect(variableZ.type).to.equal('Parameter');
            expect(variableZ.getDefinitions()[0].node.parentElement.type).to.equal('ArrowFunctionExpression');

            let variableA2 = arrowFunctionScope.getVariables()[1];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.getReferences()[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.getReferences()[1].node.parentElement.right.value).to.equal(3);
        });
    });
});
