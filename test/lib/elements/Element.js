import {parseAndGetProgram} from '../../utils';
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

    describe('loc property', () => {
        it('should return loc property for oneliner', () => {
            var program = parseAndGetProgram('var answer = 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 1,
                    'column': 15
                }
            });
        });

        it('should return loc property for oneliner first node with additional space', () => {
            var program = parseAndGetProgram(' var answer = 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 1,
                    'column': 1
                },
                'end': {
                    'line': 1,
                    'column': 16
                }
            });
        });

        it('should return loc property for oneliner first node with space and newline', () => {
            var program = parseAndGetProgram('\n var answer = 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 2,
                    'column': 1
                },
                'end': {
                    'line': 2,
                    'column': 16
                }
            });
        });

        it('should return loc property for multiple line breaks', () => {
            var program = parseAndGetProgram('\n\n\nvar answer = 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 4,
                    'column': 0
                },
                'end': {
                    'line': 4,
                    'column': 15
                }
            });
        });

        it('should return loc property with tricky end', () => {
            var program = parseAndGetProgram('\n\n\n var answer = \n1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 4,
                    'column': 1
                },
                'end': {
                    'line': 5,
                    'column': 2
                }
            });
        });

        it('should return loc property with space tricky end', () => {
            var program = parseAndGetProgram('\n\n\n var answer = \n 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 4,
                    'column': 1
                },
                'end': {
                    'line': 5,
                    'column': 3
                }
            });
        });

        it('should return loc property with spaces tricky end', () => {
            var program = parseAndGetProgram('var answer = \n\n\n  1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 4,
                    'column': 4
                }
            });
        });

        it('should return loc property with spaces & symbol tricky end', () => {
            var program = parseAndGetProgram('var answer = \n\n2\n 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 3,
                    'column': 1
                }
            });
        });
    });
});
