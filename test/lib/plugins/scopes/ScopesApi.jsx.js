import {expect} from 'chai';
import ScopesPlugin from '../../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram} from '../../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()]
    });
}

describe('ScopesPlugin', () => {
    describe('jsx', () => {
        it('should include component reference with self-closing tag', () => {
            let program = parse(`
                <A />;
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('A');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
            expect(scope.variables[0].references[0].node.parentElement.type).to.equal('JSXOpeningElement');
        });

        it('should include component reference a normal tag', () => {
            let program = parse(`
                <A></A>;
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('A');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[0].references.length).to.equal(2);
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
            expect(scope.variables[0].references[0].node.parentElement.type).to.equal('JSXOpeningElement');
            expect(scope.variables[0].references[1].isReadOnly).to.equal(true);
            expect(scope.variables[0].references[1].node.parentElement.type).to.equal('JSXClosingElement');
        });

        it('should resolve component reference', () => {
            let program = parse(`
                let A;
                (<A />);
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('A');
            expect(scope.variables[0].type).to.equal('LetVariable');
            expect(scope.variables[0].definitions.length).to.equal(1);
            expect(scope.variables[0].references.length).to.equal(1);
            expect(scope.variables[0].references[0].isReadOnly).to.equal(true);
            expect(scope.variables[0].references[0].node.parentElement.type).to.equal('JSXOpeningElement');
        });

        it('should ignore attribute names', () => {
            let program = parse(`
                (<A href="" />);
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('A');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
        });

        it('should process content correctly', () => {
            let program = parse(`
                (<A href="">{H}</A>);
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(2);
            expect(scope.variables[0].name).to.equal('A');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[1].name).to.equal('H');
            expect(scope.variables[1].type).to.equal('ImplicitGlobal');
        });

        it('should process nested tags correctly', () => {
            let program = parse(`
                (<A href=""><H /></A>);
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(2);
            expect(scope.variables[0].name).to.equal('A');
            expect(scope.variables[0].type).to.equal('ImplicitGlobal');
            expect(scope.variables[1].name).to.equal('H');
            expect(scope.variables[1].type).to.equal('ImplicitGlobal');
        });
    });
});
