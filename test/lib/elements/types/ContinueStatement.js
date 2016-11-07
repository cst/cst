import {parseAndGetStatementInLoop} from '../../../utils';
import {expect} from 'chai';

describe('ContinueStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatementInLoop('continue ;').type).to.equal('ContinueStatement');
    });

    it('should accept label', () => {
        let statement = parseAndGetStatementInLoop('continue lbl ;', 'lbl');
        expect(statement.type).to.equal('ContinueStatement');
        expect(statement.label.type).to.equal('Identifier');
        expect(statement.label.name).to.equal('lbl');
    });

    it('should work without semicolon', () => {
        let statement = parseAndGetStatementInLoop('continue lbl', 'lbl');
        expect(statement.type).to.equal('ContinueStatement');
        expect(statement.label.type).to.equal('Identifier');
        expect(statement.label.name).to.equal('lbl');
    });

    it('should work without semicolon and label', () => {
        let statement = parseAndGetStatementInLoop('continue');
        expect(statement.type).to.equal('ContinueStatement');
    });

    it('should work with newline', () => {
        let statement = parseAndGetStatementInLoop('continue\n;');
        expect(statement.type).to.equal('ContinueStatement');
    });
});
