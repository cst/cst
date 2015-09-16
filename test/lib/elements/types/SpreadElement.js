import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('SpreadElement', () => {
    it('should yield correct type', () => {
        expect(parseAndGetExpression('[...a]').elements[0].type).to.equal('SpreadElement');
        expect(parseAndGetExpression('f(...a)').arguments[0].type).to.equal('SpreadElement');
    });

    it('should accept a single identifier', () => {
        var elements = parseAndGetExpression('[...a]').elements;
        expect(elements[0].type).to.equal('SpreadElement');
        expect(elements[0].argument.type).to.equal('Identifier');
        expect(elements[0].argument.name).to.equal('a');

        var args = parseAndGetExpression('f(...a)').arguments;
        expect(args[0].type).to.equal('SpreadElement');
        expect(args[0].argument.type).to.equal('Identifier');
        expect(args[0].argument.name).to.equal('a');
    });

    it('should accept a single identifier with whitespace in between', () => {
        var elements = parseAndGetExpression('[... a]').elements;
        expect(elements[0].type).to.equal('SpreadElement');
        expect(elements[0].argument.type).to.equal('Identifier');
        expect(elements[0].argument.name).to.equal('a');

        var args = parseAndGetExpression('f(... a)').arguments;
        expect(args[0].type).to.equal('SpreadElement');
        expect(args[0].argument.type).to.equal('Identifier');
        expect(args[0].argument.name).to.equal('a');
    });

    it('should accept a single identifier with a comment in between', () => {
        var elements = parseAndGetExpression('[... /* adsf */ a]').elements;
        expect(elements[0].type).to.equal('SpreadElement');
        expect(elements[0].argument.type).to.equal('Identifier');
        expect(elements[0].argument.name).to.equal('a');

        var args = parseAndGetExpression('f(... /* adsf */ a)').arguments;
        expect(args[0].type).to.equal('SpreadElement');
        expect(args[0].argument.type).to.equal('Identifier');
        expect(args[0].argument.name).to.equal('a');
    });

    it('should allow other params on the left', () => {
        var elements = parseAndGetExpression('[a, ...b]').elements;
        expect(elements[0].type).to.equal('Identifier');
        expect(elements[0].name).to.equal('a');

        expect(elements[1].type).to.equal('SpreadElement');
        expect(elements[1].argument.type).to.equal('Identifier');
        expect(elements[1].argument.name).to.equal('b');

        var args = parseAndGetExpression('f(a, ...b)').arguments;
        expect(args[0].type).to.equal('Identifier');
        expect(args[0].name).to.equal('a');

        expect(args[1].type).to.equal('SpreadElement');
        expect(args[1].argument.type).to.equal('Identifier');
        expect(args[1].argument.name).to.equal('b');
    });
});
