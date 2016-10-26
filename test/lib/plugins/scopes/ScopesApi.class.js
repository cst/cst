import {expect} from 'chai';
import ScopesPlugin from '../../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram} from '../../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()],
    });
}

describe('ScopesPlugin', () => {
    describe('class', () => {
        it('should ignore unnamed class expression', () => {
            let program = parse(`
                (class {})
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(0);
        });

        it('should ignore named class expression', () => {
            let program = parse(`
                (class X {})
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(0);
        });

        it('should register class declaration', () => {
            let program = parse(`
                class X {}
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('X');
            expect(scope.getVariables()[0].type).to.equal('LetVariable');
            expect(scope.getVariables()[0].getDefinitions()[0].node.parentElement.type).to.equal('ClassDeclaration');
            expect(scope.getVariables()[0].getDefinitions()[0].type).to.equal('LetVariable');
        });

        it('should register class declaration', () => {
            let program = parse(`
                class X {}
                class Y extends X {}
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(2);
            expect(scope.getVariables()[0].name).to.equal('X');
            expect(scope.getVariables()[0].type).to.equal('LetVariable');
            expect(scope.getVariables()[0].getDefinitions()[0].node.parentElement.type).to.equal('ClassDeclaration');
            expect(scope.getVariables()[0].getDefinitions()[0].type).to.equal('LetVariable');
            expect(scope.getVariables()[0].getReferences().length).to.equal(2);
            expect(scope.getVariables()[0].getReferences()[0].isWriteOnly()).to.equal(true);
            expect(scope.getVariables()[0].getReferences()[1].isReadOnly()).to.equal(true);
            expect(scope.getVariables()[1].name).to.equal('Y');
            expect(scope.getVariables()[1].type).to.equal('LetVariable');
            expect(scope.getVariables()[1].getDefinitions()[0].node.parentElement.type).to.equal('ClassDeclaration');
            expect(scope.getVariables()[1].getDefinitions()[0].type).to.equal('LetVariable');
            expect(scope.getVariables()[1].getReferences().length).to.equal(1);
            expect(scope.getVariables()[1].getReferences()[0].isWriteOnly()).to.equal(true);
        });

        it('should ignore method names', () => {
            let program = parse(`
                (class {
                    method(val) {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(0);
            let classScope = scope.childScopes[0];
            expect(classScope.childScopes[0].getVariables().length).to.equal(1);
            expect(classScope.childScopes[0].getVariables()[0].name).to.equal('val');
            expect(classScope.childScopes[0].getVariables()[0].type).to.equal('Parameter');
        });

        it('should ignore getter names', () => {
            let program = parse(`
                (class {
                    get method() {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(0);
        });

        it('should ignore setter names', () => {
            let program = parse(`
                (class {
                    set method(val) {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(0);
            let classScope = scope.childScopes[0];
            expect(classScope.childScopes[0].getVariables().length).to.equal(1);
            expect(classScope.childScopes[0].getVariables()[0].name).to.equal('val');
            expect(classScope.childScopes[0].getVariables()[0].type).to.equal('Parameter');
        });

        it('should not ignore computed method names', () => {
            let program = parse(`
                (class {
                    [method]() {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('method');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
        });

        it('should not ignore computed getter names', () => {
            let program = parse(`
                (class {
                    get [method]() {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('method');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
        });

        it('should not ignore computed setter names', () => {
            let program = parse(`
                (class {
                    set [method](val) {}
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('method');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            let classScope = scope.childScopes[0];
            expect(classScope.childScopes[0].getVariables().length).to.equal(1);
            expect(classScope.childScopes[0].getVariables()[0].name).to.equal('val');
            expect(classScope.childScopes[0].getVariables()[0].type).to.equal('Parameter');
        });

        it('should support super', () => {
            let program = parse(`
                (class {
                    constructor() {
                        super();
                    }

                    method1() {
                        super.method2();
                    }
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            let classScope = scope.childScopes[0];
            expect(classScope.getVariables().length).to.equal(1);
            expect(classScope.getVariables()[0].name).to.equal('super');
            expect(classScope.getVariables()[0].type).to.equal('BuiltIn');
            expect(classScope.getVariables()[0].getDefinitions().length).to.equal(0);
            expect(classScope.getVariables()[0].getReferences().length).to.equal(2);
            expect(classScope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
            expect(classScope.getVariables()[0].getReferences()[0].node.parentElement.type).to.equal('CallExpression');
            expect(classScope.getVariables()[0].getReferences()[1].isReadOnly()).to.equal(true);
            expect(classScope.getVariables()[0].getReferences()[1].node.parentElement.type)
                .to.equal('MemberExpression');
        });
    });
});
