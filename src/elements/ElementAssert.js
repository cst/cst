/* @flow */

import type Element from './Element';

/**
 * Element assertion class.
 * Used in specific Node types to check children for syntax correctness.
 *
 */
export default class ElementAssert {
    /**
     * @param {Element[]} elements
     */
    constructor(elements: Array<Element>) {
        this._elements = elements;
        this._currentElement = null;

        if (elements.length > 0) {
            this._navigate(0);
        }
    }

    _elements: Array<Element>;
    _currentElement: Element;
    _position: number;

    /**
     * True if end of child list was reached.
     *
     * @returns {Boolean}
     */
    get isEnd(): boolean {
        return this._currentElement === null;
    }

    /**
     * Currect element or null if end of child list was reached.
     *
     * @returns {Element|null}
     */
    get currentElement(): ?Element {
        return this._currentElement;
    }

    /**
     * Asserts that the current element is a token.
     * Can also check for token type and value.
     *
     * @param {String} [tokenType]
     * @param {String|Object} [tokenValue] if object is given, checks if value of token exists as object key.
     */
    assertToken(tokenType: string, tokenValue: string | Object): void {
        let {isToken, type, value} = this._currentElement || {};

        if (!isToken) {
            throw new Error(`Token expected but "${type}" found`);
        }

        if (arguments.length > 0 && type !== tokenType) {
            throw new Error(`Expected token type "${tokenType}" but "${type}" found`);
        }

        if (arguments.length === 2) {
            if (typeof tokenValue === 'object' && tokenValue !== null) {
                if (!tokenValue[value]) {
                    throw new Error(`Expected token value (${Object.keys(tokenValue).join(', ')}) but ${value} found`);
                }
            } else if (tokenValue !== value) {
                throw new Error(`Expected token value "${tokenValue}" but ${value} found`);
            }
        }
    }

    /**
     * Asserts that the current element is a node.
     * Can also check for node type.
     *
     * @param {String} nodeType
     */
    assertNode(nodeType: string): void {
        let {isNode, type} = this._currentElement || {};

        if (!isNode) {
            throw new Error(`Node expected but "${type}" found`);
        }

        if (arguments.length > 0 && type !== nodeType) {
            throw new Error(`Expected node type "${nodeType}" but "${type}" found`);
        }
    }

    /**
     * Asserts that the current element is a node.
     * Can also check if any of the node type are satisfied.
     *
     * @param {Array} nodeTypes
     */
    assertOneOfNode(nodeTypes: Array<string>): void {
        let {isNode, type} = this._currentElement || {};

        if (!isNode) {
            throw new Error(`Node expected but "${type}" found`);
        }

        if (arguments.length > 0 && nodeTypes.indexOf(type) === -1) {
            throw new Error(`Expected one of node types "${nodeTypes}" but "${type}" found`);
        }
    }

    /**
     * Asserts that the current element is an expression.
     */
    assertExpression(): void {
        let {isExpression, type} = this._currentElement || {};

        if (!isExpression) {
            throw new Error(`Expression expected but "${type}" found`);
        }
    }

    /**
     * Asserts that the current element is an assignment.
     */
    assertAssignable(): void {
        let {isAssignable, type} = this._currentElement || {};

        if (!isAssignable) {
            throw new Error(`Expected assignable expression but ${type} found.`);
        }
    }

    /**
     * Asserts that the current element is a pattern.
     */
    assertPattern(): void {
        let {isPattern, type} = this._currentElement || {};

        if (!isPattern) {
            throw new Error(`Expected pattern but ${type} found.`);
        }
    }

    /**
     * Asserts that the current element is a statement.
     */
    assertStatement(): void {
        let {isStatement, type} = this._currentElement || {};

        if (!isStatement) {
            throw new Error(`Statement expected but "${type}" found`);
        }
    }

    /**
     * Asserts that the current element is a statement.
     */
    assertModuleSpecifier(): void {
        let {isModuleSpecifier, type} = this._currentElement || {};

        if (!isModuleSpecifier) {
            throw new Error(`ModuleSpecifier expected but "${type}" found`);
        }
    }

    /**
     * Asserts that the end of child list was reached.
     */
    assertEnd(): void {
        if (this._currentElement !== null) {
            let {type} = this._currentElement;
            throw new Error(`Expected end of node list but "${type}" found`);
        }
    }

    /**
     * Checks if the current element is a token.
     * Can also check for token type and value.
     *
     * @param {String} [tokenType]
     * @param {String|Object} [tokenValue] if object is given, checks if value of token exists as object key.
     * @returns {Boolean}
     */
    isToken(tokenType: string, tokenValue?: string | Object): boolean {
        let {isToken, type, value} = this._currentElement || {};

        if (!isToken || (arguments.length > 0 && type !== tokenType)) {
            return false;
        }

        if (arguments.length === 2) {
            if (typeof tokenValue === 'object' && tokenValue !== null) {
                return Boolean(tokenValue[value]);
            }
            return tokenValue === value;
        }

        return true;
    }

    /**
     * Checks if the current element is a node.
     * Can also check for token type and value.
     *
     * @param {String} [nodeType]
     * @returns {Boolean}
     */
    isNode(nodeType: string): boolean {
        let {isNode, type} = this._currentElement || {};

        return !(!isNode || (arguments.length > 0 && type !== nodeType));
    }

    /**
     * Checks if the current element is a statement.
     *
     * @returns {Boolean}
     */
    isStatement(): boolean {
        let {isStatement} = this._currentElement || {};

        return isStatement;
    }

    /**
     * Checks if current element is token (can also check type and value),
     * returns current element and move pointer to the next element.
     *
     * @param {String} [tokenType]
     * @param {String|Object} [tokenValue]
     * @returns {Element}
     */
    passToken(tokenType: string, tokenValue?: string | Object): Element {
        this.assertToken.apply(this, arguments);
        let token = this._currentElement;
        this.moveNext();
        return token;
    }

    /**
     * Checks if current element is a node (can also check type),
     * returns current element and move pointer to the next element.
     *
     * @param {String} [nodeType]
     * @returns {Element}
     */
    passNode(nodeType: string): Element {
        this.assertNode.apply(this, arguments);
        let node = this._currentElement;
        this.moveNext();
        return node;
    }

    /**
     * Checks if current element is a node (can also check if any types are satisfied),
     * returns current element and move pointer to the next element.
     *
     * @param {Array} [nodeTypes]
     * @returns {Element}
     */
    passOneOfNode(nodeTypes: Array<string>): Element {
        this.assertOneOfNode(nodeTypes);
        let node = this._currentElement;
        this.moveNext();
        return node;
    }

    /**
     * Checks if current element is an expression,
     * returns current element and move pointer to the next element.
     * Ignores parentheses.
     *
     * @returns {Element}
     */
    passExpression(): Element {
        return this._passExpressionInParens(expression => expression.isExpression);
    }

    /**
     * Checks if current element is an expression or whitespace
     * returns current element and move pointer to the next element.
     * Ignores parentheses.
     *
     * @returns {Element}
     */
    passExpressionOrWhitespace(): Element {
        return this._passExpressionInParens(expression => expression.isExpression || expression.isWhitespace);
    }

    /**
     * Checks if current element is an expression or super,
     * returns current element and move pointer to the next element.
     * Ignores parentheses.
     *
     * @returns {Element}
     */
    passExpressionOrSuper(): Element {
        return this._passExpressionInParens(expression => expression.isExpression || expression.type === 'Super');
    }

    /**
     * Checks if current element is an expression or SpreadElement,
     * returns current element and move pointer to the next element.
     * Ignores parentheses.
     *
     * @returns {Element}
     */
    passExpressionOrSpreadElement(): Element {
        return this._passExpressionInParens(
            expression => expression.isExpression || expression.type === 'SpreadElement');
    }

    /**
     * Passes expression ignoring parentheses, returns element and move pointer to the next element.
     *
     * @param {Function} assertCallback
     * @returns {Element}
     * @private
     */
    _passExpressionInParens(assertCallback: Function): Element {
        let openParens = 0;

        while (this._currentElement.type === 'Punctuator' && this._currentElement.value === '(') {
            openParens++;
            this.moveNext();
            this.skipNonCode();
        }

        let expression = this._currentElement;

        if (!assertCallback(expression)) {
            throw new Error(`Expression expected but "${expression.type}" found`);
        }

        this.moveNext();

        while (openParens--) {
            this.skipNonCode();
            this.assertToken('Punctuator', ')');
            this.moveNext();
        }

        return expression;
    }

    /**
     * Checks if current element is an assignable, returns current element and move pointer to the next element.
     * Ignores parentheses.
     *
     * @returns {Element}
     */
    passAssignable(): Element {
        return this._passExpressionInParens(expression => expression.isAssignable);
    }

    /**
     * Checks if current element is a statement,
     * returns current element and move pointer to the next element.
     *
     * @returns {Element}
     */
    passStatement(): Element {
        this.assertStatement();
        let result = this._currentElement;
        this.moveNext();
        return result;
    }

    /**
     * Checks if current element is a pattern,
     * returns current element and move pointer to the next element.
     *
     * @returns {Element}
     */
    passPattern(): Element {
        this.assertPattern();
        let result = this._currentElement;
        this.moveNext();
        return result;
    }

    /**
     * Checks if current element is a module specifier,
     * returns current element and move pointer to the next element.
     *
     * @returns {Element}
     */
    passModuleSpecifier(): Element {
        this.assertModuleSpecifier();
        let result = this._currentElement;
        this.moveNext();
        return result;
    }

    /**
     * Skips comments and whitespace.
     */
    skipNonCode() {
        while (true) {
            let {isCode} = this._currentElement || {};
            if (isCode !== false) {
                break;
            }
            this.moveNext();
        }
    }

    /**
     * Skips comments and whitespace on the same line.
     */
    skipSameLineNonCode() {
        while (true) {
            let {isCode} = this._currentElement || {};
            if (isCode !== false) {
                break;
            }

            if (this._currentElement.newlineCount > 0) {
                break;
            }

            this.moveNext();
        }
    }

    /**
     * Skips a semicolon.
     */
    skipSemicolon() {
        if (this._currentElement && this._currentElement.type === 'Punctuator' && this._currentElement.value === ';') {
            this.moveNext();
        }
    }

    /**
     * Moves pointer (currentElement) to next element.
     */
    moveNext() {
        this._navigate(this._position + 1);
    }

    /**
     * Navigates to specified child position.
     *
     * @param {Number} position
     * @private
     */
    _navigate(position: number) {
        this._position = position;
        this._currentElement = this._elements[position] || null;
    }
}
