import {
    parseAndGetObjectProperty,
    parseAndGetObjectPropertyDefaultValue
} from '../../../utils';

import Parser from '../../../../src/Parser';

import {expect} from 'chai';

describe('ObjectMethod', () => {
    it('should return correct type', () => {
        const method = parseAndGetObjectProperty('test(x) {}');
        expect(method.async).to.equal(false);
        expect(method.key.type).to.equal('Identifier');
        expect(method.generator).to.equal(false);
        expect(method.method).to.equal(true);
        expect(method.computed).to.equal(false);
        expect(method.kind).to.equal('method');
        expect(method.async).to.equal(false);
        expect(method.params.length).to.equal(1);
        expect(method.params[0].type).to.equal('Identifier');
        expect(method.body.type).to.equal('BlockStatement');
    });

    it('supports async methods', () => {
        const method = parseAndGetObjectProperty('async test() {}');
        expect(method.async).to.equal(true);
    });

    it('supports generator methods', () => {
        const method = parseAndGetObjectProperty('* test() {}');
        expect(method.generator).to.equal(true);
    });

    it('supports computed generator methods', () => {
        const method = parseAndGetObjectProperty('* [test]() {}');
        expect(method.generator).to.equal(true);
        expect(method.computed).to.equal(true);
    });

    it('supports computed methods', () => {
        const method = parseAndGetObjectProperty('[test]() {}');
        expect(method.computed).to.equal(true);
    });

    it('supports getter methods', () => {
        const method = parseAndGetObjectProperty('get test() {}');
        expect(method.kind).to.equal('get');
        expect(method.method).to.equal(false);
    });

    it('supports setter methods', () => {
        const method = parseAndGetObjectProperty('set test(x) {}');
        expect(method.kind).to.equal('set');
        expect(method.method).to.equal(false);
    });
});
