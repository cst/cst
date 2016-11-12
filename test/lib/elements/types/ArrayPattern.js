import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('ArrayPattern', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('[x] = [1]').left.type).to.equal('ArrayPattern');
    });

    it('should accept empty pattern', () => {
        let assignment = parseAndGetExpression('[] = [1]');
        let pattern = assignment.left;
        expect(pattern.elements.length).to.equal(0);
    });

    it('should accept 1-element array', () => {
        let assignment = parseAndGetExpression('[ x ] = [ 1 ]');
        let pattern = assignment.left;
        expect(pattern.elements.length).to.equal(1);
        expect(pattern.elements[0].type).to.equal('Identifier');
    });

    it('should accept multiple elements array', () => {
        let assignment = parseAndGetExpression('[ x , y ] = [1]');
        let pattern = assignment.left;
        expect(pattern.elements.length).to.equal(2);
        expect(pattern.elements[0].type).to.equal('Identifier');
        expect(pattern.elements[0].name).to.equal('x');
        expect(pattern.elements[1].type).to.equal('Identifier');
        expect(pattern.elements[1].name).to.equal('y');
    });

    it('should accept nested pattern', () => {
        let assignment = parseAndGetExpression('[ {x , y} ] = [1]');
        let pattern = assignment.left;
        expect(pattern.elements.length).to.equal(1);
        expect(pattern.elements[0].type).to.equal('ObjectPattern');
    });

    it('should accept nested member expression', () => {
        let assignment = parseAndGetExpression('[ g.x ] = [1]');
        let pattern = assignment.left;
        expect(pattern.elements.length).to.equal(1);
        expect(pattern.elements[0].type).to.equal('MemberExpression');
        expect(pattern.elements[0].object.name).to.equal('g');
        expect(pattern.elements[0].property.name).to.equal('x');
    });

    it('should accept holes', () => {
        let assignment = parseAndGetExpression('[ , x , , y , , ] = [1]');
        let pattern = assignment.left;
        expect(pattern.elements.length).to.equal(5);
        expect(pattern.elements[0]).to.equal(null);
        expect(pattern.elements[1].type).to.equal('Identifier');
        expect(pattern.elements[2]).to.equal(null);
        expect(pattern.elements[3].type).to.equal('Identifier');
        expect(pattern.elements[4]).to.equal(null);
    });

    it('should accept holes-only', () => {
        let assignment = parseAndGetExpression('[,,,] = [1]');
        let pattern = assignment.left;
        expect(pattern.elements.length).to.equal(3);
        expect(pattern.elements[0]).to.equal(null);
        expect(pattern.elements[1]).to.equal(null);
    });
});
