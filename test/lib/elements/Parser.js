import {parseAndGetProgram} from '../../utils';
import {expect} from 'chai';

describe('Parser', () => {
    it('should support hash bang', () => {
        let program = parseAndGetProgram('#!/usr/bin/env node\n/* hello */');
        expect(program.firstToken.type).to.equal('Hashbang');
        expect(program.firstToken.value).to.equal('/usr/bin/env node');
        expect(program.firstToken.sourceCode).to.equal('#!/usr/bin/env node');
    });
});
