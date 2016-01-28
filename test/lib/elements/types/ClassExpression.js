import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('ClassExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('class {}').type).to.equal('ClassExpression');
    });

    it('should accept superClass', () => {
        var statement = parseAndGetExpression('class X extends Y {}');
        expect(statement.id.type).to.equal('Identifier');
        expect(statement.id.name).to.equal('X');
        expect(statement.superClass.type).to.equal('Identifier');
        expect(statement.superClass.name).to.equal('Y');
        expect(statement.body.type).to.equal('ClassBody');
        expect(statement.body.body.length).to.equal(0);
    });

    it('should not require id with superClass', () => {
        var statement = parseAndGetExpression('class extends Y {}');
        expect(statement.superClass.type).to.equal('Identifier');
        expect(statement.superClass.name).to.equal('Y');
        expect(statement.body.type).to.equal('ClassBody');
        expect(statement.body.body.length).to.equal(0);
    });

    it('should accept expession for superClass', () => {
        var statement = parseAndGetExpression('class X extends z.Y {}');
        expect(statement.id.type).to.equal('Identifier');
        expect(statement.id.name).to.equal('X');
        expect(statement.superClass.type).to.equal('MemberExpression');
        expect(statement.superClass.object.type).to.equal('Identifier');
        expect(statement.superClass.object.name).to.equal('z');
        expect(statement.superClass.property.type).to.equal('Identifier');
        expect(statement.superClass.property.name).to.equal('Y');
        expect(statement.body.type).to.equal('ClassBody');
        expect(statement.body.body.length).to.equal(0);
    });

    it('should not require id with members', () => {
        var statement = parseAndGetExpression('class { method() {} }');
        expect(statement.id).to.equal(null);
        expect(statement.superClass).to.equal(null);
        expect(statement.body.type).to.equal('ClassBody');
        expect(statement.body.body.length).to.equal(1);
        expect(statement.body.body[0].type).to.equal('ClassMethod');
        expect(statement.body.body[0].key.name).to.equal('method');
    });

    it('should accept members', () => {
        var statement = parseAndGetExpression('class X { method() {} }');
        expect(statement.id.type).to.equal('Identifier');
        expect(statement.id.name).to.equal('X');
        expect(statement.superClass).to.equal(null);
        expect(statement.body.type).to.equal('ClassBody');
        expect(statement.body.body.length).to.equal(1);
        expect(statement.body.body[0].type).to.equal('ClassMethod');
        expect(statement.body.body[0].key.name).to.equal('method');
    });
});
