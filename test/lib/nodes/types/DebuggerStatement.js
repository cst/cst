import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('DebuggerStatement', () => {

    it('should return correct type', () => {
        expect(parseAndGetStatement('debugger;').type).to.equal('DebuggerStatement');
    });

    it('should work with whitespace', () => {
        var statement = parseAndGetStatement('debugger ;');
        expect(statement.type).to.equal('DebuggerStatement');
        expect(statement.childElements.length).to.equal(3);
    });

    it('should work without semicolon', () => {
        var statement = parseAndGetStatement('debugger');
        expect(statement.type).to.equal('DebuggerStatement');
        expect(statement.childElements.length).to.equal(1);
    });
});
