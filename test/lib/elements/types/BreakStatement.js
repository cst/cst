import {parseAndGetStatementInLoop} from '../../../utils';
import {expect} from 'chai';

describe('BreakStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatementInLoop('break ;').type).to.equal('BreakStatement');
    });

    it('should accept label', () => {
        let statement = parseAndGetStatementInLoop('break lbl ;', 'lbl');
        expect(statement.type).to.equal('BreakStatement');
        expect(statement.label.type).to.equal('Identifier');
        expect(statement.label.name).to.equal('lbl');
    });

    it('should work without semicolon', () => {
        let statement = parseAndGetStatementInLoop('break lbl', 'lbl');
        expect(statement.type).to.equal('BreakStatement');
        expect(statement.label.type).to.equal('Identifier');
        expect(statement.label.name).to.equal('lbl');
    });

    it('should work without semicolon and label', () => {
        let statement = parseAndGetStatementInLoop('break');
        expect(statement.type).to.equal('BreakStatement');
    });

    it('should work with new line', () => {
        let statement = parseAndGetStatementInLoop('break\n;');
        expect(statement.type).to.equal('BreakStatement');
    });
});
