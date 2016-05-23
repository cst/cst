import {expect} from 'chai';

import {parseAndGetBindExpression} from '../../../utils';

describe('BindExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetBindExpression('foo::bar').type).to.equal('BindExpression');
    });

    it('works without spaces', () => {
        const expression = parseAndGetBindExpression('foo::bar');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('foo');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('bar');
    });

    it('works with newline after first operand', () => {
        const expression = parseAndGetBindExpression('foo\n::bar');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('foo');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('bar');
    });

    it('works with newline before second operand', () => {
        const expression = parseAndGetBindExpression('foo::\nbar');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('foo');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('bar');
    });

    it('works when newlines all around', () => {
        const expression = parseAndGetBindExpression('foo\n::\nbar');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('foo');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('bar');
    });

    it('works with space after first operand', () => {
        const expression = parseAndGetBindExpression('foo ::bar');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('foo');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('bar');
    });

    it('works with space before second operand', () => {
        const expression = parseAndGetBindExpression('foo:: bar');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('foo');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('bar');
    });

    it('works when spaces all around', () => {
        const expression = parseAndGetBindExpression('foo :: bar');
        expect(expression.object.type).to.equal('Identifier');
        expect(expression.object.name).to.equal('foo');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('bar');
    });

    it('works with new keyword without parentheses', () => {
        const expression = parseAndGetBindExpression('new User::bar');
        expect(expression.object.type).to.equal('NewExpression');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('bar');
    });

    it('works with new keyword with parentheses', () => {
        const expression = parseAndGetBindExpression('new User()::bar');
        expect(expression.object.type).to.equal('NewExpression');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('bar');
    });

    it('works with object expression', () => {
        const expression = parseAndGetBindExpression('({})::bar');
        expect(expression.object.type).to.equal('ObjectExpression');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('bar');
    });

    it('works with call expressions all around', () => {
        const expression = parseAndGetBindExpression('foo()::bar()');
        expect(expression.object.type).to.equal('CallExpression');
        expect(expression.callee.type).to.equal('Identifier');
    });

    it('works without "first" operand', () => {
        const expression = parseAndGetBindExpression('Promise.resolve(123).then(::console.log);');
        expect(expression.object).to.equal(null);
        expect(expression.callee.type).to.equal('MemberExpression');
    });

    it('works inside call expression', () => {
        const expression = parseAndGetBindExpression('$(".some-link").on("click", ::view.reset);');
        expect(expression.object).to.equal(null);
        expect(expression.callee.type).to.equal('MemberExpression');
    });
});
