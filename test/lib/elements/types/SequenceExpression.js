import {parseAndGetExpression} from '../../../utils';
import {expect} from 'chai';

describe('SequenceExpression', () => {
    it('should return correct type', () => {
        expect(parseAndGetExpression('1,2').type).to.equal('SequenceExpression');
    });

    it('should accept two items', () => {
        let expression = parseAndGetExpression('1 , 2');
        expect(expression.type).to.equal('SequenceExpression');
        expect(expression.expressions[0].value).to.equal(1);
        expect(expression.expressions[1].value).to.equal(2);
    });

    it('should accept parentheses', () => {
        let expression = parseAndGetExpression('( 1 ) , ( 2 )');
        expect(expression.type).to.equal('SequenceExpression');
        expect(expression.expressions[0].value).to.equal(1);
        expect(expression.expressions[1].value).to.equal(2);
    });

    it('should accept more items', () => {
        let expression = parseAndGetExpression('1 , 2 , x , y');
        expect(expression.type).to.equal('SequenceExpression');
        expect(expression.expressions[0].value).to.equal(1);
        expect(expression.expressions[1].value).to.equal(2);
        expect(expression.expressions[2].name).to.equal('x');
        expect(expression.expressions[3].name).to.equal('y');
    });
});
