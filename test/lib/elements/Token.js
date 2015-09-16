import {parseAndGetProgram} from '../../utils';
import {expect} from 'chai';

describe('Token', () => {
    it('should get newlineCount property', () => {
        let program = parseAndGetProgram('\n\n\n  ');
        let token = program.firstToken;

        expect(token.newlineCount).to.equal(3);
    });

    it('should accept block comments', () => {
        let program = parseAndGetProgram('/* Hello */');
        let token = program.firstToken;
        expect(token.type).to.equal('CommentBlock');
    });

    it('should accept line comments', () => {
        let program = parseAndGetProgram('// Hello');
        let token = program.firstToken;
        expect(token.type).to.equal('CommentLine');
    });
});
