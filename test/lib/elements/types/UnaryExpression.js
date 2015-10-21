import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('UnaryExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('-y').type).to.equal('UnaryExpression');
    });

    it('should accept parentheses', () => {
        var assignment = parseAndGetExpression('- ( x )');
        expect(assignment.operator).to.equal('-');
        expect(assignment.argument.name).to.equal('x');
    });

    it('should accept -', () => {
        var assignment = parseAndGetExpression('-x');
        expect(assignment.operator).to.equal('-');
        expect(assignment.argument.name).to.equal('x');
    });

    it('should accept +', () => {
        var assignment = parseAndGetExpression('+x');
        expect(assignment.operator).to.equal('+');
        expect(assignment.argument.name).to.equal('x');
    });

    it('should accept !', () => {
        var assignment = parseAndGetExpression('!x');
        expect(assignment.operator).to.equal('!');
        expect(assignment.argument.name).to.equal('x');
    });

    it('should accept ~', () => {
        var assignment = parseAndGetExpression('~x');
        expect(assignment.operator).to.equal('~');
        expect(assignment.argument.name).to.equal('x');
    });

    it('should accept void', () => {
        var assignment = parseAndGetExpression('void x');
        expect(assignment.operator).to.equal('void');
        expect(assignment.argument.name).to.equal('x');
    });

    it('should accept delete', () => {
        var assignment = parseAndGetExpression('delete x', {strictMode: false});
        expect(assignment.operator).to.equal('delete');
        expect(assignment.argument.name).to.equal('x');
    });
});
