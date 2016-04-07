import {parseAndGetProgram} from '../../utils';
import Token from '../../../src/elements/Token.js';

import {expect} from 'chai';

describe('Token', () => {
    it('should get getNewlineCount value', () => {
        let program = parseAndGetProgram('\n\n\n  ');
        let token = program.getFirstToken();

        expect(token.getNewlineCount()).to.equal(3);
    });

    it('should accept block comments', () => {
        let program = parseAndGetProgram('/* Hello */');
        let token = program.getFirstToken();
        expect(token.type).to.equal('CommentBlock');
    });

    it('should accept line comments', () => {
        let program = parseAndGetProgram('// Hello');
        let token = program.getFirstToken();
        expect(token.type).to.equal('CommentLine');
    });

    describe('String', () => {
        it('should have `souceCode` property', () => {
            let program = parseAndGetProgram('x = \'x\'');
            let token = program.getLastToken().getPreviousToken();

            expect(token.getSourceCode()).to.equal('\'x\'');
        });

        it('create string token', () => {
            let token = new Token('String', '\'1\'');

            expect(token.getSourceCode()).to.equal('\'1\'');
        });
    });
});
