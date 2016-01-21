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

describe.only('ScopesPlugin', () => {
    describe('updates', () => {
        it('should update on new var statements', () => {
            let program = parse(`
                var a;
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');

            let anotherVariable = parseAndGetStatement('var b;');
            anotherVariable.remove();
            program.insertChildBefore(anotherVariable, program.lastChild);

            expect(scope.variables.length).to.equal(2);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[1].name).to.equal('b');
            expect(scope.variables[1].type).to.equal('Variable');
        });

        it('should update on scope removal', () => {
            let program = parse(`
                (() => {
                    x;
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);

            program.selectNodesByType('ExpressionStatement')[0].remove();
            expect(scope.variables.length).to.equal(0);
        });

        it('should update on var statement removal', () => {
            let program = parse(`
                var a;
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);

            program.selectNodesByType('VariableDeclaration')[0].remove();
            expect(scope.variables.length).to.equal(0);
        });

        it('should update on function parameter removal', () => {
            let program = parse(`
                ((a) => {})
            `);
            let scope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(scope.variables.length).to.equal(1);

            program.selectNodesByType('Identifier')[0].remove();
            expect(scope.variables.length).to.equal(0);
        });

        it('should update on function parameter replace', () => {
            let program = parse(`
                ((a) => {})
            `);
            let scope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');

            let func = program.selectNodesByType('ArrowFunctionExpression')[0];
            let param = program.selectNodesByType('Identifier')[0];
            func.replaceChild(new Identifier([new Token('Identifier', 'b')]), param);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('b');
        });

        it('should update on function parameter rename', () => {
            let program = parse(`
                ((a) => {})
            `);
            let scope = program.plugins.scopes.acquire(program).childScopes[0];
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');

            let param = program.selectNodesByType('Identifier')[0];
            param.replaceChild(new Token('Identifier', 'b'), param.firstChild);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('b');
        });

        it('should update on property change from shorthand', () => {
            let program = parse(`
                ({
                    a
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');

            program.selectNodesByType('Property')[0].appendChild(
                new Fragment([
                    new Token('Punctuator', ':'),
                    new Identifier([new Token('Identifier', 'b')])
                ])
            );
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('b');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
        });

        it('should update on property change to shorthand', () => {
            let program = parse(`
                ({
                    a: 1
                })
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(0);

            let property = program.selectNodesByType('Property')[0];
            property.removeChildren(
                property.childElements[1],
                property.lastChild
            );
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
        });
    });
});
