import Element from '../../../src/elements/Element';
import Fragment from '../../../src/elements/Fragment';
import Token from '../../../src/elements/Token';
import {assertChildren, validateStructure} from '../../utils';

describe('Element::appendChild', () => {
    it('should assign tokens to empty element', () => {
        let token = new Token('Punctuator', '(');

        let parent = new Element('CustomElement', []);
        parent.appendChild(token);

        assertChildren(parent, [token]);
        validateStructure(parent);
    });

    it('should assign elements to empty element', () => {
        let token = new Token('Punctuator', '(');
        let element = new Element('CustomElement', [token]);

        let parent = new Element('CustomElement', []);
        parent.appendChild(element);

        assertChildren(parent, [element]);
        assertChildren(element, [token]);
        validateStructure(parent);
    });

    it('should append tokens', () => {
        let token1 = new Token('Punctuator', '(');
        let token2 = new Token('Punctuator', ')');

        let parent = new Element('CustomElement', [token1]);
        parent.appendChild(token2);

        assertChildren(parent, [token1, token2]);
        validateStructure(parent);
    });

    it('should append element after token', () => {
        let token1 = new Token('Punctuator', '(');
        let token2 = new Token('Punctuator', ')');
        let element = new Element('CustomElement', [token2]);

        let parent = new Element('CustomElement', [token1]);
        parent.appendChild(element);

        assertChildren(parent, [token1, element]);
        assertChildren(element, [token2]);
        validateStructure(parent);
    });

    it('should append element after element', () => {
        let token1 = new Token('Punctuator', '(');
        let element1 = new Element('CustomElement', [token1]);

        let token2 = new Token('Punctuator', ')');
        let element2 = new Element('CustomElement', [token2]);

        let parent = new Element('CustomElement', [element1]);
        parent.appendChild(element2);

        assertChildren(parent, [element1, element2]);
        assertChildren(element1, [token1]);
        assertChildren(element2, [token2]);
        validateStructure(parent);
    });

    it('should append fragment after element', () => {
        let token1 = new Token('Punctuator', '(');
        let element1 = new Element('CustomElement', [token1]);

        let token2 = new Token('Punctuator', ')');
        let element2 = new Element('CustomElement', [token2]);

        let parentToken = new Token('Punctuator', '+');
        let parent = new Element('CustomElement', [parentToken]);

        parent.appendChild(new Fragment([element1, element2]));

        assertChildren(parent, [parentToken, element1, element2]);
        assertChildren(element1, [token1]);
        assertChildren(element2, [token2]);
        validateStructure(parent);
    });
});

