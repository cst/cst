export default class ElementAssert {
    constructor(nodes) {
        this._nodes = nodes;
        this._currentElement = null;

        if (nodes.length > 0) {
            this._navigate(0);
        }
    }

    get isEnd() {
        return this._currentElement === null;
    }

    get currentElement() {
        return this._currentElement;
    }

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

    assertNode(nodeType) {
        let {isNode, type} = this._currentElement || {};

        if (!isNode) {
            throw new Error(`Node expected but "${type}" found`);
        }

        if (arguments.length > 0 && type !== nodeType) {
            throw new Error(`Expected node type "${nodeType}" but "${type}" found`);
        }
    }

    assertExpression(nodeType) {
        let {isExpression, type} = this._currentElement || {};

        if (!isExpression) {
            throw new Error(`Expression expected but "${type}" found`);
        }

        if (arguments.length > 0) {
            if (type !== nodeType) {
                throw new Error(`Expected node type "${nodeType}" but "${type}" found`);
            }
        }
    }

    assertAssignable() {
        let {isAssignable, type} = this._currentElement || {};

        if (!isAssignable) {
            throw new Error(`Expected assignable expression but ${type} found.`);
        }
    }

    assertPattern() {
        let {isPattern, type} = this._currentElement || {};

        if (!isPattern) {
            throw new Error(`Expected pattern but ${type} found.`);
        }
    }

    assertStatement(nodeType) {
        let {isStatement, type} = this._currentElement || {};

        if (!isStatement) {
            throw new Error(`Statement expected but "${type}" found`);
        }

        if (arguments.length > 0) {
            if (type !== nodeType) {
                throw new Error(`Expected node type "${nodeType}" but "${type}" found`);
            }
        }
    }

    assertEnd() {
        if (this._currentElement !== null) {
            let {type} = this._currentElement;
            throw new Error(`Expected end of node list but "${type}" found`);
        }
    }

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

    isNode(nodeType) {
        let {isNode, type} = this._currentElement || {};

        return !(!isNode || (arguments.length > 0 && type !== nodeType));
    }

    passToken(tokenType, tokenValue) {
        this.assertToken.apply(this, arguments);
        let token = this.currentElement;
        this.moveNext();
        return token;
    }

    passNode(tokenType, tokenValue) {
        this.assertNode.apply(this, arguments);
        let node = this.currentElement;
        this.moveNext();
        return node;
    }

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

    passStatement() {
        this.assertStatement();
        let result = this.currentElement;
        this.moveNext();
        return result;
    }

    passPattern() {
        this.assertPattern();
        let result = this.currentElement;
        this.moveNext();
        return result;
    }

    skipNonCode() {
        while (true) {
            let {isWhitespace, isComment} = this._currentElement || {};
            if (!isWhitespace && !isComment) {
                break;
            }
            this.moveNext();
        }
    }

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

    skipSemicolon() {
        if (this._currentElement && this._currentElement.type === 'Punctuator' && this._currentElement.value === ';') {
            this.moveNext();
        }
    }

    moveNext() {
        this._navigate(this._position + 1);
    }

    _navigate(position) {
        this._position = position;
        this._currentElement = this._nodes[position] || null;
    }
}
