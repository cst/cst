import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('ClassBody', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('class X {}').body.type).to.equal('ClassBody');
    });

    it('should accept empty member list', () => {
        var statement = parseAndGetStatement('class X {}').body;
        expect(statement.type).to.equal('ClassBody');
        expect(statement.body.length).to.equal(0);
    });

    it('should accept whitespace', () => {
        var statement = parseAndGetStatement('class X { /* 123 */ /* 456 */ }').body;
        expect(statement.type).to.equal('ClassBody');
        expect(statement.body.length).to.equal(0);
    });

    it('should accept single member', () => {
        var statement = parseAndGetStatement('class X { x(){} }').body;
        expect(statement.body.length).to.equal(1);
        expect(statement.body[0].type).to.equal('MethodDefinition');
    });

    it('should accept multiple member', () => {
        var statement = parseAndGetStatement('class X { x(){} get y() {} set y() {} }').body;
        expect(statement.body.length).to.equal(3);
        expect(statement.body[0].type).to.equal('MethodDefinition');
        expect(statement.body[1].type).to.equal('MethodDefinition');
        expect(statement.body[2].type).to.equal('MethodDefinition');
    });
});
