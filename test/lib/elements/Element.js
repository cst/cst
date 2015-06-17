import Element from '../../../lib/elements/Element';
import Token from '../../../lib/elements/Token';
import {expect} from 'chai';

describe('Element', () => {
    describe('constructor()', () => {
        it('should accept token', () => {
            let token = new Token('Punctuator', '(');
            let element = new Element('CustomElement', [token]);
            expect(element.firstToken).to.equal(token);
            expect(element.lastToken).to.equal(token);
        });
    });

    describe('appendChild', () => {
        it('should assign tokens to empty element', () => {
            let token = new Token('Punctuator', '(');

            let parent = new Element('CustomElement', []);
            parent.appendChild(token);
            expect(parent.childElements.length).to.equal(1);
            expect(parent.childElements[0]).to.equal(token);
            expect(token.previousSibling).to.equal(null);
            expect(token.nextSibling).to.equal(null);
            expect(token.previousToken).to.equal(null);
            expect(token.nextToken).to.equal(null);
            expect(parent.firstToken).to.equal(token);
            expect(parent.lastToken).to.equal(token);
            expect(parent.firstChild).to.equal(token);
            expect(parent.lastChild).to.equal(token);
            expect(token.parentElement).to.equal(parent);
        });

        it('should assign nodes to empty element', () => {
            let token = new Token('Punctuator', '(');

            let element = new Element('CustomElement', [token]);
            expect(element.firstToken).to.equal(token);
            expect(element.lastToken).to.equal(token);

            let parent = new Element('CustomElement', []);
            parent.appendChild(element);
            expect(parent.childElements.length).to.equal(1);
            expect(parent.childElements[0]).to.equal(element);
            expect(element.previousSibling).to.equal(null);
            expect(element.nextSibling).to.equal(null);
            expect(element.previousToken).to.equal(null);
            expect(element.nextToken).to.equal(null);
            expect(parent.firstToken).to.equal(token);
            expect(parent.lastToken).to.equal(token);
            expect(parent.firstChild).to.equal(element);
            expect(parent.lastChild).to.equal(element);
        });

        it('should append tokens', () => {
            var token1 = new Token('Punctuator', '(');
            let parent = new Element('CustomElement', [token1]);

            let token2 = new Token('Punctuator', ')');

            parent.appendChild(token2);

            expect(parent.childElements.length).to.equal(2);
            expect(parent.childElements[0]).to.equal(token1);
            expect(parent.childElements[1]).to.equal(token2);

            expect(token1.previousSibling).to.equal(null);
            expect(token1.nextSibling).to.equal(token2);
            expect(token1.previousToken).to.equal(null);
            expect(token1.nextToken).to.equal(token2);

            expect(token2.previousSibling).to.equal(token1);
            expect(token2.nextSibling).to.equal(null);
            expect(token2.previousToken).to.equal(token1);
            expect(token2.nextToken).to.equal(null);

            expect(parent.firstToken).to.equal(token1);
            expect(parent.lastToken).to.equal(token2);
            expect(parent.firstChild).to.equal(token1);
            expect(parent.lastChild).to.equal(token2);

            expect(token1.parentElement).to.equal(parent);
            expect(token2.parentElement).to.equal(parent);
        });

        it('should append element after token', () => {
            var token1 = new Token('Punctuator', '(');
            let parent = new Element('CustomElement', [token1]);

            let token2 = new Token('Punctuator', ')');
            let element = new Element('CustomElement', [token2]);

            parent.appendChild(element);

            expect(parent.childElements.length).to.equal(2);
            expect(parent.childElements[0]).to.equal(token1);
            expect(parent.childElements[1]).to.equal(element);

            expect(token1.previousSibling).to.equal(null);
            expect(token1.nextSibling).to.equal(element);
            expect(token1.previousToken).to.equal(null);
            expect(token1.nextToken).to.equal(token2);

            expect(token2.previousSibling).to.equal(null);
            expect(token2.nextSibling).to.equal(null);
            expect(token2.previousToken).to.equal(token1);
            expect(token2.nextToken).to.equal(null);

            expect(element.previousSibling).to.equal(token1);
            expect(element.nextSibling).to.equal(null);
            expect(element.previousToken).to.equal(token1);
            expect(element.nextToken).to.equal(null);

            expect(parent.firstToken).to.equal(token1);
            expect(parent.lastToken).to.equal(token2);
            expect(parent.firstChild).to.equal(token1);
            expect(parent.lastChild).to.equal(element);

            expect(token1.parentElement).to.equal(parent);
            expect(token2.parentElement).to.equal(element);
        });

        it('should append element after element', () => {
            var token1 = new Token('Punctuator', '(');
            let element1 = new Element('CustomElement', [token1]);

            let token2 = new Token('Punctuator', ')');
            let element2 = new Element('CustomElement', [token2]);

            let parent = new Element('CustomElement', [element1]);

            parent.appendChild(element2);

            expect(parent.childElements.length).to.equal(2);
            expect(parent.childElements[0]).to.equal(element1);
            expect(parent.childElements[1]).to.equal(element2);

            expect(element1.previousSibling).to.equal(null);
            expect(element1.nextSibling).to.equal(element2);
            expect(element1.previousToken).to.equal(null);
            expect(element1.nextToken).to.equal(token2);

            expect(element2.previousSibling).to.equal(element1);
            expect(element2.nextSibling).to.equal(null);
            expect(element2.previousToken).to.equal(token1);
            expect(element2.nextToken).to.equal(null);

            expect(token1.previousSibling).to.equal(null);
            expect(token1.nextSibling).to.equal(null);
            expect(token1.previousToken).to.equal(null);
            expect(token1.nextToken).to.equal(token2);

            expect(token2.previousSibling).to.equal(null);
            expect(token2.nextSibling).to.equal(null);
            expect(token2.previousToken).to.equal(token1);
            expect(token2.nextToken).to.equal(null);

            expect(parent.firstToken).to.equal(token1);
            expect(parent.lastToken).to.equal(token2);
            expect(parent.firstChild).to.equal(element1);
            expect(parent.lastChild).to.equal(element2);

            expect(token1.parentElement).to.equal(element1);
            expect(token2.parentElement).to.equal(element2);
        });
    });
});
