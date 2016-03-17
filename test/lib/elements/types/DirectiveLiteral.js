import {parseAndGetProgram} from '../../../utils';
import {expect} from 'chai';

describe('DirectiveLiteral', () => {
    it('should return correct type', () => {
        expect(parseAndGetProgram('"use strict"').directives[0].value.type)
            .to.equal('DirectiveLiteral');
    });
});
