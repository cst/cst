import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('BinaryExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('x + y').type).to.equal('BinaryExpression');
    });

    it('should accept parentheses', () => {
        let assignment = parseAndGetExpression('(x) + (y)');
        expect(assignment.operator).to.equal('+');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept ==', () => {
        let assignment = parseAndGetExpression('x == y');
        expect(assignment.operator).to.equal('==');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept !=', () => {
        let assignment = parseAndGetExpression('x != y');
        expect(assignment.operator).to.equal('!=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept ===', () => {
        let assignment = parseAndGetExpression('x === y');
        expect(assignment.operator).to.equal('===');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept !==', () => {
        let assignment = parseAndGetExpression('x !== y');
        expect(assignment.operator).to.equal('!==');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept <', () => {
        let assignment = parseAndGetExpression('x < y');
        expect(assignment.operator).to.equal('<');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept <=', () => {
        let assignment = parseAndGetExpression('x <= y');
        expect(assignment.operator).to.equal('<=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept >', () => {
        let assignment = parseAndGetExpression('x > y');
        expect(assignment.operator).to.equal('>');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept >=', () => {
        let assignment = parseAndGetExpression('x >= y');
        expect(assignment.operator).to.equal('>=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept <<', () => {
        let assignment = parseAndGetExpression('x << y');
        expect(assignment.operator).to.equal('<<');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept >>', () => {
        let assignment = parseAndGetExpression('x >> y');
        expect(assignment.operator).to.equal('>>');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept >>>', () => {
        let assignment = parseAndGetExpression('x >>> y');
        expect(assignment.operator).to.equal('>>>');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept +', () => {
        let assignment = parseAndGetExpression('x + y');
        expect(assignment.operator).to.equal('+');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept -', () => {
        let assignment = parseAndGetExpression('x - y');
        expect(assignment.operator).to.equal('-');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept *', () => {
        let assignment = parseAndGetExpression('x * y');
        expect(assignment.operator).to.equal('*');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept /', () => {
        let assignment = parseAndGetExpression('x / y');
        expect(assignment.operator).to.equal('/');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept %', () => {
        let assignment = parseAndGetExpression('x % y');
        expect(assignment.operator).to.equal('%');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept |', () => {
        let assignment = parseAndGetExpression('x | y');
        expect(assignment.operator).to.equal('|');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept ^', () => {
        let assignment = parseAndGetExpression('x ^ y');
        expect(assignment.operator).to.equal('^');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept &', () => {
        let assignment = parseAndGetExpression('x & y');
        expect(assignment.operator).to.equal('&');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept in', () => {
        let assignment = parseAndGetExpression('x in y');
        expect(assignment.operator).to.equal('in');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept instanceof', () => {
        let assignment = parseAndGetExpression('x instanceof y');
        expect(assignment.operator).to.equal('instanceof');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept **', () => {
        let assignment = parseAndGetExpression('x ** y');
        expect(assignment.operator).to.equal('**');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });
});
