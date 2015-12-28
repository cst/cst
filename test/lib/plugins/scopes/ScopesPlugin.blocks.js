import {expect} from 'chai';
import ScopesPlugin from '../../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram} from '../../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()]
    });
}

describe('ScopesPlugin', () => {
    describe('blocks', () => {
        it('should support custom block', () => {
            let program = parse([
                'let a = 1;',
                '{',
                    'let a = 2;',
                '}'
            ]);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.variables[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.references[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].variables[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA1.references[0].node.parentElement.init.value).to.equal(1);
        });

        it('should support if block', () => {
            let program = parse([
                'let a = 1;',
                'if (true) {',
                    'let a = 2;',
                '}'
            ]);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.variables[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.references[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].variables[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA1.references[0].node.parentElement.init.value).to.equal(1);
        });

        it('should support for block', () => {
            let program = parse([
                'let a = 1;',
                'for (let a = 2;;) {',
                    'let a = 3;',
                '}'
            ]);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.variables[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.definitions[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.references[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].variables[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.definitions[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.definitions[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.references[0].node.parentElement.init.value).to.equal(2);
            expect(variableA2.references[1].node.parentElement.init.value).to.equal(3);
        });

        it('should support for-in block', () => {
            let program = parse([
                'let a = 1;',
                'for (let a in 2) {',
                    'let a = 3;',
                '}'
            ]);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.variables[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.definitions[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.references[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].variables[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.definitions[0].node.parentElement.parentElement.parentElement.right.value).to.equal(2);
            expect(variableA2.definitions[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.references[0].node.parentElement.parentElement.parentElement.right.value).to.equal(2);
            expect(variableA2.references[0].isWriteOnly).to.equal(true);
            expect(variableA2.references[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.references[1].isWriteOnly).to.equal(true);
        });

        it('should support for-in block', () => {
            let program = parse([
                'let a = 1;',
                'for (let a of 2) {',
                    'let a = 3;',
                '}'
            ]);
            let globalScope = program.plugins.scopes.acquire(program);

            let variableA1 = globalScope.variables[0];
            expect(variableA1.name).to.equal('a');
            expect(variableA1.type).to.equal('LetVariable');
            expect(variableA1.definitions[0].node.parentElement.init.value).to.equal(1);
            expect(variableA1.references[0].node.parentElement.init.value).to.equal(1);

            let variableA2 = globalScope.childScopes[0].variables[0];
            expect(variableA2.name).to.equal('a');
            expect(variableA2.type).to.equal('LetVariable');
            expect(variableA2.definitions[0].node.parentElement.parentElement.parentElement.right.value).to.equal(2);
            //expect(variableA2.definitions[1].node.parentElement.init.value).to.equal(3);
            expect(variableA2.references[0].node.parentElement.parentElement.parentElement.right.value).to.equal(2);
            expect(variableA2.references[0].isWriteOnly).to.equal(true);
            //expect(variableA2.references[1].node.parentElement.init.value).to.equal(3);
            //expect(variableA2.references[1].isWriteOnly).to.equal(true);
        });
    });
});
