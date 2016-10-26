import {expect} from 'chai';
import ScopesPlugin from '../../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram} from '../../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()],
    });
}

describe('ScopesPlugin', () => {
    describe('templates', () => {
        it('should include tag', () => {
            let program = parse('' +
                '(tag`hello`)' +
            '');
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('tag');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
            expect(scope.getVariables()[0].getReferences()[0].node.parentElement.type)
                .to.equal('TaggedTemplateExpression');
        });

        it('should resolve tag', () => {
            let program = parse('' +
                'let tag;' +
                '(tag`hello`)' +
            '');
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('tag');
            expect(scope.getVariables()[0].type).to.equal('LetVariable');
            expect(scope.getVariables()[0].getDefinitions().length).to.equal(1);
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
            expect(scope.getVariables()[0].getReferences()[0].node.parentElement.type)
                .to.equal('TaggedTemplateExpression');
        });

        it('should handle nested references', () => {
            let program = parse('' +
                '(`hello${ref}world`)' +
            '');
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.getVariables().length).to.equal(1);
            expect(scope.getVariables()[0].name).to.equal('ref');
            expect(scope.getVariables()[0].type).to.equal('ImplicitGlobal');
            expect(scope.getVariables()[0].getReferences()[0].isReadOnly()).to.equal(true);
            expect(scope.getVariables()[0].getReferences()[0].node.parentElement.type).to.equal('TemplateLiteral');
        });
    });
});
