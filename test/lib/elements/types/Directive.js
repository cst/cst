import {parseAndGetProgram} from '../../../utils';
import {expect} from 'chai';

describe('Directive', () => {
    it('should return correct type', () => {
        expect(parseAndGetProgram('"use strict"').directives[0].type).to.equal('Directive');
    });
});
