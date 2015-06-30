import {parseAndGetProgram} from '../../../utils';
import {expect} from 'chai';

describe('Element', () => {
    it('should get previout token', () => {
        let program = parseAndGetProgram('var first = 1; var second = 2;');
        let secondVar = program.selectTokensByType('Keyword')[1];

        expect(secondVar.previousToken.previousToken.sourceCode).to.equal(';');
    });
});
