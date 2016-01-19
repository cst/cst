import {expect} from 'chai';
import Fragment from '../../../../src/elements/Fragment';
import Token from '../../../../src/elements/Token';
import Identifier from '../../../../src/elements/types/Identifier';
import ScopesPlugin from '../../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram, parseAndGetStatement, parseAndGetExpression} from '../../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()]
    });
}

describe('ScopesPlugin', () => {
    describe('references', () => {
        it('should include single reference', () => {
            let program = parse(`
                a;
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
        });

        it('should ignore object keys', () => {
            let program = parse(`
                ({
                    a: 1,
                    b: 2
                })
            `);
            expect(program.plugins.scopes.acquire(program).variables.length).to.equal(0);
        });

        it('should not ignore object shortcuts', () => {
            let program = parse(`
                ({
                    a,
                    b: 2
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
            expect(scope.variables[0].references[0].node.parentElement.type).to.equal('Property');
        });

        it('should not ignore computed object keys', () => {
            let program = parse(`
                ({
                    [a]: 1,
                    b: 2
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
            expect(scope.variables[0].references[0].node.parentElement.type).to.equal('Property');
        });

        it('should not ignore object property values', () => {
            let program = parse(`
                ({
                    a: a,
                    b: 2
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
            expect(scope.variables[0].references[0].node.parentElement.type).to.equal('Property');
        });

        it('should ignore getter/setter identifiers', () => {
            let program = parse(`
                ({
                    get a() {},
                    set b(val) {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(0);
        });

        it('should not ignore getter/setter computed names', () => {
            let program = parse(`
                ({
                    get [a]() {},
                    set [b](val) {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(2);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
            expect(scope.variables[1].name).to.equal('b');
            expect(scope.variables[1].type).to.equal('ImplicitGlobal');
            expect(scope.variables[1].references[0].isReadOnly).to.equal(true);
        });

        it('should ignore method identifiers', () => {
            let program = parse(`
                ({
                    a() {},
                    b(val) {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(0);
        });

        it('should not ignore method computed names', () => {
            let program = parse(`
                ({
                    [a]() {},
                    [b](val) {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(2);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
            expect(scope.variables[1].name).to.equal('b');
            expect(scope.variables[1].type).to.equal('ImplicitGlobal');
            expect(scope.variables[1].references[0].isReadOnly).to.equal(true);
        });

        it('should ignore member access', () => {
            let program = parse(`
                ({}).a;
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(0);
        });

        it('should not ignore computed member access', () => {
            let program = parse(`
                ({})[a];
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
        });

        it('should include template string tag', () => {
            let program = parse(
                '(tag`hello`)'
            );
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('tag');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
        });

        it('should resolve template string tag', () => {
            let program = parse([
                'let tag;',
                '(tag`hello`)'
            ]);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('tag');
            expect(scope.variables[0].type).to.equal('LetVariable');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
        });

        it('should include call expression', () => {
            let program = parse(`
                a();
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
        });

        it('should include variable declaration inits', () => {
            let program = parse(`
                (() => {
                    var h = a;
                });
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
        });

        it('should ignore labels', () => {
            let program = parse(`
                label: for (;;) {
                    break label;
                    continue label;
                }
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(0);
        });

        it('should include default parameter value', () => {
            let program = parse(`
                ((a = 1) => {})
            `);
            let scope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('Parameter');
            expect(scope.variables[0].definitions[0].type).to.equal('Parameter');
            expect(scope.variables[0].references[0].isWriteOnly).to.equal(true);
        });

        it('should include default pattern parameter value', () => {
            let program = parse(`
                (({a} = 1) => {})
            `);
            let scope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('Parameter');
            expect(scope.variables[0].definitions[0].type).to.equal('Parameter');
            expect(scope.variables[0].references[0].isWriteOnly).to.equal(true);
        });

        it('should handle default value correctly', () => {
            let program = parse(`
                ((a = b) => {})
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.variables.length).to.equal(1);
            expect(globalScope.variables[0].name).to.equal('b');
            expect(globalScope.variables[0].type).to.equal('ImplicitGlobal');
            let scope = globalScope.childScopes[0];
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('Parameter');
            expect(scope.variables[0].definitions[0].type).to.equal('Parameter');
            expect(scope.variables[0].references[0].isWriteOnly).to.equal(true);
        });

        it('should handle array patterns in assignments', () => {
            let program = parse(`
                ([a, b.c] = []);
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.variables.length).to.equal(2);
            expect(globalScope.variables[0].name).to.equal('a');
            expect(globalScope.variables[0].type).to.equal('ImplicitGlobal');
            expect(globalScope.variables[0].references.length).to.equal(1);
            expect(globalScope.variables[0].references[0].isWriteOnly).to.equal(true);
            expect(globalScope.variables[1].name).to.equal('b');
            expect(globalScope.variables[1].type).to.equal('ImplicitGlobal');
            expect(globalScope.variables[1].references.length).to.equal(1);
            expect(globalScope.variables[1].references[0].isReadOnly).to.equal(true);
        });

        it('should handle nested array patterns in assignments', () => {
            let program = parse(`
                ([[a, ...b.c]] = []);
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.variables.length).to.equal(2);
            expect(globalScope.variables[0].name).to.equal('a');
            expect(globalScope.variables[0].type).to.equal('ImplicitGlobal');
            expect(globalScope.variables[0].references.length).to.equal(1);
            expect(globalScope.variables[0].references[0].isWriteOnly).to.equal(true);
            expect(globalScope.variables[1].name).to.equal('b');
            expect(globalScope.variables[1].type).to.equal('ImplicitGlobal');
            expect(globalScope.variables[1].references.length).to.equal(1);
            expect(globalScope.variables[1].references[0].isReadOnly).to.equal(true);
        });

        it('should handle object patterns in assignments', () => {
            let program = parse(`
                ({a, b} = []);
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.variables.length).to.equal(2);
            expect(globalScope.variables[0].name).to.equal('a');
            expect(globalScope.variables[0].type).to.equal('ImplicitGlobal');
            expect(globalScope.variables[0].references.length).to.equal(1);
            expect(globalScope.variables[0].references[0].isWriteOnly).to.equal(true);
            expect(globalScope.variables[1].name).to.equal('b');
            expect(globalScope.variables[1].type).to.equal('ImplicitGlobal');
            expect(globalScope.variables[1].references.length).to.equal(1);
            expect(globalScope.variables[1].references[0].isWriteOnly).to.equal(true);
        });

        it('should handle default values collision properly', () => {
            let program = parse(`
                ((a = 1) => {
                    let a = 2;
                });
            `);
            let scope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(scope.variables.length).to.equal(2);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('LetVariable');
            expect(scope.variables[0].references.length).to.equal(1);
            expect(scope.variables[0].references[0].isWriteOnly).to.equal(true);
            expect(scope.variables[0].references[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(scope.variables[1].name).to.equal('a');
            expect(scope.variables[1].type).to.equal('Parameter');
            expect(scope.variables[1].references.length).to.equal(1);
            expect(scope.variables[1].references[0].isWriteOnly).to.equal(true);
            expect(scope.variables[1].references[0].node.parentElement.type).to.equal('AssignmentPattern');

            expect(program.plugins.scopes.findVariable(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.variables[0]);
            expect(program.plugins.scopes.findReference(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.variables[0].references[0]);
            expect(program.plugins.scopes.findDefinition(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.variables[1].definitions[0]);
            expect(program.plugins.scopes.findVariable(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.variables[1]);
            expect(program.plugins.scopes.findReference(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.variables[1].references[0]);
            expect(program.plugins.scopes.findDefinition(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.variables[0].definitions[0]);
        });

        it('should handle self-reference collision properly', () => {
            let program = parse(`
                (function a() {
                    let a = 2;
                });
            `);
            let scope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(scope.variables.length).to.equal(2);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('LetVariable');
            expect(scope.variables[0].references.length).to.equal(1);
            expect(scope.variables[0].references[0].isWriteOnly).to.equal(true);
            expect(scope.variables[0].references[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(scope.variables[1].name).to.equal('a');
            expect(scope.variables[1].type).to.equal('SelfReference');
            expect(scope.variables[1].references.length).to.equal(1);
            expect(scope.variables[1].references[0].isWriteOnly).to.equal(true);
            expect(scope.variables[1].references[0].node.parentElement.type).to.equal('FunctionExpression');

            expect(program.plugins.scopes.findVariable(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.variables[0]);
            expect(program.plugins.scopes.findReference(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.variables[0].references[0]);
            expect(program.plugins.scopes.findDefinition(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.variables[1].definitions[0]);
            expect(program.plugins.scopes.findVariable(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.variables[1]);
            expect(program.plugins.scopes.findReference(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.variables[1].references[0]);
            expect(program.plugins.scopes.findDefinition(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.variables[0].definitions[0]);
        });
    });
});
