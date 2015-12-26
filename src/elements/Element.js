/* @flow */

import type Program from './types/Program';
import {getLines} from '../utils/lines';
import ElementAssert from './ElementAssert';

export type Position = {
    line: number,
    column: number
};

export type Location = {
    start: Position,
    end: Position
};

export type Range = [
    number,
    number
];

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
    constructor(type: string, children: Array<Element>) {
        this._type = type;

        this._firstChild = null;
        this._lastChild = null;
        this._parentElement = null;
        this._nextSibling = null;
        this._previousSibling = null;
        this._childElements = [];

        if (children) {
            for (let i = 0; i < children.length; i++) {
                if (children[i]._parentElement) {
                    throw new Error('Cannot add element to several parents');
                }
            }
            this._setChildren(children);
        }
    }

    _type: string;
    _firstChild: ?Element;
    _lastChild: ?Element;
    _parentElement: ?Element;
    _nextSibling: ?Element;
    _previousSibling: ?Element;
    _childElements: Array<Element>;

    value: ?string;
    isModuleSpecifier: boolean;

    /**
     * Element type.
     * Important: some Node types also exist in Tokens. Do not rely on type only, use isToken, isNode.
     *
     * @returns {String}
     */
    get type(): string {
        return this._type;
    }

    /**
     * True if Element is a Token.
     *
     * @returns {Boolean}
     */
    get isToken(): boolean {
        return false;
    }

    /**
     * True if Element is a whitespace Token.
     *
     * @returns {Boolean}
     */
    get isWhitespace(): boolean {
        return false;
    }

    /**
     * True if Element is a code Token.
     *
     * @returns {Boolean}
     */
    get isCode(): boolean {
        return true;
    }

    /**
     * True if Element is a comment Token.
     *
     * @returns {Boolean}
     */
    get isComment(): boolean {
        return false;
    }

    /**
     * True if Element is Comment or Whitespace.
     *
     * @returns {Boolean}
     */
    get isNonCodeToken(): boolean {
        return this.isComment || this.isWhitespace;
    }

    /**
     * True if Element is a Node.
     *
     * @returns {Boolean}
     */
    get isNode(): boolean {
        return false;
    }

    /**
     * True if Element is a Node which can be used as Expression.
     *
     * @returns {Boolean}
     */
    get isExpression(): boolean {
        return false;
    }

    /**
     * True if Element is a Node which can be used as Statement.
     *
     * @returns {Boolean}
     */
    get isStatement(): boolean {
        return false;
    }

    /**
     * True if Element is a Node which can be used as Pattern.
     *
     * @returns {Boolean}
     */
    get isPattern(): boolean {
        return false;
    }

    /**
     * True if Element is a Node which can be used as left part of Assignment.
     *
     * @returns {Boolean}
     */
    get isAssignable(): boolean {
        return false;
    }

    /**
     * True if Element is a Fragment.
     *
     * @returns {Boolean}
     */
    get isFragment(): boolean {
        return false;
    }

    // ==== Traversing =================================================================================================

    /**
     * Parent element or null if parent element does not exist.
     *
     * @returns {Element|null}
     */
    get parentElement(): ?Element {
        return this._parentElement;
    }

    /**
     * Owner Program for this element or null if element does not have Program in its parent hierarchy.
     *
     * @returns {Program}
     */
    get ownerProgram(): Program {
        let element = this;
        while (element && !element._isProgram) {
            element = element._parentElement;
        }
        return ((element: any): Program);
    }

    /**
     * Next sibling within parent.
     * Null if element is the last child in parent or if element does not have parent.
     *
     * @returns {Element|null}
     */
    get nextSibling(): ?Element {
        return this._nextSibling;
    }

    /**
     * Previous sibling within parent.
     * Null if element is the first child in parent or if element does not have parent.
     *
     * @returns {Element|null}
     */
    get previousSibling(): ?Element {
        return this._previousSibling;
    }

    /**
     * Next token. Null if token was not found.
     *
     * @returns {Element|null}
     */
    get nextToken(): ?Element {
        if (this._nextSibling) {
            return this._nextSibling.firstToken;
        }

        if (this._parentElement) {
            return this._parentElement.nextToken;
        }

        return null;
    }

    /**
     * Previous token. Null if token was not found.
     *
     * @returns {Element|null}
     */
    get previousToken(): ?Element {
        if (this._previousSibling) {
            return this._previousSibling.lastToken;
        }

        if (this._parentElement) {
            return this._parentElement.previousToken;
        }

        return null;
    }

    /**
     * Next token (non-whitespace and non-comment). Null if token was not found.
     *
     * @returns {Element|null}
     */
    get nextCodeToken(): ?Element {
        let token = this.nextToken;
        while (token && !token.isCode) {
            token = token.nextToken;
        }
        return token;
    }

    /**
     * Previous token (non-whitespace and non-comment). Null if token was not found.
     *
     * @returns {Element|null}
     */
    get previousCodeToken(): ?Element {
        let token = this.previousToken;
        while (token && !token.isCode) {
            token = token.previousToken;
        }
        return token;
    }

    /**
     * Next non-whitespace token. Null if token was not found.
     *
     * @returns {Element|null}
     */
    get nextNonWhitespaceToken(): ?Element {
        let token = this.nextToken;
        while (token && token.isWhitespace) {
            token = token.nextToken;
        }
        return token;
    }

    /**
     * Previous non-whitespace token. Null if token was not found.
     *
     * @returns {Element|null}
     */
    get previousNonWhitespaceToken(): ?Element {
        let token = this.previousToken;
        while (token && token.isWhitespace) {
            token = token.previousToken;
        }
        return token;
    }

    /**
     * Next whitespace token. Null if token was not found.
     *
     * @returns {Element|null}
     */
    get nextWhitespaceToken(): ?Element {
        let token = this.nextToken;
        while (token && !(token.isWhitespace)) {
            token = token.nextToken;
        }
        return token;
    }

    /**
     * Previous whitespace token. Null if token was not found.
     *
     * @returns {Element|null}
     */
    get previousWhitespaceToken(): ?Element {
        let token = this.previousToken;

        while (token && !(token.isWhitespace)) {
            token = token.previousToken;
        }
        return token;
    }

    /**
     * First token inside element child tree.
     *
     * @returns {Element|null}
     */
    get firstToken(): ?Element {
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
    get lastToken(): ?Element {
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
    get firstChild(): ?Element {
        return this._firstChild;
    }

    /**
     * Last child element. Null if element does not have children.
     *
     * @returns {Element|null}
     */
    get lastChild(): ?Element {
        return this._lastChild;
    }

    /**
     * Direct children of the element.
     *
     * @returns {ElementList}
     */
    get childElements(): Array<Element> {
        return this._childElements.concat();
    }

    /**
     * Direct child count.
     *
     * @returns {Number}
     */
    get childCount(): number {
        return this._childElements.length;
    }

    /**
     * Calculates and returns Element range.
     *
     * @returns {Number[]}
     */
    get range(): Range {
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
    get loc(): Location {
        let prevToken = this.previousToken;
        let startColumn = 0;
        let startLine = 1;
        while (prevToken) {
            let lines = prevToken.sourceCodeLines;
            startColumn += lines[lines.length - 1].length;
            if (lines.length > 1) {
                while (prevToken) {
                    startLine += prevToken.newlineCount;
                    // $FlowIssue: filed as https://github.com/facebook/flow/issues/973
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
    get sourceCodeLength(): number {
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
    get sourceCode(): string {
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
    get sourceCodeLines(): Array<string> {
        return getLines(this.sourceCode);
    }

    /**
     * Generated source code line break count.
     *
     * @returns {Number}
     */
    get newlineCount(): number {
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
     *
     * @returns {Element}
     */
    removeChild(element: Element): Element {
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

        return element;
    }

    /**
     * Removes element
     *
     * @returns {Element}
     */
    remove() {
        if (!this.parentElement) {
            return this;
        }

        return this.parentElement.removeChild(this);
    }

    /**
     * Appends specified element to the end of the child list.
     * Accepts multiple nodes using `Fragment`.
     *
     * @param {Element} newElement
     */
    appendChild(newElement: Element) {
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

        // $FlowIssue: filed as https://github.com/facebook/flow/issues/987
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
    prependChild(newElement: Element) {
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

        // $FlowIssue: filed as https://github.com/facebook/flow/issues/987
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
    insertChildBefore(newElement: Element, referenceChild: Element) {
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

        // $FlowIssue: filed as https://github.com/facebook/flow/issues/987
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
    replaceChildren(newElement: Element, firstRefChild: Element, lastRefChild: Element) {
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

        // $FlowIssue: filed as https://github.com/facebook/flow/issues/987
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
    replaceChild(newElement: Element, oldElement: Element) {
        return this.replaceChildren(newElement, oldElement, oldElement);
    }

    /**
     * Returns array of child element from firstRefChild to lastRefChild (including reference children).
     *
     * @param {Element} firstRefChild
     * @param {Element} lastRefChild
     * @returns {Array}
     */
    getChildrenBetween(firstRefChild: Element, lastRefChild: Element): Array<Element> {
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
    _ensureCanAdopt(child: Element) {
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
    _ensureCanAdoptFragment(fragment: Element) {
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
    _setChildren(newChildren: Element[]) {
        this._acceptChildren(new ElementAssert(newChildren));

        if (newChildren.length > 0) {
            let previousChild = newChildren[0];
            this._firstChild = previousChild;
            previousChild._parentElement = this;
            previousChild._previousSibling = null;
            if (newChildren.length > 1) {
                // TODO(flow): error with only `let child;`
                let child = newChildren[1];
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
                previousChild._nextSibling = null;
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
     * @param {Object} children
     * @abstract
     */
    _acceptChildren(children: ElementAssert): void {
        // Override
    }

    /**
     * Clones current Element structure.
     *
     * @returns {Element}
     */
    cloneElement(): Element {
        let clonedChildren = new Array(this._childElements.length);
        for (let i = 0; i < clonedChildren.length; i++) {
            clonedChildren[i] = this._childElements[i].cloneElement();
        }

        // $FlowFixMe: flow doesn't understand if this is an Element or not
        return new this.constructor(clonedChildren);
    }
}
