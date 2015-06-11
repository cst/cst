export default class NodeAssert {
    constructor(nodes) {
        this._nodes = nodes;
        this._currentNode = null;
        this._direction = 1;

        if (nodes.length > 0) {
            this._navigate(0);
        }
    }

    get isEnd() {
        return this._currentNode === null;
    }

    get currentNode() {
        return this._currentNode;
    }

    get currentPosition() {
        return this._position;
    }

    assertToken(tokenType, tokenValue) {
        let {isToken, type, value} = this._currentNode || {};

        if (!isToken) {
            throw new Error(`Token expected but Node "${type}" found`);
        }

        if (arguments.length > 0 && type !== tokenType) {
            throw new Error(`Expected token type "${tokenType}" but "${type}" found`);
        }

        if (arguments.length === 2 && value !== tokenValue) {
            throw new Error(`Expected token value "${tokenValue}" but ${value} found`);
        }
    }

    assertTokenValueUsingHash(tokenType, tokenValues) {
        let {isToken, type, value} = this._currentNode || {};

        if (!isToken) {
            throw new Error(`Token expected but Node "${type}" found`);
        }

        if (type !== tokenType) {
            throw new Error(`Expected token type "${tokenType}" but "${type}" found`);
        }

        if (!tokenValues[value]) {
            throw new Error(`Expected token value (${Object.keys(tokenValues).join(', ')}) but ${value} found`);
        }
    }

    assertNode(nodeType) {
        let {type} = this._currentNode || {};

        if (type !== nodeType) {
            throw new Error(`Expected node type "${nodeType}" but "${this._currentType}" found`);
        }
    }

    assertExpression(nodeType) {
        let {isExpression, type} = this._currentNode || {};

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
        let {isAssignable, type} = this._currentNode || {};

        if (!isAssignable) {
            throw new Error(`Expected assignable expression but ${type} found.`);
        }
    }

    assertPattern() {
        let {isPattern, type} = this._currentNode || {};

        if (!isPattern) {
            throw new Error(`Expected pattern but ${type} found.`);
        }
    }

    assertStatement(nodeType) {
        let {isStatement, type} = this._currentNode || {};

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
        if (this._currentNode !== null) {
            let {type} = this._currentNode;
            throw new Error(`Expected end of node list but "${type}" found`);
        }
    }

    isToken(tokenType, tokenValue) {
        let {isToken, type, value} = this._currentNode || {};

        if (!isToken || type !== tokenType) {
            return false;
        }

        return !(arguments.length === 2 && value !== tokenValue);
    }

    getExpression() {
        let openBraces = 0;

        while (this._currentNode.type === 'Punctuator' && this._currentNode.value === '(') {
            openBraces++;
            this.moveNext();
            this.skipNonCode();
        }

        this.assertExpression();
        let expression = this._currentNode;
        this.moveNext();

        while (openBraces--) {
            this.skipNonCode();
            this.assertToken('Punctuator', ')');
            this.moveNext();
        }

        return expression;
    }

    skipNonCode() {
        while (true) {
            let {isWhitespace, isComment} = this._currentNode || {};
            if (!isWhitespace && !isComment) {
                break;
            }
            this.moveNext();
        }
    }

    skipSemicolon() {
        if (this._currentNode && this._currentNode.type === 'Punctuator' && this._currentNode.value === ';') {
            this.moveNext();
        }
    }

    reset(position) {
        if (arguments.length === 1) {
            this._navigate(position);
        } else {
            if (this._direction === 1) {
                this._navigate(0);
            } else {
                this._navigate(this._nodes.length - 1);
            }
        }
    }

    moveNext() {
        this._navigate(this._position + this._direction);
    }

    setDirection(newDirection) {
        this._direction = newDirection;
    }

    slice(startIndex, endIndex) {
        return new NodeAssert(this._nodes.slice(startIndex, endIndex));
    }

    _navigate(position) {
        this._position = position;
        this._currentNode = this._nodes[position] || null;
    }
}
