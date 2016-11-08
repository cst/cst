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
        this.type = type;

        this.firstChild = null;
        this.lastChild = null;
        this.parentElement = null;
        this.nextSibling = null;
        this.previousSibling = null;
        this.childElements = [];

        if (children) {
            for (let i = 0; i < children.length; i++) {
                if (children[i].parentElement) {
                    throw new Error('Cannot add element to several parents');
                }
            }
            this._setChildren(children);
        }

        this.isToken = false;
        this.isWhitespace = false;
        this.isCode = true;
        this.isComment = false;
        this.isNonCodeToken = this.isComment || this.isWhitespace;
        this.isNode = false;
        this.isStatement = false;
        this.isPattern = false;
        this.isAssignable = false;
        this.isFragment = false;
    }

    type: string;
    firstChild: ?Element;
    lastChild: ?Element;
    parentElement: ?Element;
    nextSibling: ?Element;
    previousSibling: ?Element;
    childElements: Array<Element>;
    _onSetParentElement: ?((parentElement: ?Element) => void);

    isModuleSpecifier: boolean;

    // ==== Traversing =================================================================================================

    /**
     * Owner Program for this element or null if element does not have Program in its parent hierarchy.
     *
     * @returns {Program}
     */
    getOwnerProgram(): Program {
        let element = this;
        while (element && !element._isProgram) {
            element = element.parentElement;
        }
        return ((element: any): Program);
    }

    getNextToken() {
        let element = this;
        while (element) {
            if (element.nextSibling) {
                return element.nextSibling.getFirstToken();
            }

            element = element.parentElement;
        }

        return null;
    }

    getPreviousToken() {
        let element = this;
        while (element) {
            if (element.previousSibling) {
                return element.previousSibling.getLastToken();
            }

            element = element.parentElement;
        }

        return null;
    }

    /**
     * Next token (non-whitespace and non-comment). Null if token was not found.
     *
     * @returns {Element|null}
     */
    getNextCodeToken(): ?Element {
        let token = this.getNextToken();
        while (token && !token.isCode) {
            token = token.getNextToken();
        }
        return token;
    }

    /**
     * Previous token (non-whitespace and non-comment). Null if token was not found.
     *
     * @returns {Element|null}
     */
    getPreviousCodeToken(): ?Element {
        let token = this.getPreviousToken();
        while (token && !token.isCode) {
            token = token.getPreviousToken();
        }
        return token;
    }

    /**
     * Next non-whitespace token. Null if token was not found.
     *
     * @returns {Element|null}
     */
    getNextNonWhitespaceToken(): ?Element {
        let token = this.getNextToken();
        while (token && token.isWhitespace) {
            token = token.getNextToken();
        }
        return token;
    }

    /**
     * Previous non-whitespace token. Null if token was not found.
     *
     * @returns {Element|null}
     */
    getPreviousNonWhitespaceToken(): ?Element {
        let token = this.getPreviousToken();
        while (token && token.isWhitespace) {
            token = token.getPreviousToken();
        }
        return token;
    }

    /**
     * First token inside element child tree.
     *
     * @returns {Element|null}
     */
    getFirstToken(): ?Element {
        let element = this.firstChild;
        while (element && !element.isToken) {
            element = element.firstChild;
        }
        return element;
    }

    /**
     * Last token inside element child tree.
     *
     * @returns {Element|null}
     */
    getLastToken(): ?Element {
        let element = this.lastChild;
        while (element && !element.isToken) {
            element = element.lastChild;
        }
        return element;
    }

    /**
     * Calculates and returns Element range.
     *
     * @returns {Number[]}
     */
    getRange(): Range {
        let counter = 0;

        let previous = this.getPreviousToken();
        while (previous) {
            counter += previous._sourceCodeLength;
            previous = previous.getPreviousToken();
        }

        return [counter, counter + this.getSourceCodeLength()];
    }

    /**
     * Calculates and returns Element loc.
     *
     * @returns {Object}
     */
    getLoc(): Location {
        let prevToken = this.getPreviousToken();
        let startColumn = 0;
        let startLine = 1;
        while (prevToken) {
            let lines = prevToken._sourceCodeLines;
            startColumn += lines[lines.length - 1].length;
            if (lines.length > 1) {
                while (prevToken) {
                    startLine += prevToken.getNewlineCount();
                    prevToken = prevToken.getPreviousToken();
                }
                break;
            }
            prevToken = prevToken.getPreviousToken();
        }

        let elementLines = this.getSourceCodeLines();
        let endLine = startLine + elementLines.length - 1;
        let endColumn = elementLines[elementLines.length - 1].length;

        if (startLine === endLine) {
            endColumn += startColumn;
        }

        return {
            start: {
                line: startLine,
                column: startColumn,
            },
            end: {
                line: endLine,
                column: endColumn,
            },
        };
    }

    // ==== Source Code ================================================================================================

    /**
     * Generated source code length.
     *
     * @returns {Number}
     */
    getSourceCodeLength(): number {
        let length = 0;
        let child = this.firstChild;
        while (child) {
            length += child.getSourceCodeLength();
            child = child.nextSibling;
        }
        return length;
    }

    /**
     * Generated source code.
     *
     * @returns {String}
     */
    getSourceCode(): string {
        let code = '';
        let child = this.firstChild;

        while (child) {
            code += child.getSourceCode();
            child = child.nextSibling;
        }
        return code;
    }

    /**
     * Generated source code lines.
     *
     * @returns {String[]}
     */
    getSourceCodeLines(): Array<string> {
        return getLines(this.getSourceCode());
    }

    /**
     * Generated source code line break count.
     *
     * @returns {Number}
     */
    getNewlineCount(): number {
        let count = 0;
        let child = this.firstChild;
        while (child) {
            count += child.getNewlineCount();
            child = child.nextSibling;
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
        if (element.parentElement !== this) {
            throw new Error('The element to be removed is not a child of this element.');
        }

        let children = this.childElements.concat();
        let elementIndex = children.indexOf(element);
        children.splice(elementIndex, 1);

        this._setChildren(children);

        let ownerProgram = this.getOwnerProgram();
        if (ownerProgram) {
            ownerProgram._removeElementsFromProgram([element]);
        }

        setParentElement(element, null);

        return element;
    }

    /**
     * Removes element.
     */
    remove() {
        if (!this.parentElement) {
            return;
        }

        this.parentElement.removeChild(this);
    }

    /**
     * Appends specified element to the end of the child list.
     * Accepts multiple nodes using `Fragment`.
     *
     * @param {Element} newElement
     */
    appendChild(newElement: Element) {
        let children: Element[];
        let newElements: Element[];
        if (newElement.isFragment) {
            this._ensureCanAdoptFragment(newElement);
            newElements = newElement.childElements;
            children = this.childElements.concat(newElement.childElements);
        } else {
            if (newElement.parentElement) {
                throw new Error('Remove element before adding again');
            }
            this._ensureCanAdopt(newElement);
            newElements = [newElement];
            children = this.childElements.concat(newElement);
        }

        this._setChildren(children);

        if (newElements) {
            let ownerProgram = this.getOwnerProgram();
            if (ownerProgram) {
                ownerProgram._addElementsToProgram(newElements);
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
        let children: Element[];
        let newElements: Element[];
        if (newElement.isFragment) {
            this._ensureCanAdoptFragment(newElement);
            newElements = newElement.childElements;
            children = newElement.childElements.concat(this.childElements);
        } else {
            if (newElement.parentElement) {
                throw new Error('Remove element before adding again');
            }
            this._ensureCanAdopt(newElement);
            newElements = [newElement];
            children = [newElement].concat(this.childElements);
        }

        this._setChildren(children);

        if (newElements) {
            let ownerProgram = this.getOwnerProgram();
            if (ownerProgram) {
                ownerProgram._prependElementsToProgram(newElements);
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
        if (referenceChild.parentElement !== this) {
            throw new Error('Invalid reference child');
        }

        let index = this.childElements.indexOf(referenceChild);
        let childrenBefore = this.childElements.slice(0, index);
        let childrenAfter = this.childElements.slice(index);

        let children: Element[];
        let newElements: Element[];
        if (newElement.isFragment) {
            this._ensureCanAdoptFragment(newElement);
            newElements = newElement.childElements;
            children = childrenBefore.concat(newElement.childElements, childrenAfter);
        } else {
            if (newElement.parentElement) {
                throw new Error('Remove element before adding again');
            }

            this._ensureCanAdopt(newElement);
            children = childrenBefore.concat(newElement, childrenAfter);
            newElements = [newElement];
        }

        this._setChildren(children);

        if (newElements) {
            let ownerProgram = this.getOwnerProgram();
            if (ownerProgram) {
                ownerProgram._addElementsToProgram(newElements);
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
        if (!firstRefChild || firstRefChild.parentElement !== this) {
            throw new Error('Invalid first reference child');
        }

        if (!lastRefChild || lastRefChild.parentElement !== this) {
            throw new Error('Invalid last reference child');
        }

        let firstIndex = this.childElements.indexOf(firstRefChild);
        let lastIndex = this.childElements.indexOf(lastRefChild);

        if (firstIndex > lastIndex) {
            throw new Error('Invalid reference children order');
        }

        let childrenBefore = this.childElements.slice(0, firstIndex);
        let childrenAfter = this.childElements.slice(lastIndex + 1);
        let replacedChildren = this.childElements.slice(firstIndex, lastIndex + 1);

        let children: Element[];
        let newElements: Element[];
        if (newElement.isFragment) {
            this._ensureCanAdoptFragment(newElement);
            children = childrenBefore.concat(newElement.childElements, childrenAfter);
            newElements = newElement.childElements;
        } else {
            if (newElement.parentElement) {
                throw new Error('Remove element before adding again');
            }

            this._ensureCanAdopt(newElement);
            children = childrenBefore.concat(newElement, childrenAfter);
            newElements = [newElement];
        }

        this._setChildren(children);

        let ownerProgram = this.getOwnerProgram();

        if (ownerProgram) {
            ownerProgram._removeElementsFromProgram(replacedChildren);
        }

        for (let i = 0; i < replacedChildren.length; i++) {
            let replacedChild = replacedChildren[i];
            replacedChild.previousSibling = null;
            replacedChild.nextSibling = null;
            setParentElement(replacedChild, null);
        }

        if (ownerProgram && newElements) {
            ownerProgram._addElementsToProgram(newElements);
        }
    }

    /**
     * Removes children from `firstRefChild` to `lastRefChild` with specified element.
     *
     * @param {Element} firstRefChild
     * @param {Element} lastRefChild
     */
    removeChildren(firstRefChild: Element, lastRefChild: Element) {
        if (!firstRefChild || firstRefChild.parentElement !== this) {
            throw new Error('Invalid first reference child');
        }

        if (!lastRefChild || lastRefChild.parentElement !== this) {
            throw new Error('Invalid last reference child');
        }

        let firstIndex = this.childElements.indexOf(firstRefChild);
        let lastIndex = this.childElements.indexOf(lastRefChild);

        if (firstIndex > lastIndex) {
            throw new Error('Invalid reference children order');
        }

        let children = this.childElements.slice(0, firstIndex).concat(this.childElements.slice(lastIndex + 1));
        let removedChildren = this.childElements.slice(firstIndex, lastIndex + 1);

        this._setChildren(children);

        let ownerProgram = this.getOwnerProgram();

        if (ownerProgram) {
            ownerProgram._removeElementsFromProgram(removedChildren);
        }

        for (let i = 0; i < removedChildren.length; i++) {
            let removedChild = removedChildren[i];
            removedChild.previousSibling = null;
            removedChild.nextSibling = null;
            setParentElement(removedChild, null);
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
        this.replaceChildren(newElement, oldElement, oldElement);
    }

    /**
     * Returns array of child element from firstRefChild to lastRefChild (including reference children).
     *
     * @param {Element} firstRefChild
     * @param {Element} lastRefChild
     * @returns {Array}
     */
    getChildrenBetween(firstRefChild: Element, lastRefChild: Element): Array<Element> {
        if (!firstRefChild || firstRefChild.parentElement !== this) {
            throw new Error('Invalid first reference child');
        }

        if (!lastRefChild || lastRefChild.parentElement !== this) {
            throw new Error('Invalid last reference child');
        }

        let firstIndex = this.childElements.indexOf(firstRefChild);
        let lastIndex = this.childElements.indexOf(lastRefChild);

        if (firstIndex > lastIndex) {
            throw new Error('Invalid reference children order');
        }

        return this.childElements.slice(firstIndex, lastIndex + 1);
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
            element = element.parentElement;
        }
    }

    /**
     * Calls _ensureCanAdopt for each fragment element.
     *
     * @param {Element} fragment
     * @private
     */
    _ensureCanAdoptFragment(fragment: Element) {
        let fragmentChild = fragment.firstChild;
        while (fragmentChild) {
            this._ensureCanAdopt(fragmentChild);
            fragmentChild = fragmentChild.nextSibling;
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
            this.firstChild = previousChild;
            previousChild.previousSibling = null;
            setParentElement(previousChild, this);
            if (newChildren.length > 1) {
                // TODO(flow): error with only `let child;`
                let child = newChildren[1];
                for (let i = 1; i < newChildren.length; i++) {
                    child = newChildren[i];
                    child.previousSibling = previousChild;
                    setParentElement(child, this);
                    previousChild.nextSibling = child;
                    previousChild = child;
                }
                child.nextSibling = null;
                this.lastChild = child;
            } else {
                previousChild.nextSibling = null;
                this.lastChild = previousChild;
            }
        } else {
            this.firstChild = this.lastChild = null;
        }

        this.childElements = newChildren;
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
        let clonedChildren: Element[] = new Array(this.childElements.length);
        for (let i = 0; i < clonedChildren.length; i++) {
            clonedChildren[i] = this.childElements[i].cloneElement();
        }
        let objectToClone = ((this: any): ConcreteElement);
        return new objectToClone.constructor(clonedChildren);
    }
}

/**
 * Artificial class for correct flow behaviour.
 */
class ConcreteElement extends Element {
    constructor(children: Element[]) {
        super('ConcreteElement', children);
    }
}

function setParentElement(element: Element, parentElement: ?Element) {
    element.parentElement = parentElement;
    if (element._onSetParentElement) {
        element._onSetParentElement(parentElement);
    }
}
