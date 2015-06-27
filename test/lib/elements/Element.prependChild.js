import Element from '../../../lib/elements/Element';
import Fragment from '../../../lib/elements/Fragment';
import Token from '../../../lib/elements/Token';
import {assertChildren, validateStructure} from '../../utils';

describe('Element::prependChild', () => {
    it('should assign tokens to empty element', () => {
        let token = new Token('Punctuator', '(');

        let parent = new Element('CustomElement', []);
        parent.prependChild(token);

        assertChildren(parent, [token]);
        validateStructure(parent);
    });

    it('should assign elements to empty element', () => {
        let token = new Token('Punctuator', '(');
        let element = new Element('CustomElement', [token]);

        let parent = new Element('CustomElement', []);
        parent.prependChild(element);

        assertChildren(parent, [element]);
        assertChildren(element, [token]);
        validateStructure(parent);
    });

    it('should prepend tokens', () => {
        let token1 = new Token('Punctuator', '(');
        let token2 = new Token('Punctuator', ')');

        let parent = new Element('CustomElement', [token1]);
        parent.prependChild(token2);

        assertChildren(parent, [token2, token1]);
        validateStructure(parent);
    });

    it('should prepend element before token', () => {
        let token1 = new Token('Punctuator', '(');
        let token2 = new Token('Punctuator', ')');
        let element = new Element('CustomElement', [token2]);

        let parent = new Element('CustomElement', [token1]);
        parent.prependChild(element);

        assertChildren(parent, [element, token1]);
        assertChildren(element, [token2]);
        validateStructure(parent);
    });

    it('should prepend element before element', () => {
        let token1 = new Token('Punctuator', '(');
        let element1 = new Element('CustomElement', [token1]);

        let token2 = new Token('Punctuator', ')');
        let element2 = new Element('CustomElement', [token2]);

        let parent = new Element('CustomElement', [element1]);
        parent.prependChild(element2);

        assertChildren(parent, [element2, element1]);
        assertChildren(element1, [token1]);
        assertChildren(element2, [token2]);
        validateStructure(parent);
    });

    it('should prepend fragment before element', () => {
        let token1 = new Token('Punctuator', '(');
        let element1 = new Element('CustomElement', [token1]);

        let token2 = new Token('Punctuator', ')');
        let element2 = new Element('CustomElement', [token2]);

        let parentToken = new Token('Punctuator', '+');
        let parent = new Element('CustomElement', [parentToken]);

        parent.prependChild(new Fragment([element1, element2]));

        assertChildren(parent, [element1, element2, parentToken]);
        assertChildren(element1, [token1]);
        assertChildren(element2, [token2]);
        validateStructure(parent);
    });
});

