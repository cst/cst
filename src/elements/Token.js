import Element from './Element';
import {getLines} from '../utils/lines';

export default class Token extends Element {
    constructor(type, value) {
        super(type, []);
        let isComment = false;
        let isWhitespace = false;
        let code = value;
        switch (type) {
            case 'LineComment':
                code = '//' + code;
                isComment = true;
                break;
            case 'BlockComment':
                code = '/*' + code + '*/';
                isComment = true;
                break;
            case 'Whitespace':
                isWhitespace = true;
                break;
        }
        this._value = value;
        this._sourceCode = code;
        this._sourceCodeLength = code.length;
        this._sourceCodeLines = getLines(code);
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
        return new Token(this._type, this._value);
    }
}
