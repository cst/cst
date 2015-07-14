import {parseAndGetProgram} from '../../utils';
import {expect} from 'chai';

describe('Token', () => {
    it('should get newlineCount property', () => {
        let program = parseAndGetProgram('\n\n\n  ');
        let token = program.firstToken;

        expect(token.newlineCount).to.equal(3);
    });
});
