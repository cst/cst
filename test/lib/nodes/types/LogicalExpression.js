import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('LogicalExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('x&&y').type).to.equal('LogicalExpression');
    });

    it('should accept parentheses', () => {
        var assignment = parseAndGetExpression('(x) && (y)');
        expect(assignment.operator).to.equal('&&');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept &&', () => {
        var assignment = parseAndGetExpression('x && y');
        expect(assignment.operator).to.equal('&&');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });

    it('should accept ||', () => {
        var assignment = parseAndGetExpression('x || y');
        expect(assignment.operator).to.equal('||');
        expect(assignment.left.name).to.equal('x');
        expect(assignment.right.name).to.equal('y');
    });
});
