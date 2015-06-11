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

    get currentPosition() {
        return this._position;
    }

    assertToken(tokenType, tokenValue) {
        let {isToken, type, value} = this._currentElement || {};

        if (!isToken) {
            throw new Error(`Token expected but Node "${type}" found`);
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

    passToken(tokenType, tokenValue) {
        this.assertToken.apply(this, arguments);
        this.moveNext();
    }

    assertNode(nodeType) {
        let {isNode, type} = this._currentElement || {};

        if (type !== nodeType) {
            throw new Error(`Expected node type "${nodeType}" but "${this._currentType}" found`);
        }
    }

    assertExpression(nodeType) {
        let {isExpression, type} = this._currentElement || {};

        if (!isExpression) {
            throw new Error(`Expression expected but Node "${type}" found`);
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
            throw new Error(`Expression expected but Node "${type}" found`);
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

        if (!isToken || type !== tokenType) {
            return false;
        }

        return !(arguments.length === 2 && value !== tokenValue);
    }

    getExpression() {
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

    getAssignable() {
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

    skipNonCode() {
        while (true) {
            let {isWhitespace, isComment} = this._currentElement || {};
            if (!isWhitespace && !isComment) {
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

    reset(position) {
        if (arguments.length === 1) {
            this._navigate(position);
        } else {
            this._navigate(0);
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
