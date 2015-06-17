import ElementAssert from './ElementAssert';
import ElementList from './ElementList';

/**
 * @class
 * @name Element
 */
export default class Element {
    constructor(type, children) {
        this._type = type;

        this._onAbandon();

        this._firstToken = null;
        this._lastToken = null;

        this._initChildren(children);

        this._children = children;
    }

    get type() {
        return this._type;
    }

    get parentElement() {
        return this._parentElement;
    }

    get nextSibling() {
        return this._nextSibling;
    }

    get previousSibling() {
        return this._previousSibling;
    }

    get nextToken() {
        return this._nextToken;
    }

    get previousToken() {
        return this._previousToken;
    }

    get firstToken() {
        return this._firstToken;
    }

    get lastToken() {
        return this._lastToken;
    }

    get firstElement() {
        return this._childElements[0] || null;
    }

    get lastElement() {
        return this._childElements[this._childElements.length - 1] || null;
    }

    get sourceCodeLength() {
        let length = 0;
        for (let child of this._children) {
            length += child.codeLength;
        }
        return length;
    }

    get sourceCode() {
        let code = '';
        for (let child of this._children) {
            code += child.sourceCode;
        }
        return code;
    }

    get isExpression() {
        return false;
    }

    get isStatement() {
        return false;
    }

    get isToken() {
        return false;
    }

    get isWhitespace() {
        return false;
    }

    get isComment() {
        return false;
    }

    get isPattern() {
        return false;
    }

    get isAssignable() {
        return false;
    }

    get isNode() {
        return false;
    }

    get childElements() {
        return this._childElements;
    }

    _setChildren(newChildren) {
        this._acceptChildren(new ElementAssert(newChildren));
        this._children = newChildren;
        this._childElements = new ElementList(newChildren);
    }

    /**
     * @param {Element[]} children
     * @abstract
     */
    _acceptChildren(children) {
        // Override
    }

    appendChildren(childNodes) {
        this._insertChildren(childNodes, this._children.length);
    }

    prependChildren(childNodes) {
        this._insertChildren(childNodes, 0);
    }

    replaceChildren(newElements, referenceElement, replaceCount) {
        let elementIndex = this._children.indexOf(referenceElement);

        if (elementIndex === -1) {
            throw new Error('Reference element was not found.');
        }

        this._insertChildren(newElements, elementIndex, true, replaceCount);
    }

    insertChildrenBefore(newElements, referenceElement) {
        let elementIndex = this._children.indexOf(referenceElement);

        if (elementIndex === -1) {
            throw new Error('Reference element was not found.');
        }

        this._insertChildren(newElements, elementIndex);
    }

    insertChildrenAfter(newElements, referenceElement) {
        if (referenceElement.parentElement !== this) {
            throw new Error('Reference element was not found.');
        }

        var nextElement = referenceElement.nextSibling;

        if (nextElement) {
            this.insertChildrenAfter(newElements, nextElement);
        } else {
            this.appendChildren(newElements);
        }
    }

    _initChildren(childElements) {
        this._insertChildren(childElements, 0);
    }

    _insertChildren(newElements, position, replace, replaceCount) {
        let elementsBefore;
        let elementsAfter;
        let elementBefore;
        let elementAfter;
        let newChildren;
        if (this._children) {
            elementsBefore = this._children.slice(0, position);
            elementsAfter = this._children.slice(replace ? position + replaceCount : position);
            elementBefore = elementsBefore[elementsBefore.length - 1];
            elementAfter = elementsAfter[0];
            newChildren = elementsBefore.concat(newElements, elementsAfter);
        } else {
            newChildren = newElements;
        }

        this._setChildren(newChildren);

        let firstElement = newElements[0];
        let lastElement = newElements[newElements.length - 1];

        if (newElements.length > 0) {
            if (!elementBefore) {
                this._firstToken = firstElement.firstToken;
            }

            if (!elementAfter) {
                this._lastToken = lastElement.lastToken;
            }

            for (let i = 0; i < newElements.length; i++) {
                let element = newElements[i];
                let previousSibling = newElements[i - 1] || elementBefore || null;
                let nextSibling = newElements[i + 1] || elementAfter || null;
                let nextToken = (nextSibling ? nextSibling.firstToken : this._nextToken) || null;
                let previousToken = (previousSibling ? previousSibling.lastToken : this._previousToken) || null;

                element._onAdopt(this, nextSibling, previousSibling, nextToken, previousToken);
            }
        }

        if (elementBefore) {
            let next = firstElement || elementAfter || null;
            elementBefore._nextSibling = next;
            elementBefore._nextToken = next ? next._firstToken : this._nextToken;
        }

        if (elementAfter) {
            let previous = lastElement || elementBefore || null;
            elementAfter._previousSibling = previous;
            elementAfter._previousToken = previous ? previous._lastToken : this._previousToken;
        }
    }

    _onAdopt(parentElement, nextSibling, previousSibling, nextToken, previousToken) {
        this._parentElement = parentElement;
        this._nextSibling = nextSibling;
        this._previousSibling = previousSibling;
        this._nextToken = nextToken;
        this._previousToken = previousToken;
    }

    _onAbandon() {
        this._parentElement = null;
        this._nextSibling = null;
        this._previousSibling = null;
        this._nextToken = null;
        this._previousToken = null;
    }
}

