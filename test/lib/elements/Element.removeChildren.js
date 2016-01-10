import Element from '../../../src/elements/Element';
import Fragment from '../../../src/elements/Fragment';
import Token from '../../../src/elements/Token';
import {assertChildren, validateStructure} from '../../utils';

describe('Element::replaceChildren', () => {
    it('should remove single token', () => {
        let token1 = new Token('Punctuator', '(');

        let parent = new Element('CustomElement', [token1]);
        parent.removeChildren(token1, token1);

        assertChildren(parent, []);
        validateStructure(parent);
    });

    it('should remove one token in the middle', () => {
        let token1 = new Token('Punctuator', '(');
        let token2 = new Token('Punctuator', '?');
        let token3 = new Token('Punctuator', ')');
        let parent = new Element('CustomElement', [token1, token2, token3]);

        parent.removeChildren(token2, token2);

        assertChildren(parent, [token1, token3]);
        validateStructure(parent);
    });

    it('should remove one token in the beginning', () => {
        let token1 = new Token('Punctuator', '(');
        let token2 = new Token('Punctuator', '?');
        let token3 = new Token('Punctuator', ')');
        let parent = new Element('CustomElement', [token1, token2, token3]);

        parent.removeChildren(token1, token1);

        assertChildren(parent, [token2, token3]);
        validateStructure(parent);
    });

    it('should remove one token in the end', () => {
        let token1 = new Token('Punctuator', '(');
        let token2 = new Token('Punctuator', '?');
        let token3 = new Token('Punctuator', ')');
        let parent = new Element('CustomElement', [token1, token2, token3]);

        parent.removeChildren(token3, token3);

        assertChildren(parent, [token1, token2]);
        validateStructure(parent);
    });

    it('should remove several tokens in the middle', () => {
        let token1 = new Token('Numeric', '1');
        let token2 = new Token('Numeric', '2');
        let token3 = new Token('Numeric', '3');
        let token4 = new Token('Numeric', '4');
        let token5 = new Token('Numeric', '5');
        let parent = new Element('CustomElement', [token1, token2, token3, token4, token5]);

        parent.removeChildren(token2, token4);

        assertChildren(parent, [token1, token5]);
        validateStructure(parent);
    });
});

