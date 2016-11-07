import {parseAndGetExpression} from '../../../utils';
import baseCallExpression from './baseCallExpression';
import {expect} from 'chai';

describe('NewExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('new x').type).to.equal('NewExpression');
    });

    it('should allow without argument list', () => {
        var expression = parseAndGetExpression('new x');
        expect(expression.callee.type).to.equal('Identifier');
        expect(expression.callee.name).to.equal('x');
        expect(expression.arguments.length).to.equal(0);
    });

    it('should disallow super', () => {
        const classWithSuper =
            'class Foo extends String { constructor() { new super ( ) } }';
        const msg = 'Expression expected but "Super" found';
        expect(() => parseAndGetExpression(classWithSuper)).to.throw(msg);
    });

    baseCallExpression('new ');
});
