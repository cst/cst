import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('BlockStatement', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('{;}').type).to.equal('BlockStatement');
    });

    it('should accept no statements', () => {
        var statement = parseAndGetStatement('{}');
        expect(statement.type).to.equal('BlockStatement');
        expect(statement.body.length).to.equal(0);
    });

    it('should accept single statement', () => {
        var statement = parseAndGetStatement('{;}');
        expect(statement.body[0].type).to.equal('EmptyStatement');
    });

    it('should accept multiple statements', () => {
        var statement = parseAndGetStatement('{ ; ; ; /* */ }');
        expect(statement.body[0].type).to.equal('EmptyStatement');
        expect(statement.body[1].type).to.equal('EmptyStatement');
        expect(statement.body[2].type).to.equal('EmptyStatement');
        expect(statement.childElements.length).to.equal(11);
        expect(statement.childElements.map(el => el.sourceCode)).to.deep.equal([
            '{', ' ', ';', ' ', ';', ' ', ';', ' ', '/* */', ' ', '}'
        ]);
    });

});
