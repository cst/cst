import {expect} from 'chai';
import ScopesPlugin from '../../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram} from '../../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()]
    });
}

describe('ScopesPlugin', () => {
    describe('references', () => {
        it('should not throw for non-existent variable', () => {
            // Minimally reproducable test-case
            let program = parse(`
                function _disableRulesAt(rules, line) {
                    for (var i = 0; i < rules.length; i++) {
                        continue;
                    }
                };

                function iterateTokensByType(type, cb) {
                    while (Array.isArray(type)) {
                        items = this._program.selectTokensByType(type[i]);
                    }
                };
            `);

            expect(
                () => program.plugins.scopes.acquire(program)
            ).to.not.throw();
        });

        it('should include single reference', () => {
            let program = parse(`
                a;
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should ignore object keys', () => {
            let program = parse(`
                ({
                    a: 1,
                    b: 2
                })
            `);
            expect(program.plugins.scopes.acquire(program).getVariables().length).to.equal(0);
        });

        it('should not ignore object shortcuts', () => {
            let program = parse(`
                ({
                    a,
                    b: 2
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
            expect(scope.getVariables()[0].getReferences()[0].node.parentElement.type).to.equal('ObjectProperty');
        });

        it('should not ignore computed object keys', () => {
            let program = parse(`
                ({
                    [a]: 1,
                    b: 2
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
            expect(scope.getVariables()[0].getReferences()[0].node.parentElement.type).to.equal('ObjectProperty');
        });

        it('should not ignore object property values', () => {
            let program = parse(`
                ({
                    a: a,
                    b: 2
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
            expect(scope.getVariables()[0].getReferences()[0].node.parentElement.type).to.equal('ObjectProperty');
        });

        it('should ignore getter/setter identifiers', () => {
            let program = parse(`
                ({
                    get a() {},
                    set b(val) {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(0);
        });

        it('should not ignore getter/setter computed names', () => {
            let program = parse(`
                ({
                    get [a]() {},
                    set [b](val) {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(2);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
            expect(scope.getVariables()[1].name).to.equal('b');
            expect(scope.getVariables()[1].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[1].getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should ignore method identifiers', () => {
            let program = parse(`
                ({
                    a() {},
                    b(val) {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(0);
        });

        it('should not ignore method computed names', () => {
            let program = parse(`
                ({
                    [a]() {},
                    [b](val) {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(2);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
            expect(scope.getVariables()[1].name).to.equal('b');
            expect(scope.getVariables()[1].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[1].getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should ignore member access', () => {
            let program = parse(`
                ({}).a;
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(0);
        });

        it('should not ignore computed member access', () => {
            let program = parse(`
                ({})[a];
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should include template string tag', () => {
            let program = parse(
                '(tag`hello`)'
            );
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('tag');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should resolve template string tag', () => {
            let program = parse([
                'let tag;',
                '(tag`hello`)'
            ]);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('tag');
            expect(scope.getVariables()[0].type).to.equal('LetVariable');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should include call expression', () => {
            let program = parse(`
                a();
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should include variable declaration inits', () => {
            let program = parse(`
                (() => {
                    var h = a;
                });
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should ignore labels', () => {
            let program = parse(`
                label: for (;;) {
                    break label;
                    continue label;
                }
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(0);
        });

        it('should include default parameter value', () => {
            let program = parse(`
                ((a = 1) => {})
            `);
            let scope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('Parameter');
            expect(scope.getVariables()[0].getDefinitions()[0].type).to.equal('Parameter');
            expect(scope.getVariables()[0].getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should include default pattern parameter value', () => {
            let program = parse(`
                (({a} = 1) => {})
            `);
            let scope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('Parameter');
            expect(scope.getVariables()[0].getDefinitions()[0].type).to.equal('Parameter');
            expect(scope.getVariables()[0].getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should handle default value correctly', () => {
            let program = parse(`
                ((a = b) => {})
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(1);
            expect(globalScope.getVariables()[0].name).to.equal('b');
            expect(globalScope.getVariables()[0].type).to.equal('ImplicitGlobal');
            let scope = globalScope.childScopes[0];
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('Parameter');
            expect(scope.getVariables()[0].getDefinitions()[0].type).to.equal('Parameter');
            expect(scope.getVariables()[0].getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should handle array patterns in assignments', () => {
            let program = parse(`
                ([a, b.c] = []);
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);
            expect(globalScope.getVariables()[0].name).to.equal('a');
            expect(globalScope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(globalScope.getVariables()[0].getReferences().length).to.equal(1);
            expect(globalScope.getVariables()[0].getReferences()[0].isWriteOnly()).to.equal(true);
            expect(globalScope.getVariables()[1].name).to.equal('b');
            expect(globalScope.getVariables()[1].type).to.equal('ImplicitGlobal');
            expect(globalScope.getVariables()[1].getReferences().length).to.equal(1);
            expect(globalScope.getVariables()[1].getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should handle nested array patterns in assignments', () => {
            let program = parse(`
                ([[a, ...b.c]] = []);
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);
            expect(globalScope.getVariables()[0].name).to.equal('a');
            expect(globalScope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(globalScope.getVariables()[0].getReferences().length).to.equal(1);
            expect(globalScope.getVariables()[0].getReferences()[0].isWriteOnly()).to.equal(true);
            expect(globalScope.getVariables()[1].name).to.equal('b');
            expect(globalScope.getVariables()[1].type).to.equal('ImplicitGlobal');
            expect(globalScope.getVariables()[1].getReferences().length).to.equal(1);
            expect(globalScope.getVariables()[1].getReferences()[0].isReadOnly()).to.equal(true);
        });

        it('should handle object patterns in assignments', () => {
            let program = parse(`
                ({a, b} = []);
            `);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.getVariables().length).to.equal(2);
            expect(globalScope.getVariables()[0].name).to.equal('a');
            expect(globalScope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(globalScope.getVariables()[0].getReferences().length).to.equal(1);
            expect(globalScope.getVariables()[0].getReferences()[0].isWriteOnly()).to.equal(true);
            expect(globalScope.getVariables()[1].name).to.equal('b');
            expect(globalScope.getVariables()[1].type).to.equal('ImplicitGlobal');
            expect(globalScope.getVariables()[1].getReferences().length).to.equal(1);
            expect(globalScope.getVariables()[1].getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should handle default values collision properly', () => {
            let program = parse(`
                ((a = 1) => {
                    let a = 2;
                });
            `);
            let scope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(scope.getVariables().length).to.equal(2);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('LetVariable');
            expect(scope.getVariables()[0].getReferences().length).to.equal(1);
            expect(scope.getVariables()[0].getReferences()[0].isWriteOnly()).to.equal(true);
            expect(scope.getVariables()[0].getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(scope.getVariables()[1].name).to.equal('a');
            expect(scope.getVariables()[1].type).to.equal('Parameter');
            expect(scope.getVariables()[1].getReferences().length).to.equal(1);
            expect(scope.getVariables()[1].getReferences()[0].isWriteOnly()).to.equal(true);
            expect(scope.getVariables()[1].getReferences()[0].node.parentElement.type).to.equal('AssignmentPattern');

            expect(program.plugins.scopes.findVariable(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.getVariables()[0]);
            expect(program.plugins.scopes.findReference(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.getVariables()[0].getReferences()[0]);
            expect(program.plugins.scopes.findDefinition(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.getVariables()[1].getDefinitions()[0]);
            expect(program.plugins.scopes.findVariable(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.getVariables()[1]);
            expect(program.plugins.scopes.findReference(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.getVariables()[1].getReferences()[0]);
            expect(program.plugins.scopes.findDefinition(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.getVariables()[0].getDefinitions()[0]);
        });

        it('should handle self-reference collision properly', () => {
            let program = parse(`
                (function a() {
                    let a = 2;
                });
            `);
            let scope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(scope.getVariables().length).to.equal(2);
            expect(scope.getVariables()[0].name).to.equal('a');
            expect(scope.getVariables()[0].type).to.equal('LetVariable');
            expect(scope.getVariables()[0].getReferences().length).to.equal(1);
            expect(scope.getVariables()[0].getReferences()[0].isWriteOnly()).to.equal(true);
            expect(scope.getVariables()[0].getReferences()[0].node.parentElement.type).to.equal('VariableDeclarator');
            expect(scope.getVariables()[1].name).to.equal('a');
            expect(scope.getVariables()[1].type).to.equal('SelfReference');
            expect(scope.getVariables()[1].getReferences().length).to.equal(1);
            expect(scope.getVariables()[1].getReferences()[0].isWriteOnly()).to.equal(true);
            expect(scope.getVariables()[1].getReferences()[0].node.parentElement.type).to.equal('FunctionExpression');

            expect(program.plugins.scopes.findVariable(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.getVariables()[0]);
            expect(program.plugins.scopes.findReference(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.getVariables()[0].getReferences()[0]);
            expect(program.plugins.scopes.findDefinition(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.getVariables()[1].getDefinitions()[0]);
            expect(program.plugins.scopes.findVariable(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.getVariables()[1]);
            expect(program.plugins.scopes.findReference(program.selectNodesByType('Identifier')[0]))
                .to.equal(scope.getVariables()[1].getReferences()[0]);
            expect(program.plugins.scopes.findDefinition(program.selectNodesByType('Identifier')[1]))
                .to.equal(scope.getVariables()[0].getDefinitions()[0]);
        });
    });
});
