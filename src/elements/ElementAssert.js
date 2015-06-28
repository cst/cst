/**
 * Element assertion class.
 * Used in specific Node types to check children for syntax correctness.
 */
export default class ElementAssert {
    /**
     * @param {Element[]} elements
     */
    constructor(elements) {
        this._elements = elements;
        this._currentElement = null;

        if (elements.length > 0) {
            this._navigate(0);
        }
    }

    /**
     * True if end of child list was reached.
     *
     * @returns {Boolean}
     */
    get isEnd() {
        return this._currentElement === null;
    }

    /**
     * Currect element or null if end of child list was reached.
     *
     * @returns {Element|null}
     */
    get currentElement() {
        return this._currentElement;
    }

    /**
     * Asserts that the current element is a token.
     * Can also check for token type and value.
     *
     * @param {String} [tokenType]
     * @param {String|Object} [tokenValue] if object is given, checks if value of token exists as object key.
     */
    assertToken(tokenType, tokenValue) {
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
    assertNode(nodeType) {
        let {isNode, type} = this._currentElement || {};

        if (!isNode) {
            throw new Error(`Node expected but "${type}" found`);
        }

        if (arguments.length > 0 && type !== nodeType) {
            throw new Error(`Expected node type "${nodeType}" but "${type}" found`);
        }
    }

    /**
     * Asserts that the current element is an expression.
     */
    assertExpression() {
        let {isExpression, type} = this._currentElement || {};

        if (!isExpression) {
            throw new Error(`Expression expected but "${type}" found`);
        }
    }

    /**
     * Asserts that the current element is an assignment.
     */
    assertAssignable() {
        let {isAssignable, type} = this._currentElement || {};

        if (!isAssignable) {
            throw new Error(`Expected assignable expression but ${type} found.`);
        }
    }

    /**
     * Asserts that the current element is a pattern.
     */
    assertPattern() {
        let {isPattern, type} = this._currentElement || {};

        if (!isPattern) {
            throw new Error(`Expected pattern but ${type} found.`);
        }
    }

    /**
     * Asserts that the current element is a statement.
     */
    assertStatement() {
        let {isStatement, type} = this._currentElement || {};

        if (!isStatement) {
            throw new Error(`Statement expected but "${type}" found`);
        }
    }

    /**
     * Asserts that the end of child list was reached.
     */
    assertEnd() {
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
    isToken(tokenType, tokenValue) {
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
    isNode(nodeType) {
        let {isNode, type} = this._currentElement || {};

        return !(!isNode || (arguments.length > 0 && type !== nodeType));
    }

    /**
     * Checks if current element is token (can also check type and value),
     * returns current element and move pointer to the next element.
     *
     * @param {String} [tokenType]
     * @param {String|Object} [tokenValue]
     * @returns {Element}
     */
    passToken(tokenType, tokenValue) {
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
    passNode(nodeType) {
        this.assertNode.apply(this, arguments);
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
    passExpression() {
        let openBraces = 0;

        while (this._currentElement.type === 'Punctuator' && this._currentElement.value === '(') {
            openBraces++;
            this.moveNext();
            this.skipNonCode();
        }

        this.assertExpression();
        let expression = this._currentElement;
        this.moveNext();

        while (openBraces--) {
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
    passAssignable() {
        let openBraces = 0;

        while (this._currentElement.type === 'Punctuator' && this._currentElement.value === '(') {
            openBraces++;
            this.moveNext();
            this.skipNonCode();
        }

        this.assertAssignable();
        let assignable = this._currentElement;
        this.moveNext();

        while (openBraces--) {
            this.skipNonCode();
            this.assertToken('Punctuator', ')');
            this.moveNext();
        }

        return assignable;
    }

    /**
     * Checks if current element is a statement,
     * returns current element and move pointer to the next element.
     *
     * @returns {Element}
     */
    passStatement() {
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
    passPattern() {
        this.assertPattern();
        let result = this._currentElement;
        this.moveNext();
        return result;
    }

    /**
     * Skips comments and whitespace.
     */
    skipNonCode() {
        while (true) {
            let {isWhitespace, isComment} = this._currentElement || {};
            if (!isWhitespace && !isComment) {
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
            let {isWhitespace, isComment} = this._currentElement || {};
            if (!isWhitespace && !isComment) {
                break;
            }

            if (this._currentElement.lineBreakCount > 0) {
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
    _navigate(position) {
        this._position = position;
        this._currentElement = this._elements[position] || null;
    }
}
