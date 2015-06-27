import Element from '../../../lib/elements/Element';
import Fragment from '../../../lib/elements/Fragment';
import Token from '../../../lib/elements/Token';
import {assertChildren, validateStructure} from '../../utils';

describe('Element::replaceChildren', () => {
    it('should replace single token', () => {
        let token1 = new Token('Punctuator', '(');
        let token2 = new Token('Punctuator', ')');

        let parent = new Element('CustomElement', [token1]);
        parent.replaceChildren(token2, token1, token1);

        assertChildren(parent, [token2]);
        validateStructure(parent);
    });

    it('should replace one token in the middle', () => {
        let token1 = new Token('Punctuator', '(');
        let token2 = new Token('Punctuator', '?');
        let token3 = new Token('Punctuator', ')');
        let token4 = new Token('Punctuator', ':');
        let parent = new Element('CustomElement', [token1, token2, token3]);

        parent.replaceChildren(token4, token2, token2);

        assertChildren(parent, [token1, token4, token3]);
        validateStructure(parent);
    });

    it('should replace several tokens in the middle', () => {
        let token1 = new Token('Numeric', '1');
        let token2 = new Token('Numeric', '2');
        let token3 = new Token('Numeric', '3');
        let token4 = new Token('Numeric', '4');
        let token5 = new Token('Numeric', '5');
        let token6 = new Token('Numeric', '6');
        let parent = new Element('CustomElement', [token1, token2, token3, token4, token5]);

        parent.replaceChildren(token6, token2, token4);

        assertChildren(parent, [token1, token6, token5]);
        validateStructure(parent);
    });

    it('should replace using fragment', () => {
        let token1 = new Token('Numeric', '1');
        let token2 = new Token('Numeric', '2');
        let token3 = new Token('Numeric', '3');
        let token4 = new Token('Numeric', '4');
        let token5 = new Token('Numeric', '5');

        let newToken1 = new Token('Numeric', '11');
        let newToken2 = new Token('Numeric', '22');
        let newToken3 = new Token('Numeric', '33');
        let parent = new Element('CustomElement', [token1, token2, token3, token4, token5]);

        parent.replaceChildren(new Fragment([newToken1, newToken2, newToken3]), token2, token4);

        assertChildren(parent, [token1, newToken1, newToken2, newToken3, token5]);
        validateStructure(parent);
    });
});

