import {
    parseAndGetObjectProperty,
    parseAndGetStatement
} from '../../../utils';
import {expect} from 'chai';

describe('SpreadProperty', () => {
    it('should yield correct type', () => {
        expect(parseAndGetObjectProperty('...b').type).to.equal('SpreadProperty');
    });

    it('should accept a single identifier', () => {
        let spreadProperty = parseAndGetObjectProperty('...b');
        expect(spreadProperty.type).to.equal('SpreadProperty');
        expect(spreadProperty.argument.type).to.equal('Identifier');
        expect(spreadProperty.argument.name).to.equal('b');
    });

    it('should accept a single identifier with a comment in between', () => {
        let spreadProperty = parseAndGetObjectProperty('... /* a */ b');
        expect(spreadProperty.type).to.equal('SpreadProperty');
        expect(spreadProperty.argument.type).to.equal('Identifier');
        expect(spreadProperty.argument.name).to.equal('b');
    });

    it('should allow other params', () => {
        let properties = parseAndGetStatement('let a = { b, ... c, ... d } ;').declarations[0].init.properties;
        expect(properties[0].type).to.equal('Property');
        expect(properties[0].key.type).to.equal('Identifier');
        expect(properties[0].key.name).to.equal('b');
        expect(properties[0].value.type).to.equal('Identifier');
        expect(properties[0].value.name).to.equal('b');
        expect(properties[1].type).to.equal('SpreadProperty');
        expect(properties[1].argument.type).to.equal('Identifier');
        expect(properties[1].argument.name).to.equal('c');
        expect(properties[2].type).to.equal('SpreadProperty');
        expect(properties[2].argument.type).to.equal('Identifier');
        expect(properties[2].argument.name).to.equal('d');
    });
});
