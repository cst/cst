import {expect} from 'chai';
import ScopesPlugin from '../../../../src/plugins/scopes/ScopesPlugin';
import {parseAndGetProgram} from '../../../utils';

function parse(codeLines) {
    return parseAndGetProgram([].concat(codeLines).join('\n'), {
        plugins: [new ScopesPlugin()]
    });
}

describe('ScopesPlugin', () => {
    describe('import', () => {
        it('should not fail for empty import', () => {
            let program = parse(`
                import 'module';
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(0);
        });

        it('should support named star import', () => {
            let program = parse(`
                import * as ns from 'module';
                ns++;
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('ns');
            expect(scope.variables[0].type).to.equal('ImportBinding');
            expect(scope.variables[0].definitions.length).to.equal(1);
            expect(scope.variables[0].references.length).to.equal(1);
            expect(scope.variables[0].references[0].node.parentElement.type).to.equal('UpdateExpression');
        });

        it('should support named import', () => {
            let program = parse(`
                import ns from 'module';
                ns++;
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(1);
            expect(scope.variables[0].name).to.equal('ns');
            expect(scope.variables[0].type).to.equal('ImportBinding');
            expect(scope.variables[0].definitions.length).to.equal(1);
            expect(scope.variables[0].references.length).to.equal(1);
            expect(scope.variables[0].references[0].node.parentElement.type).to.equal('UpdateExpression');
        });

        it('should support pattern import', () => {
            let program = parse(`
                import {a, x as y} from 'module';
                a++;
                y++;
            `);
            let scope = program.plugins.scopes.acquire(program);
            expect(scope.variables.length).to.equal(2);
            expect(scope.variables[0].name).to.equal('a');
            expect(scope.variables[0].type).to.equal('ImportBinding');
            expect(scope.variables[0].definitions.length).to.equal(1);
            expect(scope.variables[0].references.length).to.equal(1);
            expect(scope.variables[0].references[0].node.parentElement.type).to.equal('UpdateExpression');
            expect(scope.variables[1].name).to.equal('y');
            expect(scope.variables[1].type).to.equal('ImportBinding');
            expect(scope.variables[1].definitions.length).to.equal(1);
            expect(scope.variables[1].references.length).to.equal(1);
            expect(scope.variables[1].references[0].node.parentElement.type).to.equal('UpdateExpression');
        });
    });
});
