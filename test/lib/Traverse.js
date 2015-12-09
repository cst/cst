import Token from '../../src/elements/Token';
import Traverse from '../../src/Traverse';
import {expect} from 'chai';

describe('Traverse::selectTokensByTypeAndValue', () => {
    let tree;

    beforeEach(() => {
        let left = new Token('Punctuator', '(');
        let middle = new Token('Numeric', '1');
        let right = new Token('Punctuator', ')');

        tree = new Traverse();
        tree.addElements([left, middle, right]);
    });

    it('should iterate by types only', () => {
        expect(tree.selectTokensByTypeAndValue('Punctuator')).to.have.length(2);
    });

    it('should iterate by types and values', () => {
        expect(tree.selectTokensByTypeAndValue('Punctuator', '(')).to.have.length(1);
    });
});

