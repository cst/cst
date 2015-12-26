import {expect} from 'chai';
import ScopesPlugin from '../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram} from '../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()]
    });
}

describe('ScopesPlugin', () => {
    describe('arguments', () => {
        it('should process normal arguments', () => {
            let program = parse([
                'function func(a) {',
                '    a++;',
                '}'
            ]);
            let globalScope = program.plugins.scopes.acquire(program);
            expect(globalScope.variables[0].name).to.equal('func');
            let param = globalScope.childScopes[0].variables[0];
            expect(param.name).to.equal('a');
            expect(param.type).to.equal('Parameter');
            expect(param.definitions[0].type).to.equal('Parameter');
            expect(param.definitions[0].node.parentElement.type).to.equal('FunctionDeclaration');
            expect(param.references[0].node.parentElement.type).to.equal('UpdateExpression');
            expect(param.references[0].isReadWrite).to.equal(true);
        });
    });
});
