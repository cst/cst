import Element from '../../../src/elements/Element';
import Fragment from '../../../src/elements/Fragment';
import Token from '../../../src/elements/Token';
import {assertChildren, validateStructure} from '../../utils';

describe('Element::insertChildBefore', () => {
    it('should insert token before first token', () => {
        let token1 = new Token('Punctuator', '(');
        let token2 = new Token('Punctuator', ')');

        let parent = new Element('CustomElement', [token1]);
        parent.insertChildBefore(token2, token1);

        assertChildren(parent, [token2, token1]);
        validateStructure(parent);
    });

    it('should insert token before a token', () => {
        let token1 = new Token('Punctuator', '(');
        let token2 = new Token('Punctuator', '!');
        let token3 = new Token('Punctuator', ')');
        let parent = new Element('CustomElement', [token1, token2]);

        parent.insertChildBefore(token3, token2);

        assertChildren(parent, [token1, token3, token2]);
        validateStructure(parent);
    });

    it('should insert element before element', () => {
        let token1 = new Token('Punctuator', '(');
        let element1 = new Element('CustomElement', [token1]);

        let token2 = new Token('Punctuator', ')');
        let element2 = new Element('CustomElement', [token2]);

        let parent = new Element('CustomElement', [element1]);
        parent.insertChildBefore(element2, element1);

        assertChildren(parent, [element2, element1]);
        assertChildren(element1, [token1]);
        assertChildren(element2, [token2]);
        validateStructure(parent);
    });

    it('should insert fragment before element', () => {
        let token1 = new Token('Punctuator', '(');
        let element1 = new Element('CustomElement', [token1]);

        let token2 = new Token('Punctuator', ')');
        let element2 = new Element('CustomElement', [token2]);

        let parentToken = new Token('Punctuator', '+');
        let parent = new Element('CustomElement', [parentToken]);

        parent.insertChildBefore(new Fragment([element1, element2]), parentToken);

        assertChildren(parent, [element1, element2, parentToken]);
        assertChildren(element1, [token1]);
        assertChildren(element2, [token2]);
        validateStructure(parent);
    });
});

