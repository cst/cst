import Element from './Element';
import {getLines} from '../utils/lines';

export default class Token extends Element {
    /**
     * Generic token constructor.
     *
     * @param {String} type
     * @param {*} value
     */
    static create(type, value) {
        return new Token(type, value, valueToSourceCode(type, value));
    }

    /**
     * Creates new token using babel/acorn parser token.
     *
     * @param {{type: String, value: String, sourceCode: String}} token
     */
    static createFromToken(token) {
        return new Token(token.type, token.value, token.sourceCode);
    }

    /**
     * @param {String} type
     * @param {String} value
     * @param {String} _sourceCode private source code argument
     */
    constructor(type, value, _sourceCode) {
        super(type, []);

        if (arguments.length === 2) {
            _sourceCode = valueToSourceCode(type, value);
        }

        let isComment = false;
        let isWhitespace = false;
        switch (type) {
            case 'CommentLine':
                isComment = true;
                break;
            case 'CommentBlock':
                isComment = true;
                break;
            case 'Whitespace':
                isWhitespace = true;
                break;
        }
        this._value = value;
        this._sourceCode = _sourceCode;
        this._sourceCodeLength = _sourceCode.length;
        this._sourceCodeLines = getLines(_sourceCode);
        this._isComment = isComment;
        this._isWhitespace = isWhitespace;
    }

    get firstToken() {
        return this;
    }

    get lastToken() {
        return this;
    }

    get isToken() {
        return true;
    }

    get isComment() {
        return this._isComment;
    }

    get isWhitespace() {
        return this._isWhitespace;
    }

    get value() {
        return this._value;
    }

    get sourceCode() {
        return this._sourceCode;
    }

    get sourceCodeLength() {
        return this._sourceCodeLength;
    }

    get sourceCodeLines() {
        return this._sourceCodeLines.concat();
    }

    get newlineCount() {
        return this._sourceCodeLines.length - 1;
    }

    _setChildren(newChildren) {
        if (newChildren.length > 0) {
            throw new Error('Token nodes cannot contain child nodes');
        }

        this._childElements = newChildren;
    }

    /**
     * Clones current Element structure.
     *
     * @returns {Element}
     */
    cloneElement() {
        return new Token(this._type, this._value, this._sourceCode);
    }
}

function valueToSourceCode(type, value) {
    switch (type) {
        case 'LineComment':
            return '//' + value;

        case 'BlockComment':
            return '/*' + value + '*/';

        case 'String':
            return JSON.stringify(value);

        case 'RegularExpression':
            return String(value);

        case 'Numeric':
        case 'Boolean':
        case 'Null':
            return String(value);

        default:
            return value;
    }
}
