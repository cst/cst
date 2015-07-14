import {parseAndGetProgram} from '../../utils';
import {expect} from 'chai';

describe('Token', () => {
    it('should get lineBreakCount property', () => {
        let program = parseAndGetProgram('\n\n\n  ');
        let token = program.firstToken;

        expect(token.lineBreakCount).to.equal(3);
    });

    it('should get sourceCodeLengthWithoutLineBreaks property', () => {
        let program = parseAndGetProgram('\n\n\n  ');
        let token = program.firstToken;

        expect(token.sourceCodeLengthWithoutLineBreaks).to.equal(2);
    });
});
