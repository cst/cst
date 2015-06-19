import ElementAssert from './ElementAssert';
import ElementList from './ElementList';

/**
 * @class
 * @name Element
 */
export default class Element {
    constructor(type, children) {
        this._type = type;

        this._firstChild = null;
        this._lastChild = null;
        this._parentElement = null;
        this._nextSibling = null;
        this._previousSibling = null;
        this._childElements = null;
        this._childCount = 0;

        if (children) {
            this._setChildren(children);
        }
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
        if (this._nextSibling) {
            return this._nextSibling.firstToken;
        }

        if (this._parentElement) {
            return this._parentElement.nextToken;
        }

        return null;
    }

    get previousToken() {
        if (this._previousSibling) {
            return this._previousSibling.firstToken;
        }

        if (this._parentElement) {
            return this._parentElement.previousToken;
        }

        return null;
    }

    get previousCodeToken() {
        let token = this.previousToken;
        while (token && (token.isWhitespace || token.isComment)) {
            token = token.previousToken;
        }
        return token;
    }

    get nextCodeToken() {
        let token = this.nextToken;
        while (token && (token.isWhitespace || token.isComment)) {
            token = token.nextToken;
        }
        return token;
    }

    get firstToken() {
        let element = this._firstChild;
        while (element && !element.isToken) {
            element = element._firstChild;
        }
        return element;
    }

    get lastToken() {
        let element = this._lastChild;
        while (element && !element.isToken) {
            element = element._lastChild;
        }
        return element;
    }

    get firstChild() {
        return this._firstChild;
    }

    get lastChild() {
        return this._lastChild;
    }

    get sourceCodeLength() {
        let length = 0;
        let child = this._firstChild;
        while (child) {
            length += child.sourceCodeLength;
            child = child._nextSibling;
        }
        return length;
    }

    get sourceCode() {
        let code = '';
        let child = this._firstChild;
        while (child) {
            code += child.sourceCode;
            child = child._nextSibling;
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

    get isFragment() {
        return false;
    }

    get childElements() {
        if (!this._childElements) {
            let childArray = new Array(this._childCount);
            fillWithLinkedList(this._firstChild, childArray, 0);
            this._childElements = new ElementList(childArray);
        }
        return this._childElements;
    }

    get childCount() {
        return this._childCount;
    }

    _setChildren(newChildren) {
        this._acceptChildren(new ElementAssert(newChildren));

        for (let i = 0; i < newChildren.length; i++) {
            let child = newChildren[i];
            if (child._parentElement !== this) {
                if (child._parentElement) {
                    child._parentElement.removeChild(child);
                }
                child._parentElement = this;
            }
            child._previousSibling = newChildren[i - 1] || null;
            child._nextSibling = newChildren[i + 1] || null;
        }

        this._childCount = newChildren.length;
        this._firstChild = newChildren[0] || null;
        this._lastChild = newChildren[newChildren.length - 1] || null;
        this._childElements = null;
    }

    /**
     * @param {Element[]} children
     * @abstract
     */
    _acceptChildren(children) {
        // Override
    }

    removeChild(child) {
        if (child._parentElement !== this) {
            throw new Error('The element to be removed is not a child of this element.');
        }

        if (child._previousSibling) {
            child._previousSibling._nextSibling = child._nextSibling;
        } else {
            this._firstChild = child._nextSibling;
        }

        if (child._nextSibling) {
            child._nextSibling._previousSibling = child._previousSibling;
        } else {
            this._lastChild = child._previousSibling;
        }

        child._parentElement = null;

        this._childCount--;
    }

    appendChild(child) {
        let newChildren;
        if (child.isFragment) {
            newChildren = new Array(this._childCount + child._childCount);
            fillWithLinkedList(this._firstChild, newChildren, 0);
            fillWithLinkedList(child._firstChild, newChildren, this._childCount);
        } else {
            if (child._parentElement === this) {
                newChildren = new Array(this._childCount);
                fillWithLinkedListWithException(this._firstChild, newChildren, 0, child);
            } else {
                this._ensureCanAdopt(child);
                newChildren = new Array(this._childCount + 1);
                fillWithLinkedList(this._firstChild, newChildren, 0);
            }
            newChildren[newChildren.length - 1] = child;
        }

        this._setChildren(newChildren);
    }

    prependChild(child) {
        let newChildren;
        if (child.isFragment) {
            newChildren = new Array(this._childCount + child._childCount);
            fillWithLinkedList(child._firstChild, newChildren, 0);
            fillWithLinkedList(this._firstChild, newChildren, child._childCount);
        } else {
            if (child._parentElement === this) {
                newChildren = new Array(this._childCount);
                fillWithLinkedListWithException(this._firstChild, newChildren, 1, child);
            } else {
                this._ensureCanAdopt(child);
                newChildren = new Array(this._childCount + 1);
                fillWithLinkedList(this._firstChild, newChildren, 1);
            }
            newChildren[0] = child;
        }

        this._setChildren(newChildren);
    }

    _ensureCanAdopt(child) {
        let element = this;
        while (element) {
            if (element === child) {
                throw new Error('The new child element contains the parent.');
            }
            element = element._parentElement;
        }
    }

    replaceChildren(child, firstRefChild, lastRefChild) {
        let replacedChildren = this.getChildrenBetween(firstRefChild, lastRefChild);
        let replacedLength = replacedChildren.length;

        let newChildren;
        if (child.isFragment) {
            newChildren = new Array((this._childCount - replacedLength) + child._childCount);
            let pos = fillWithLinkedListUntil(this._firstChild, newChildren, 0, firstRefChild);
            fillWithLinkedList(child._firstChild, newChildren, pos);
            if (lastRefChild._nextSibling) {
                fillWithLinkedList(lastRefChild._nextSibling, newChildren, pos + child._childCount);
            }
        } else {
            if (child._parentElement === this) {
                newChildren = new Array(this._childCount - replacedLength);
                let pos = fillWithLinkedListUntilWithException(this._firstChild, newChildren, 0, firstRefChild, child);
                newChildren[pos] = child;
                if (lastRefChild._nextSibling) {
                    fillWithLinkedListWithException(lastRefChild._nextSibling, newChildren, pos + 1, child);
                }
            } else {
                newChildren = new Array(this._childCount - replacedLength + 1);
                let pos = fillWithLinkedListUntil(this._firstChild, newChildren, 0, firstRefChild);
                newChildren[pos] = child;
                if (lastRefChild._nextSibling) {
                    fillWithLinkedList(lastRefChild._nextSibling, newChildren, pos + 1);
                }
            }
        }

        this._setChildren(newChildren);

        for (let replacedChild of replacedChildren) {
            if (replacedChild !== child) {
                replacedChild._parentElement = null;
            }
        }
    }

    insertChildBefore(child, referenceChild) {
        if (referenceChild._parentElement !== this) {
            throw new Error('Invalid reference child');
        }

        let newChildren;
        if (child.isFragment) {
            newChildren = new Array(this._childCount + child._childCount);
            let pos = fillWithLinkedListUntil(this._firstChild, newChildren, 0, referenceChild);
            fillWithLinkedList(child._firstChild, newChildren, pos);
            fillWithLinkedList(referenceChild, newChildren, pos + child._childCount);
        } else {
            if (child._parentElement === this) {
                newChildren = new Array(this._childCount);
                let pos = fillWithLinkedListUntilWithException(this._firstChild, newChildren, 0, referenceChild, child);
                newChildren[pos] = child;
                fillWithLinkedListWithException(referenceChild, newChildren, pos + 1, child);
            } else {
                newChildren = new Array(this._childCount + 1);
                let pos = fillWithLinkedListUntil(this._firstChild, newChildren, 0, referenceChild);
                newChildren[pos] = child;
                fillWithLinkedList(referenceChild, newChildren, pos + 1);
            }
        }

        this._setChildren(newChildren);
    }

    getChildrenBetween(firstRefChild, lastRefChild) {
        if (!firstRefChild || firstRefChild._parentElement !== this) {
            throw new Error('Invalid first reference child');
        }

        if (!lastRefChild || lastRefChild._parentElement !== this) {
            throw new Error('Invalid last reference child');
        }

        let currentChild = firstRefChild;
        let result = [];
        while (true) {
            if (!currentChild) {
                throw new Error('Invalid reference children order');
            }
            result.push(currentChild);
            if (currentChild === lastRefChild) {
                break;
            }
            currentChild = currentChild._nextSibling;
        }

        return result;
    }
}

function fillWithLinkedList(list, array, offset) {
    let item = list;
    while (item) {
        array[offset] = item;
        offset++;
        item = item._nextSibling;
    }
}

function fillWithLinkedListWithException(list, array, offset, exception) {
    let item = list;
    while (item) {
        if (item !== exception) {
            array[offset] = item;
            offset++;
        }
        item = item._nextSibling;
    }
}

function fillWithLinkedListUntilWithException(list, array, offset, referenceElement, exception) {
    let item = list;
    while (item) {
        if (item === referenceElement) {
            return offset;
        }
        if (item !== exception) {
            array[offset] = item;
            offset++;
        }
        item = item._nextSibling;
    }
    return -1;
}

function fillWithLinkedListUntil(list, array, offset, referenceElement) {
    let item = list;
    while (item) {
        if (item === referenceElement) {
            return offset;
        }
        array[offset] = item;
        offset++;
        item = item._nextSibling;
    }
    throw new Error('Reference element was not found.');
}
