import {parseAndGetStatementInFunctionParams} from '../../../utils';
import {expect} from 'chai';

describe('RestElement', () => {
    it('should yield correct type', () => {
        expect(parseAndGetStatementInFunctionParams('...a')[0].type).to.equal('RestElement');
    });

    it('should accept a single identifier', () => {
        var statement = parseAndGetStatementInFunctionParams('...a')[0];
        expect(statement.type).to.equal('RestElement');
        expect(statement.argument.type).to.equal('Identifier');
        expect(statement.argument.name).to.equal('a');
    });

    it('should accept a single identifier with whitespace in between', () => {
        var statement = parseAndGetStatementInFunctionParams('... a')[0];
        expect(statement.type).to.equal('RestElement');
        expect(statement.argument.type).to.equal('Identifier');
        expect(statement.argument.name).to.equal('a');
    });

    it('should accept a single identifier with a comment in between', () => {
        var statement = parseAndGetStatementInFunctionParams('... /* adsf */ a')[0];
        expect(statement.type).to.equal('RestElement');
        expect(statement.argument.type).to.equal('Identifier');
        expect(statement.argument.name).to.equal('a');
    });

    it('should allow other params on the left', () => {
        var statements = parseAndGetStatementInFunctionParams('a, ...b');
        expect(statements[0].type).to.equal('Identifier');
        expect(statements[0].name).to.equal('a');

        expect(statements[1].type).to.equal('RestElement');
        expect(statements[1].argument.type).to.equal('Identifier');
        expect(statements[1].argument.name).to.equal('b');
    });
});
