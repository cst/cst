import {parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('ClassDeclaration', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('class X {}').type).to.equal('ClassDeclaration');
    });

    it('should accept superClass', () => {
        let statement = parseAndGetStatement('class X extends Y {}');
        expect(statement.id.type).to.equal('Identifier');
        expect(statement.id.name).to.equal('X');
        expect(statement.superClass.type).to.equal('Identifier');
        expect(statement.superClass.name).to.equal('Y');
        expect(statement.body.type).to.equal('ClassBody');
        expect(statement.body.body.length).to.equal(0);
    });

    it('should accept expession for superClass', () => {
        let statement = parseAndGetStatement('class X extends z.Y {}');
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

    it('should accept members', () => {
        let statement = parseAndGetStatement('class X { method() {} }');
        expect(statement.id.type).to.equal('Identifier');
        expect(statement.id.name).to.equal('X');
        expect(statement.superClass).to.equal(null);
        expect(statement.body.type).to.equal('ClassBody');
        expect(statement.body.body.length).to.equal(1);
        expect(statement.body.body[0].type).to.equal('ClassMethod');
        expect(statement.body.body[0].key.name).to.equal('method');
    });
});
