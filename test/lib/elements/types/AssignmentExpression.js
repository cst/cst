import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('AssignmentExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('x = y').type).to.equal('AssignmentExpression');
    });

    it('should accept parentheses', () => {
        var assignment = parseAndGetExpression('(x) = (y)');
        expect(assignment.operator).to.equal('=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept object pattern', () => {
        var assignment = parseAndGetExpression('({x} = y)');
        expect(assignment.operator).to.equal('=');
        expect(assignment.left.type).to.equal('ObjectPattern');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept array pattern', () => {
        var assignment = parseAndGetExpression('[x] = (y)');
        expect(assignment.operator).to.equal('=');
        expect(assignment.left.type).to.equal('ArrayPattern');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept =', () => {
        var assignment = parseAndGetExpression('x = y');
        expect(assignment.operator).to.equal('=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept +=', () => {
        var assignment = parseAndGetExpression('x += y');
        expect(assignment.operator).to.equal('+=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept -=', () => {
        var assignment = parseAndGetExpression('x -= y');
        expect(assignment.operator).to.equal('-=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept *=', () => {
        var assignment = parseAndGetExpression('x *= y');
        expect(assignment.operator).to.equal('*=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept /=', () => {
        var assignment = parseAndGetExpression('x /= y');
        expect(assignment.operator).to.equal('/=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept %=', () => {
        var assignment = parseAndGetExpression('x %= y');
        expect(assignment.operator).to.equal('%=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept <<=', () => {
        var assignment = parseAndGetExpression('x <<= y');
        expect(assignment.operator).to.equal('<<=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept >>=', () => {
        var assignment = parseAndGetExpression('x >>= y');
        expect(assignment.operator).to.equal('>>=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept >>>=', () => {
        var assignment = parseAndGetExpression('x >>>= y');
        expect(assignment.operator).to.equal('>>>=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept |=', () => {
        var assignment = parseAndGetExpression('x |= y');
        expect(assignment.operator).to.equal('|=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept |=', () => {
        var assignment = parseAndGetExpression('x |= y');
        expect(assignment.operator).to.equal('|=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept ^=', () => {
        var assignment = parseAndGetExpression('x ^= y');
        expect(assignment.operator).to.equal('^=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept &=', () => {
        var assignment = parseAndGetExpression('x &= y');
        expect(assignment.operator).to.equal('&=');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });
});
