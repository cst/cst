import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('ClassBody', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('class X {}').body.type).to.equal('ClassBody');
    });

    it('should work with semicolons after methods', () => {
        expect(parseAndGetStatement('class X { x() {}; }').body.type).to.equal('ClassBody');
    });

    it('should accept empty member list', () => {
        let statement = parseAndGetStatement('class X {}').body;
        expect(statement.type).to.equal('ClassBody');
        expect(statement.body.length).to.equal(0);
    });

    it('should accept whitespace', () => {
        let statement = parseAndGetStatement('class X { /* 123 */ /* 456 */ }').body;
        expect(statement.type).to.equal('ClassBody');
        expect(statement.body.length).to.equal(0);
    });

    it('should accept single member', () => {
        let statement = parseAndGetStatement('class X { x(){} }').body;
        expect(statement.body.length).to.equal(1);
        expect(statement.body[0].type).to.equal('ClassMethod');
    });

    it('should accept multiple member', () => {
        let statement = parseAndGetStatement('class X { x(){} get y() {} set y(v) {} }').body;
        expect(statement.body.length).to.equal(3);
        expect(statement.body[0].type).to.equal('ClassMethod');
        expect(statement.body[1].type).to.equal('ClassMethod');
        expect(statement.body[2].type).to.equal('ClassMethod');
    });
});
