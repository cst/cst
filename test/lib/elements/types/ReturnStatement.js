import {parseAndGetStatementInFunction} from '../../../utils';
import {expect} from 'chai';

describe('ReturnStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatementInFunction('return ;').type).to.equal('ReturnStatement');
    });

    it('should accept argument', () => {
        let statement = parseAndGetStatementInFunction('return 1 ;');
        expect(statement.type).to.equal('ReturnStatement');
        expect(statement.argument.type).to.equal('NumericLiteral');
        expect(statement.argument.value).to.equal(1);
    });

    it('should accept argument in parentheses', () => {
        let statement = parseAndGetStatementInFunction('return ( 1 ) ;');
        expect(statement.type).to.equal('ReturnStatement');
        expect(statement.argument.type).to.equal('NumericLiteral');
        expect(statement.argument.value).to.equal(1);
    });

    it('should work without semicolon', () => {
        let statement = parseAndGetStatementInFunction('return 1');
        expect(statement.type).to.equal('ReturnStatement');
        expect(statement.argument.type).to.equal('NumericLiteral');
        expect(statement.argument.value).to.equal(1);
    });

    it('should work without semicolon and argument', () => {
        let statement = parseAndGetStatementInFunction('return');
        expect(statement.type).to.equal('ReturnStatement');
    });
});
