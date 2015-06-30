import {parseAndGetProgram} from '../../../utils';
import {expect} from 'chai';

describe('Element', () => {
    it('should get previous token', () => {
        let program = parseAndGetProgram('var first = 1; var second = 2;');
        let secondVar = program.selectTokensByType('Keyword')[1];

        expect(secondVar.previousToken.previousToken.sourceCode).to.equal(';');
    });

    describe('range property', () => {
        it('should return range property for VariableDeclarator', () => {
            var program = parseAndGetProgram('var answer = 1;');
            var node = program.selectNodesByType('VariableDeclarator')[0];

            expect(node.range).to.include(4, 10);
        });

        it('should return range property for VariableDeclaration', () => {
            var program = parseAndGetProgram('var answer = 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.range).to.include(0, 15);
        });

        it('should return range property for second VariableDeclarators', () => {
            var program = parseAndGetProgram('var first = 1; var second = 2;');
            var node = program.selectNodesByType('VariableDeclarator')[1];

            expect(node.range).to.include(19, 29);
        });
    });
});
