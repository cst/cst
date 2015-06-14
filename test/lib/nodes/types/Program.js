import {parseAndGetProgram} from '../../../utils';
import {expect} from 'chai';

describe('Program', () => {
    it('should return correct type', () => {
        expect(parseAndGetProgram(';').type).to.equal('Program');
    });

    it('should accept empty string', () => {
        var statement = parseAndGetProgram('');
        expect(statement.type).to.equal('Program');
        expect(statement.body.length).to.equal(0);
    });

    it('should accept no statements', () => {
        var statement = parseAndGetProgram(' /* */ ');
        expect(statement.type).to.equal('Program');
        expect(statement.body.length).to.equal(0);
    });

    it('should accept single statement', () => {
        var statement = parseAndGetProgram(';');
        expect(statement.body[0].type).to.equal('EmptyStatement');
    });

    it('should accept multiple statements', () => {
        var statement = parseAndGetProgram(' ; ; ; /* */ ');
        expect(statement.body[0].type).to.equal('EmptyStatement');
        expect(statement.body[1].type).to.equal('EmptyStatement');
        expect(statement.body[2].type).to.equal('EmptyStatement');
        expect(statement.childElements.length).to.equal(9);
        expect(statement.childElements.map(el => el.code)).to.deep.equal([
            ' ', ';', ' ', ';', ' ', ';', ' ', '/* */', ' '
        ]);
    });

});
