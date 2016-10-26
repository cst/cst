import {
    parseAndGetStatement,
} from '../../../utils';
import {expect} from 'chai';

describe('RestProperty', () => {
    it('should yield correct type', () => {
        let properties = parseAndGetStatement('let {...a} = b;').declarations[0].id.properties;
        expect(properties[0].type).to.equal('RestProperty');
    });

    it('should accept a single identifier', () => {
        let properties = parseAndGetStatement('let {...a} = b;').declarations[0].id.properties;
        expect(properties[0].type).to.equal('RestProperty');
        expect(properties[0].argument.type).to.equal('Identifier');
        expect(properties[0].argument.name).to.equal('a');
    });

    it('should accept a single identifier with a comment in between', () => {
        let properties = parseAndGetStatement('let {... /* a */ a} = b;').declarations[0].id.properties;
        expect(properties[0].type).to.equal('RestProperty');
        expect(properties[0].argument.type).to.equal('Identifier');
        expect(properties[0].argument.name).to.equal('a');
    });

    it('should allow other params', () => {
        let properties = parseAndGetStatement('let { a, ... b } = c ;').declarations[0].id.properties;
        expect(properties[0].type).to.equal('ObjectProperty');
        expect(properties[0].key.type).to.equal('Identifier');
        expect(properties[0].key.name).to.equal('a');
        expect(properties[0].value.type).to.equal('Identifier');
        expect(properties[0].value.name).to.equal('a');
        expect(properties[1].type).to.equal('RestProperty');
        expect(properties[1].argument.type).to.equal('Identifier');
        expect(properties[1].argument.name).to.equal('b');
    });
});
