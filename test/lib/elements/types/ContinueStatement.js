import {parseAndGetStatementInLoop} from '../../../utils';
import {expect} from 'chai';

describe('ContinueStatement', () => {

    it('should return correct type', () => {
        expect(parseAndGetStatementInLoop('continue ;').type).to.equal('ContinueStatement');
    });

    it('should accept label', () => {
        var statement = parseAndGetStatementInLoop('continue lbl ;', 'lbl');
        expect(statement.type).to.equal('ContinueStatement');
        expect(statement.label.type).to.equal('Identifier');
        expect(statement.label.name).to.equal('lbl');
    });

    it('should work without semicolon', () => {
        var statement = parseAndGetStatementInLoop('continue lbl', 'lbl');
        expect(statement.type).to.equal('ContinueStatement');
        expect(statement.label.type).to.equal('Identifier');
        expect(statement.label.name).to.equal('lbl');
    });

    it('should work without semicolon and label', () => {
        var statement = parseAndGetStatementInLoop('continue');
        expect(statement.type).to.equal('ContinueStatement');
    });

    it('should work with newline', () => {
        var statement = parseAndGetStatementInLoop('continue\n;');
        expect(statement.type).to.equal('ContinueStatement');
    });
});
