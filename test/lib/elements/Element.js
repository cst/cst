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

    describe('appendChildren', () => {
        it('should assign tokens to empty element', () => {
            let token = new Token('Punctuator', '(');

            let element = new Element('CustomElement', []);
            element.appendChildren([token]);
            expect(element.childElements.length).to.equal(1);
            expect(element.childElements[0]).to.equal(token);
            expect(token.previousSibling).to.equal(null);
            expect(token.nextSibling).to.equal(null);
            expect(token.previousToken).to.equal(null);
            expect(token.nextToken).to.equal(null);
            expect(element.firstToken).to.equal(token);
            expect(element.lastToken).to.equal(token);
            expect(element.firstElement).to.equal(token);
            expect(element.lastElement).to.equal(token);
            expect(token.parentElement).to.equal(element);
        });

        it('should assign nodes to empty element', () => {
            let token = new Token('Punctuator', '(');

            let subElement = new Element('CustomElement', [token]);
            expect(subElement.firstToken).to.equal(token);
            expect(subElement.lastToken).to.equal(token);

            let element = new Element('CustomElement', []);
            element.appendChildren([subElement]);
            expect(element.childElements.length).to.equal(1);
            expect(element.childElements[0]).to.equal(subElement);
            expect(subElement.previousSibling).to.equal(null);
            expect(subElement.nextSibling).to.equal(null);
            expect(subElement.previousToken).to.equal(null);
            expect(subElement.nextToken).to.equal(null);
            expect(element.firstToken).to.equal(token);
            expect(element.lastToken).to.equal(token);
            expect(element.firstElement).to.equal(subElement);
            expect(element.lastElement).to.equal(subElement);
        });

        it('should append tokens', () => {
            var token1 = new Token('Punctuator', '(');
            let element = new Element('CustomElement', [token1]);

            let token2 = new Token('Punctuator', ')');

            element.appendChildren([token2]);

            expect(element.childElements.length).to.equal(2);
            expect(element.childElements[0]).to.equal(token1);
            expect(element.childElements[1]).to.equal(token2);

            expect(token2.previousSibling).to.equal(token1);
            expect(token2.nextSibling).to.equal(null);
            expect(token2.previousToken).to.equal(token1);
            expect(token2.nextToken).to.equal(null);

            expect(token1.previousSibling).to.equal(null);
            expect(token1.nextSibling).to.equal(token2);
            expect(token1.previousToken).to.equal(null);
            expect(token1.nextToken).to.equal(token2);

            expect(element.firstToken).to.equal(token1);
            expect(element.lastToken).to.equal(token2);
            expect(element.firstElement).to.equal(token1);
            expect(element.lastElement).to.equal(token2);

            expect(token1.parentElement).to.equal(element);
            expect(token2.parentElement).to.equal(element);
        });
    });
});
