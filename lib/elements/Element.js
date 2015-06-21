import ElementAssert from './ElementAssert';
import ElementList from './ElementList';

/**
 * Base class for Node, Token and Fragment.
 *
 * @name Element
 * @class
 * @abstract
 */
export default class Element {
    /**
     * @param {String} type
     * @param {Element[]} children
     */
    constructor(type, children) {
        this._uniqueId = 'id' + (++Element._lastId);

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
     *
     * @returns {String}
     */
    get type() {
        return this._type;
    }

    /**
     * True if Element is a Token.
     *
     * @returns {Boolean}
     */
    get isToken() {
        return false;
    }

    /**
     * True if Element is a whitespace Token.
     *
     * @returns {Boolean}
     */
    get isWhitespace() {
        return false;
    }

    /**
     * True if Element is a comment Token.
     *
     * @returns {Boolean}
     */
    get isComment() {
        return false;
    }

    /**
     * True if Element is a Node.
     *
     * @returns {Boolean}
     */
    get isNode() {
        return false;
    }

    /**
     * True if Element is a Node which can be used as Expression.
     *
     * @returns {Boolean}
     */
    get isExpression() {
        return false;
    }

    /**
     * True if Element is a Node which can be used as Statement.
     *
     * @returns {Boolean}
     */
    get isStatement() {
        return false;
    }

    /**
     * True if Element is a Node which can be used as Pattern.
     *
     * @returns {Boolean}
     */
    get isPattern() {
        return false;
    }

    /**
     * True if Element is a Node which can be used as left part of Assignment.
     *
     * @returns {Boolean}
     */
    get isAssignable() {
        return false;
    }

    /**
     * True if Element is a Fragment.
     *
     * @returns {Boolean}
     */
    get isFragment() {
        return false;
    }

    // ==== Traversing =================================================================================================

    /**
     * Parent element or null if parent element does not exist.
     *
     * @returns {Element|null}
     */
    get parentElement() {
        return this._parentElement;
    }

    /**
     * Owner Program for this element or null if element does not have Program in its parent hierarchy.
     *
     * @returns {Element}
     */
    get ownerProgram() {
        let element = this;
        while (element && !element._isProgram) {
            element = element._parentElement;
        }
        return element;
    }

    /**
     * Next sibling within parent.
     * Null if element is the last child in parent or if element does not have parent.
     *
     * @returns {Element|null}
     */
    get nextSibling() {
        return this._nextSibling;
    }

    /**
     * Previous sibling within parent.
     * Null if element is the first child in parent or if element does not have parent.
     *
     * @returns {Element|null}
     */
    get previousSibling() {
        return this._previousSibling;
    }

    /**
     * Next token. Null if token was not foung.
     *
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
     *
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
     *
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
     *
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
     *
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
     *
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
     *
     * @returns {Element|null}
     */
    get firstChild() {
        return this._firstChild;
    }

    /**
     * Last child element. Null if element does not have children.
     *
     * @returns {Element|null}
     */
    get lastChild() {
        return this._lastChild;
    }

    /**
     * Direct children of the element.
     *
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
     *
     * @returns {Number}
     */
    get childCount() {
        return this._childCount;
    }

    // ==== Source Code ================================================================================================

    /**
     * Generated source code length.
     *
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
     *
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
     *
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
     *
     * @param {Element} newElement
     */
    appendChild(newElement) {
        let children;
        let newElements;
        if (newElement.isFragment) {
            children = new Array(this._childCount + newElement._childCount);
            fillWithLinkedList(this._firstChild, children, 0);
            fillWithLinkedList(newElement._firstChild, children, this._childCount);

            newElements = new Array(newElement._childCount);
            fillWithLinkedList(newElement._firstChild, newElements, 0);
        } else {
            if (newElement._parentElement === this) {
                children = new Array(this._childCount);
                fillWithLinkedListWithException(this._firstChild, children, 0, newElement);
            } else {
                this._ensureCanAdopt(newElement);
                children = new Array(this._childCount + 1);
                fillWithLinkedList(this._firstChild, children, 0);

                newElements = [newElement];
            }
            children[children.length - 1] = newElement;
        }

        this._setChildren(children);

        if (newElements) {
            let ownerProgram = this.ownerProgram;
            if (ownerProgram) {
                ownerProgram._addElementsToSearchIndex(newElements);
            }
        }
    }

    /**
     * Prepends specified element to the beginning of the child list.
     * Accepts multiple nodes using `Fragment`.
     *
     * @param {Element} newElement
     */
    prependChild(newElement) {
        let children;
        let newElements;
        if (newElement.isFragment) {
            children = new Array(this._childCount + newElement._childCount);
            fillWithLinkedList(newElement._firstChild, children, 0);
            fillWithLinkedList(this._firstChild, children, newElement._childCount);

            newElements = new Array(newElement._childCount);
            fillWithLinkedList(newElement._firstChild, newElements, 0);
        } else {
            if (newElement._parentElement === this) {
                children = new Array(this._childCount);
                fillWithLinkedListWithException(this._firstChild, children, 1, newElement);
            } else {
                this._ensureCanAdopt(newElement);
                children = new Array(this._childCount + 1);
                fillWithLinkedList(this._firstChild, children, 1);

                newElements = [newElement];
            }
            children[0] = newElement;
        }

        this._setChildren(children);

        if (newElements) {
            let ownerProgram = this.ownerProgram;
            if (ownerProgram) {
                ownerProgram._addElementsToSearchIndex(newElements);
            }
        }
    }

    /**
     * Inserts specified element before specified reference child.
     * Accepts multiple nodes using `Fragment`.
     *
     * @param {Element} newElement
     * @param {Element} referenceChild
     */
    insertChildBefore(newElement, referenceChild) {
        if (referenceChild._parentElement !== this) {
            throw new Error('Invalid reference child');
        }

        let children;
        let newElements;
        if (newElement.isFragment) {
            children = new Array(this._childCount + newElement._childCount);
            let pos = fillWithLinkedListUntil(this._firstChild, children, 0, referenceChild);
            fillWithLinkedList(newElement._firstChild, children, pos);
            fillWithLinkedList(referenceChild, children, pos + newElement._childCount);

            newElements = new Array(newElement._childCount);
            fillWithLinkedList(newElement._firstChild, newElements, 0);
        } else {
            if (newElement._parentElement === this) {
                children = new Array(this._childCount);
                let pos = fillWithLinkedListUntilWithException(
                    this._firstChild, children, 0, referenceChild, newElement
                );
                children[pos] = newElement;
                fillWithLinkedListWithException(referenceChild, children, pos + 1, newElement);
            } else {
                this._ensureCanAdopt(newElement);
                children = new Array(this._childCount + 1);
                let pos = fillWithLinkedListUntil(this._firstChild, children, 0, referenceChild);
                children[pos] = newElement;
                fillWithLinkedList(referenceChild, children, pos + 1);

                newElements = [newElement];
            }
        }

        this._setChildren(children);

        if (newElements) {
            let ownerProgram = this.ownerProgram;
            if (ownerProgram) {
                ownerProgram._addElementsToSearchIndex(newElements);
            }
        }
    }

    /**
     * Replaces children from `firstRefChild` to `lastRefChild` with specified element.
     * Accepts multiple replacement nodes using `Fragment`.
     *
     * @param {Element} newElement
     * @param {Element} firstRefChild
     * @param {Element} lastRefChild
     */
    replaceChildren(newElement, firstRefChild, lastRefChild) {
        let replacedChildren = this.getChildrenBetween(firstRefChild, lastRefChild);
        if (newElement._parentElement === this) {
            for (let i = 0; i < replacedChildren.length; i++) {
                if (replacedChildren[i] === newElement) {
                    replacedChildren.splice(i, 1);
                    break;
                }
            }
        }

        let replacedLength = replacedChildren.length;

        let children;
        let newElements;
        if (newElement.isFragment) {
            children = new Array((this._childCount - replacedLength) + newElement._childCount);
            let pos = fillWithLinkedListUntil(this._firstChild, children, 0, firstRefChild);
            fillWithLinkedList(newElement._firstChild, children, pos);
            if (lastRefChild._nextSibling) {
                fillWithLinkedList(lastRefChild._nextSibling, children, pos + newElement._childCount);
            }

            newElements = new Array(newElement._childCount);
            fillWithLinkedList(newElement._firstChild, newElements, 0);
        } else {
            if (newElement._parentElement === this) {
                children = new Array(this._childCount - replacedLength);
                let pos = fillWithLinkedListUntilWithException(
                    this._firstChild, children, 0, firstRefChild, newElement
                );
                children[pos] = newElement;
                if (lastRefChild._nextSibling) {
                    fillWithLinkedListWithException(lastRefChild._nextSibling, children, pos + 1, newElement);
                }
            } else {
                this._ensureCanAdopt(newElement);
                children = new Array(this._childCount - replacedLength + 1);
                let pos = fillWithLinkedListUntil(this._firstChild, children, 0, firstRefChild);
                children[pos] = newElement;
                if (lastRefChild._nextSibling) {
                    fillWithLinkedList(lastRefChild._nextSibling, children, pos + 1);
                }

                newElements = [newElement];
            }
        }

        this._setChildren(children);

        for (let i = 0; i < replacedChildren.length; i++) {
            let replacedChild = replacedChildren[i];
            replacedChild._parentElement = null;
            replacedChild._previousSibling = null;
            replacedChild._nextSibling = null;
        }

        let ownerProgram = this.ownerProgram;
        if (ownerProgram) {
            ownerProgram._removeElementsFromSearchIndex(replacedChildren);
            if (newElements) {
                ownerProgram._addElementsToSearchIndex(newElements);
            }
        }
    }

    /**
     * Returns array of child element from firstRefChild to lastRefChild (including reference children).
     *
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
     *
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
     *
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
     *
     * @param {Element[]} children
     * @abstract
     */
    _acceptChildren(children) {
        // Override
    }
}

/**
 * Fills array using linked list.
 *
 * @param {Element} list
 * @param {Element} array
 * @param {Number} offset
 * @private
 */
function fillWithLinkedList(list, array, offset) {
    let item = list;
    while (item) {
        array[offset] = item;
        offset++;
        item = item._nextSibling;
    }
}

/**
 * Fills array using linked list with single element exception.
 *
 * @param {Element} list
 * @param {Element[]} array
 * @param {Number} offset
 * @param {Element} exception
 * @private
 */
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

/**
 * Fills array using linked list until the specified list element.
 *
 * @param {Element} list
 * @param {Element[]} array
 * @param {Number} offset
 * @param {Element} referenceElement
 * @private
 */
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

/**
 * Fills array using linked list until the specified list element with single element exception.
 *
 * @param {Element} list
 * @param {Element[]} array
 * @param {Number} offset
 * @param {Element} referenceElement
 * @param {Element} exception
 * @private
 */
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

Element._lastId = 1000000000;
