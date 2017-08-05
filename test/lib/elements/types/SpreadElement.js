import {parseAndGetExpression, parseAndGetObjectProperty, parseAndGetStatement} from '../../../utils';
import {expect} from 'chai';

describe('SpreadElement', () => {
    it('should yield correct type', () => {
        expect(parseAndGetExpression('[...a]').elements[0].type).to.equal('SpreadElement');
        expect(parseAndGetExpression('f(...a)').arguments[0].type).to.equal('SpreadElement');
    });

    it('should accept a single identifier', () => {
        let elements = parseAndGetExpression('[...a]').elements;
        expect(elements[0].type).to.equal('SpreadElement');
        expect(elements[0].argument.type).to.equal('Identifier');
        expect(elements[0].argument.name).to.equal('a');

        let args = parseAndGetExpression('f(...a)').arguments;
        expect(args[0].type).to.equal('SpreadElement');
        expect(args[0].argument.type).to.equal('Identifier');
        expect(args[0].argument.name).to.equal('a');
    });

    it('should accept a single identifier with whitespace in between', () => {
        let elements = parseAndGetExpression('[... a]').elements;
        expect(elements[0].type).to.equal('SpreadElement');
        expect(elements[0].argument.type).to.equal('Identifier');
        expect(elements[0].argument.name).to.equal('a');

        let args = parseAndGetExpression('f(... a)').arguments;
        expect(args[0].type).to.equal('SpreadElement');
        expect(args[0].argument.type).to.equal('Identifier');
        expect(args[0].argument.name).to.equal('a');
    });

    it('should accept a single identifier with a comment in between', () => {
        let elements = parseAndGetExpression('[... /* adsf */ a]').elements;
        expect(elements[0].type).to.equal('SpreadElement');
        expect(elements[0].argument.type).to.equal('Identifier');
        expect(elements[0].argument.name).to.equal('a');

        let args = parseAndGetExpression('f(... /* adsf */ a)').arguments;
        expect(args[0].type).to.equal('SpreadElement');
        expect(args[0].argument.type).to.equal('Identifier');
        expect(args[0].argument.name).to.equal('a');
    });

    it('should allow other params on the left', () => {
        let elements = parseAndGetExpression('[a, ...b]').elements;
        expect(elements[0].type).to.equal('Identifier');
        expect(elements[0].name).to.equal('a');

        expect(elements[1].type).to.equal('SpreadElement');
        expect(elements[1].argument.type).to.equal('Identifier');
        expect(elements[1].argument.name).to.equal('b');

        let args = parseAndGetExpression('f(a, ...b)').arguments;
        expect(args[0].type).to.equal('Identifier');
        expect(args[0].name).to.equal('a');

        expect(args[1].type).to.equal('SpreadElement');
        expect(args[1].argument.type).to.equal('Identifier');
        expect(args[1].argument.name).to.equal('b');
    });
});

describe('SpreadElement in ObjectProperty', () => {
    it('should yield correct type', () => {
        expect(parseAndGetObjectProperty('...b').type).to.equal('SpreadElement');
    });

    it('should accept a single identifier', () => {
        let spreadElement = parseAndGetObjectProperty('...b');
        expect(spreadElement.type).to.equal('SpreadElement');
        expect(spreadElement.argument.type).to.equal('Identifier');
        expect(spreadElement.argument.name).to.equal('b');
    });

    it('should accept a single identifier with a comment in between', () => {
        let spreadElement = parseAndGetObjectProperty('... /* a */ b');
        expect(spreadElement.type).to.equal('SpreadElement');
        expect(spreadElement.argument.type).to.equal('Identifier');
        expect(spreadElement.argument.name).to.equal('b');
    });

    it('should allow other params', () => {
        let properties = parseAndGetStatement('let a = { b, ... c, ... d } ;').declarations[0].init.properties;
        expect(properties[0].type).to.equal('ObjectProperty');
        expect(properties[0].key.type).to.equal('Identifier');
        expect(properties[0].key.name).to.equal('b');
        expect(properties[0].value.type).to.equal('Identifier');
        expect(properties[0].value.name).to.equal('b');
        expect(properties[1].type).to.equal('SpreadElement');
        expect(properties[1].argument.type).to.equal('Identifier');
        expect(properties[1].argument.name).to.equal('c');
        expect(properties[2].type).to.equal('SpreadElement');
        expect(properties[2].argument.type).to.equal('Identifier');
        expect(properties[2].argument.name).to.equal('d');
    });
});
