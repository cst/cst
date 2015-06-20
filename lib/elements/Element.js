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

    /**
     * Element type.
     * Important: some Node types also exist in Tokens. Do not rely on type only, use isToken, isNode.
     * @returns {String}
     */
    get type() {
        return this._type;
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

    // ==== Traversing =================================================================================================

    /**
     * Parent element or null if parent element does not exist.
     * @returns {Element|null}
     */
    get parentElement() {
        return this._parentElement;
    }

    /**
     * Next sibling within parent.
     * Null if element is the last child in parent or if element does not have parent.
     * @returns {Element|null}
     */
    get nextSibling() {
        return this._nextSibling;
    }

    /**
     * Previous sibling within parent.
     * Null if element is the first child in parent or if element does not have parent.
     * @returns {Element|null}
     */
    get previousSibling() {
        return this._previousSibling;
    }

    /**
     * Next token. Null if token was not foung.
     * @returns {Element|null}
     */
    get nextToken() {
        if (this._nextSibling) {
            return this._nextSibling.firstToken;
        }

        if (this._parentElement) {
            return this._parentElement.nextToken;
        }

        return null;
    }

    /**
     * Previous token. Null if token was not foung.
     * @returns {Element|null}
     */
    get previousToken() {
        if (this._previousSibling) {
            return this._previousSibling.firstToken;
        }

        if (this._parentElement) {
            return this._parentElement.previousToken;
        }

        return null;
    }

    /**
     * Next token (non-whitespace and non-comment). Null if token was not foung.
     * @returns {Element|null}
     */
    get nextCodeToken() {
        let token = this.nextToken;
        while (token && (token.isWhitespace || token.isComment)) {
            token = token.nextToken;
        }
        return token;
    }

    /**
     * Previous token (non-whitespace and non-comment). Null if token was not foung.
     * @returns {Element|null}
     */
    get previousCodeToken() {
        let token = this.previousToken;
        while (token && (token.isWhitespace || token.isComment)) {
            token = token.previousToken;
        }
        return token;
    }

    /**
     * First token inside element child tree.
     * @returns {Element|null}
     */
    get firstToken() {
        let element = this._firstChild;
        while (element && !element.isToken) {
            element = element._firstChild;
        }
        return element;
    }

    /**
     * Last token inside element child tree.
     * @returns {Element|null}
     */
    get lastToken() {
        let element = this._lastChild;
        while (element && !element.isToken) {
            element = element._lastChild;
        }
        return element;
    }

    /**
     * First child element. Null if element does not have children.
     * @returns {Element|null}
     */
    get firstChild() {
        return this._firstChild;
    }

    /**
     * Last child element. Null if element does not have children.
     * @returns {Element|null}
     */
    get lastChild() {
        return this._lastChild;
    }

    /**
     * Direct children of the element.
     * @returns {ElementList}
     */
    get childElements() {
        if (!this._childElements) {
            let childArray = new Array(this._childCount);
            fillWithLinkedList(this._firstChild, childArray, 0);
            this._childElements = new ElementList(childArray);
        }
        return this._childElements;
    }

    /**
     * Direct child count.
     * @returns {Number}
     */
    get childCount() {
        return this._childCount;
    }

    // ==== Source Code ================================================================================================

    /**
     * Generated source code length.
     * @returns {Number}
     */
    get sourceCodeLength() {
        let length = 0;
        let child = this._firstChild;
        while (child) {
            length += child.sourceCodeLength;
            child = child._nextSibling;
        }
        return length;
    }

    /**
     * Generated source code.
     * @returns {String}
     */
    get sourceCode() {
        let code = '';
        let child = this._firstChild;
        while (child) {
            code += child.sourceCode;
            child = child._nextSibling;
        }
        return code;
    }

    // ==== Child Element Manipulation =================================================================================

    /**
     * Removes specified element from the element child list.
     * @param {Element} element
     */
    removeChild(element) {
        if (element._parentElement !== this) {
            throw new Error('The element to be removed is not a child of this element.');
        }

        if (element._previousSibling) {
            element._previousSibling._nextSibling = element._nextSibling;
        } else {
            this._firstChild = element._nextSibling;
        }

        if (element._nextSibling) {
            element._nextSibling._previousSibling = element._previousSibling;
        } else {
            this._lastChild = element._previousSibling;
        }

        element._parentElement = null;

        this._childCount--;
    }

    /**
     * Appends specified element to the end of the child list.
     * Accepts multiple nodes using `Fragment`.
     * @param {Element} newElement
     */
    appendChild(newElement) {
        let newChildren;
        if (newElement.isFragment) {
            newChildren = new Array(this._childCount + newElement._childCount);
            fillWithLinkedList(this._firstChild, newChildren, 0);
            fillWithLinkedList(newElement._firstChild, newChildren, this._childCount);
        } else {
            if (newElement._parentElement === this) {
                newChildren = new Array(this._childCount);
                fillWithLinkedListWithException(this._firstChild, newChildren, 0, newElement);
            } else {
                this._ensureCanAdopt(newElement);
                newChildren = new Array(this._childCount + 1);
                fillWithLinkedList(this._firstChild, newChildren, 0);
            }
            newChildren[newChildren.length - 1] = newElement;
        }

        this._setChildren(newChildren);
    }

    /**
     * Prepends specified element to the beginning of the child list.
     * Accepts multiple nodes using `Fragment`.
     * @param {Element} newElement
     */
    prependChild(newElement) {
        let newChildren;
        if (newElement.isFragment) {
            newChildren = new Array(this._childCount + newElement._childCount);
            fillWithLinkedList(newElement._firstChild, newChildren, 0);
            fillWithLinkedList(this._firstChild, newChildren, newElement._childCount);
        } else {
            if (newElement._parentElement === this) {
                newChildren = new Array(this._childCount);
                fillWithLinkedListWithException(this._firstChild, newChildren, 1, newElement);
            } else {
                this._ensureCanAdopt(newElement);
                newChildren = new Array(this._childCount + 1);
                fillWithLinkedList(this._firstChild, newChildren, 1);
            }
            newChildren[0] = newElement;
        }

        this._setChildren(newChildren);
    }

    /**
     * Inserts specified element before specified reference child.
     * Accepts multiple nodes using `Fragment`.
     * @param {Element} newElement
     * @param {Element} referenceChild
     */
    insertChildBefore(newElement, referenceChild) {
        if (referenceChild._parentElement !== this) {
            throw new Error('Invalid reference child');
        }

        let newChildren;
        if (newElement.isFragment) {
            newChildren = new Array(this._childCount + newElement._childCount);
            let pos = fillWithLinkedListUntil(this._firstChild, newChildren, 0, referenceChild);
            fillWithLinkedList(newElement._firstChild, newChildren, pos);
            fillWithLinkedList(referenceChild, newChildren, pos + newElement._childCount);
        } else {
            if (newElement._parentElement === this) {
                newChildren = new Array(this._childCount);
                let pos = fillWithLinkedListUntilWithException(
                    this._firstChild, newChildren, 0, referenceChild, newElement
                );
                newChildren[pos] = newElement;
                fillWithLinkedListWithException(referenceChild, newChildren, pos + 1, newElement);
            } else {
                this._ensureCanAdopt(newElement);
                newChildren = new Array(this._childCount + 1);
                let pos = fillWithLinkedListUntil(this._firstChild, newChildren, 0, referenceChild);
                newChildren[pos] = newElement;
                fillWithLinkedList(referenceChild, newChildren, pos + 1);
            }
        }

        this._setChildren(newChildren);
    }

    /**
     * Replaces children from `firstRefChild` to `lastRefChild` with specified element.
     * Accepts multiple replacement nodes using `Fragment`.
     * @param {Element} newElement
     * @param {Element} firstRefChild
     * @param {Element} lastRefChild
     */
    replaceChildren(newElement, firstRefChild, lastRefChild) {
        let replacedChildren = this.getChildrenBetween(firstRefChild, lastRefChild);
        let replacedLength = replacedChildren.length;

        let newChildren;
        if (newElement.isFragment) {
            newChildren = new Array((this._childCount - replacedLength) + newElement._childCount);
            let pos = fillWithLinkedListUntil(this._firstChild, newChildren, 0, firstRefChild);
            fillWithLinkedList(newElement._firstChild, newChildren, pos);
            if (lastRefChild._nextSibling) {
                fillWithLinkedList(lastRefChild._nextSibling, newChildren, pos + newElement._childCount);
            }
        } else {
            if (newElement._parentElement === this) {
                newChildren = new Array(this._childCount - replacedLength);
                let pos = fillWithLinkedListUntilWithException(
                    this._firstChild, newChildren, 0, firstRefChild, newElement
                );
                newChildren[pos] = newElement;
                if (lastRefChild._nextSibling) {
                    fillWithLinkedListWithException(lastRefChild._nextSibling, newChildren, pos + 1, newElement);
                }
            } else {
                this._ensureCanAdopt(newElement);
                newChildren = new Array(this._childCount - replacedLength + 1);
                let pos = fillWithLinkedListUntil(this._firstChild, newChildren, 0, firstRefChild);
                newChildren[pos] = newElement;
                if (lastRefChild._nextSibling) {
                    fillWithLinkedList(lastRefChild._nextSibling, newChildren, pos + 1);
                }
            }
        }

        this._setChildren(newChildren);

        for (let replacedChild of replacedChildren) {
            if (replacedChild !== newElement) {
                replacedChild._parentElement = null;
                replacedChild._previousSibling = null;
                replacedChild._nextSibling = null;
            }
        }
    }

    /**
     * Returns array of child element from firstRefChild to lastRefChild (including reference children).
     * @param {Element} firstRefChild
     * @param {Element} lastRefChild
     * @returns {Array}
     */
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

    /**
     * Makes sure specified child is not already one of the parents of this element.
     * Throws error on failure.
     * @param {Element} child
     * @private
     */
    _ensureCanAdopt(child) {
        let element = this;
        while (element) {
            if (element === child) {
                throw new Error('The new child element contains the parent.');
            }
            element = element._parentElement;
        }
    }

    /**
     * Assigns new children. Runs element syntax assertions.
     * @param {Element[]} newChildren
     * @private
     */
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
     * Runs element syntax assertions. Should be implemented for every Node.
     * @param {Element[]} children
     * @abstract
     */
    _acceptChildren(children) {
        // Override
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
