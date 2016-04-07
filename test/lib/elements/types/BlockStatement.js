import {parseAndGetStatement, parseAndGetBlockStatementInFunction} from '../../../utils';
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

    it('should have one directive', () => {
        var statement = parseAndGetBlockStatementInFunction('"use strict"');
        expect(statement.directives).to.be.an('array');
        expect(statement.directives).to.have.length(1);
        expect(statement.directives[0].type).to.equal('Directive');
    });

    it('should have many directives', () => {
        var statement = parseAndGetBlockStatementInFunction('"use strict";"use strict"');
        expect(statement.directives).to.be.an('array');
        expect(statement.directives).to.have.length(2);
        expect(statement.directives[0].type).to.equal('Directive');
        expect(statement.directives[1].type).to.equal('Directive');
    });

    it('should have many directives', () => {
        var statement = parseAndGetBlockStatementInFunction('"use strict";"use strict"');
        expect(statement.directives).to.be.an('array');
        expect(statement.directives).to.have.length(2);
        expect(statement.directives[0].type).to.equal('Directive');
        expect(statement.directives[1].type).to.equal('Directive');
    });

    it('should not throw on non-code after directives', () => {
        expect(parseAndGetBlockStatementInFunction.bind(null, '"use strict"\n')).to.not.throw();
    });

    it('should accept multiple statements', () => {
        var statement = parseAndGetStatement('{ ; ; ; /* */ }');
        expect(statement.body[0].type).to.equal('EmptyStatement');
        expect(statement.body[1].type).to.equal('EmptyStatement');
        expect(statement.body[2].type).to.equal('EmptyStatement');
        expect(statement.childElements.length).to.equal(11);
        expect(statement.childElements.map(el => el.getSourceCode())).to.deep.equal([
            '{', ' ', ';', ' ', ';', ' ', ';', ' ', '/* */', ' ', '}'
        ]);
    });

});
