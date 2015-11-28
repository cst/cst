import Token from '../../src/elements/Token';
import Traverse from '../../src/Traverse';
import {expect} from 'chai';

describe('Traverse::selectTokensByValue', () => {
    it('should get value', () => {
        let left = new Token('Punctuator', '(');
        let middle = new Token('Numeric', '1');
        let right = new Token('Numeric', ')');

        let tree = new Traverse();
        tree.addElements([left, middle, right]);

        expect(tree.selectTokensByValue('(')).to.have.length(1);
    });
});

