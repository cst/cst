import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('UpdateExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('y++').type).to.equal('UpdateExpression');
    });

    it('should accept parentheses for postfix', () => {
        let assignment = parseAndGetExpression('( x ) ++');
        expect(assignment.operator).to.equal('++');
        expect(assignment.argument.name).to.equal('x');
        expect(assignment.prefix).to.equal(false);
    });

    it('should accept parentheses for prefix', () => {
        let assignment = parseAndGetExpression('++ ( x )');
        expect(assignment.operator).to.equal('++');
        expect(assignment.argument.name).to.equal('x');
        expect(assignment.prefix).to.equal(true);
    });

    it('should accept prefix --', () => {
        let assignment = parseAndGetExpression('--x');
        expect(assignment.operator).to.equal('--');
        expect(assignment.argument.name).to.equal('x');
        expect(assignment.prefix).to.equal(true);
    });

    it('should accept prefix ++', () => {
        let assignment = parseAndGetExpression('++x');
        expect(assignment.operator).to.equal('++');
        expect(assignment.argument.name).to.equal('x');
        expect(assignment.prefix).to.equal(true);
    });

    it('should accept postfix --', () => {
        let assignment = parseAndGetExpression('x--');
        expect(assignment.operator).to.equal('--');
        expect(assignment.argument.name).to.equal('x');
        expect(assignment.prefix).to.equal(false);
    });

    it('should accept postfix ++', () => {
        let assignment = parseAndGetExpression('x++');
        expect(assignment.operator).to.equal('++');
        expect(assignment.argument.name).to.equal('x');
        expect(assignment.prefix).to.equal(false);
    });
});
