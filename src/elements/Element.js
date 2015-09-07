import {getLines} from '../utils/lines';
import ElementAssert from './ElementAssert';

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
        this._type = type;

        this._firstChild = null;
        this._lastChild = null;
        this._parentElement = null;
        this._nextSibling = null;
        this._previousSibling = null;
        this._childElements = null;

        if (children) {
            for (let i = 0; i < children.length; i++) {
                if (children[i]._parentElement) {
                    throw new Error('Cannot add element to several parents');
                }
            }
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
     * True if Element is Comment or Whitespace.
     *
     * @returns {Boolean}
     */
    get isNonCodeToken() {
        return this.isComment || this.isWhitespace;
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
            return this._previousSibling.lastToken;
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
     * Next non-whitespace token. Null if token was not foung.
     *
     * @returns {Element|null}
     */
    get nextNonWhitespaceToken() {
        let token = this.nextToken;
        while (token && token.isWhitespace) {
            token = token.nextToken;
        }
        return token;
    }

    /**
     * Previous non-whitespace token. Null if token was not foung.
     *
     * @returns {Element|null}
     */
    get previousNonWhitespaceToken() {
        let token = this.previousToken;
        while (token && token.isWhitespace) {
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
        return this._childElements.concat();
    }

    /**
     * Direct child count.
     *
     * @returns {Number}
     */
    get childCount() {
        return this._childElements.length;
    }

    /**
     * Calculates and returns Element range.
     *
     * @returns {Number[]}
     */
    get range() {
        let counter = 0;

        let previous = this.previousToken;
        while (previous) {
            counter += previous.sourceCodeLength;
            previous = previous.previousToken;
        }

        return [counter, counter + this.sourceCodeLength];
    }

    /**
     * Calculates and returns Element loc.
     *
     * @returns {Object}
     */
    get loc() {
        let prevToken = this.previousToken;
        let startColumn = 0;
        let startLine = 1;
        while (prevToken) {
            let lines = prevToken.sourceCodeLines;
            startColumn += lines[lines.length - 1].length;
            if (lines.length > 1) {
                while (prevToken) {
                    startLine += prevToken.newlineCount;
                    prevToken = prevToken.previousToken;
                }
                break;
            }
            prevToken = prevToken.previousToken;
        }

        let elementLines = this.sourceCodeLines;
        let endLine = startLine + elementLines.length - 1;
        let endColumn = elementLines[elementLines.length - 1].length;

        if (startLine === endLine) {
            endColumn += startColumn;
        }

        return {
            start: {
                line: startLine,
                column: startColumn
            },
            end: {
                line: endLine,
                column: endColumn
            }
        };
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

    /**
     * Generated source code lines.
     *
     * @returns {String[]}
     */
    get sourceCodeLines() {
        return getLines(this.sourceCode);
    }

    /**
     * Generated source code line break count.
     *
     * @returns {Number}
     */
    get newlineCount() {
        let count = 0;
        let child = this._firstChild;
        while (child) {
            count += child.newlineCount;
            child = child._nextSibling;
        }
        return count;
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

        let children = this._childElements.concat();
        let elementIndex = children.indexOf(element);
        children.splice(elementIndex, 1);

        this._setChildren(children);

        let ownerProgram = this.ownerProgram;
        if (ownerProgram) {
            ownerProgram._removeElementsFromSearchIndex([element]);
        }

        element._parentElement = null;
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
            this._ensureCanAdoptFragment(newElement);
            newElements = newElement._childElements;
            children = this._childElements.concat(newElement._childElements);
        } else {
            if (newElement._parentElement) {
                throw new Error('Remove element before adding again');
            }
            this._ensureCanAdopt(newElement);
            newElements = [newElement];
            children = this._childElements.concat(newElement);
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
            this._ensureCanAdoptFragment(newElement);
            newElements = newElement._childElements;
            children = newElement._childElements.concat(this._childElements);
        } else {
            if (newElement._parentElement) {
                throw new Error('Remove element before adding again');
            }
            this._ensureCanAdopt(newElement);
            newElements = [newElement];
            children = [newElement].concat(this._childElements);
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

        let index = this._childElements.indexOf(referenceChild);
        let childrenBefore = this._childElements.slice(0, index);
        let childrenAfter = this._childElements.slice(index);

        let children;
        let newElements;
        if (newElement.isFragment) {
            this._ensureCanAdoptFragment(newElement);
            newElements = newElement._childElements;
            children = childrenBefore.concat(newElement._childElements, childrenAfter);
        } else {
            if (newElement._parentElement) {
                throw new Error('Remove element before adding again');
            }

            this._ensureCanAdopt(newElement);
            children = childrenBefore.concat(newElement, childrenAfter);
            newElements = [newElement];
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
        if (!firstRefChild || firstRefChild._parentElement !== this) {
            throw new Error('Invalid first reference child');
        }

        if (!lastRefChild || lastRefChild._parentElement !== this) {
            throw new Error('Invalid last reference child');
        }

        let firstIndex = this._childElements.indexOf(firstRefChild);
        let lastIndex = this._childElements.indexOf(lastRefChild);

        if (firstIndex > lastIndex) {
            throw new Error('Invalid reference children order');
        }

        let childrenBefore = this._childElements.slice(0, firstIndex);
        let childrenAfter = this._childElements.slice(lastIndex + 1);
        let replacedChildren = this._childElements.slice(firstIndex, lastIndex + 1);

        let children;
        let newElements;
        if (newElement.isFragment) {
            this._ensureCanAdoptFragment(newElement);
            children = childrenBefore.concat(newElement._childElements, childrenAfter);
            newElements = newElement._childElements;
        } else {
            if (newElement._parentElement) {
                throw new Error('Remove element before adding again');
            }

            this._ensureCanAdopt(newElement);
            children = childrenBefore.concat(newElement, childrenAfter);
            newElements = [newElement];
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
     * Replaces child with specified element.
     * Accepts multiple replacement nodes using `Fragment`.
     *
     * @param {Element} newElement
     * @param {Element} oldElement
     */
    replaceChild(newElement, oldElement) {
        return this.replaceChildren(newElement, oldElement, oldElement);
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

        let firstIndex = this._childElements.indexOf(firstRefChild);
        let lastIndex = this._childElements.indexOf(lastRefChild);

        if (firstIndex > lastIndex) {
            throw new Error('Invalid reference children order');
        }

        return this._childElements.slice(firstIndex, lastIndex + 1);

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
     * Calls _ensureCanAdopt for each fragment element.
     *
     * @param {Element} fragment
     * @private
     */
    _ensureCanAdoptFragment(fragment) {
        let fragmentChild = fragment._firstChild;
        while (fragmentChild) {
            this._ensureCanAdopt(fragmentChild);
            fragmentChild = fragmentChild._nextSibling;
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

        if (newChildren.length > 0) {
            let previousChild = newChildren[0];
            this._firstChild = previousChild;
            previousChild._parentElement = this;
            previousChild._previousSibling = null;
            if (newChildren.length > 1) {
                let child;
                for (let i = 1; i < newChildren.length; i++) {
                    child = newChildren[i];
                    child._parentElement = this;
                    child._previousSibling = previousChild;
                    previousChild._nextSibling = child;
                    previousChild = child;
                }
                child._nextSibling = null;
                this._lastChild = child;
            } else {
                this._lastChild = previousChild;
            }
        } else {
            this._firstChild = this._lastChild = null;
        }

        this._childElements = newChildren;
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

    /**
     * Clones current Element structure.
     *
     * @returns {Element}
     */
    cloneElement() {
        let clonedChildren = new Array(this._childElements.length);
        for (let i = 0; i < clonedChildren.length; i++) {
            clonedChildren[i] = this._childElements[i].cloneElement();
        }
        return new this.constructor(clonedChildren);
    }
}
