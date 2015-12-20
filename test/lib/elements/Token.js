import {parseAndGetProgram} from '../../utils';
import Token from '/Users/arkel/Workspace/cst/src/elements/Token.js';

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

    describe('String', () => {
        it('should have `souceCode` property', () => {
            let program = parseAndGetProgram('x = \'x\'');
            let token = program.lastToken.previousToken;

            expect(token.sourceCode).to.equal('\'x\'');
        });

        it('create string token', () => {
            let token = new Token('String', '\'1\'');

            expect(token.sourceCode).to.equal('\'1\'');
        });
    });
});
