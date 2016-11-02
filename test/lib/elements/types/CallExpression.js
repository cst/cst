import {parseAndGetExpression} from '../../../utils';
import baseCallExpression from './baseCallExpression';
import {expect} from 'chai';

describe('CallExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('x()').type).to.equal('CallExpression');
    });

    it('should allow super', () => {
        const classWithSuper =
            'class Foo extends String { constructor() { super ( ) } }';
        var expression = parseAndGetExpression(classWithSuper)
            .body
            .body[0]
            .body
            .body[0]
            .expression;
        expect(expression.callee.type).to.equal('Super');
        expect(expression.arguments.length).to.equal(0);
    });

    baseCallExpression();
});
