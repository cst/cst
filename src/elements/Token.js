/* @flow */

import Element from './Element';
import {getLines, getLineInfo} from '../utils/lines';

export default class Token extends Element {
    /**
     * Generic token constructor.
     *
     * @param {String} type
     * @param {*} value
     */
    static create(type: string, value: any): Token {
        return new Token(type, value, valueToSourceCode(type, value));
    }

    /**
     * Creates new token using babel/acorn parser token.
     *
     * @param {{type: String, value: String, sourceCode: String}} token
     */
    static createFromToken(token: {type: string, value: string, sourceCode: string}): Token {
        return new Token(token.type, token.value, token.sourceCode);
    }

    /**
     * @param {String} type
     * @param {String} value
     * @param {String} _sourceCode private source code argument
     */
    constructor(type: string, value: string, _sourceCode: string) {
        super(type, []);

        if (arguments.length === 2) {
            _sourceCode = valueToSourceCode(type, value);
        }

        let isComment = false;
        let isWhitespace = false;
        let isCode = true;
        switch (type) {
            case 'CommentLine':
                isComment = true;
                isCode = false;
                break;
            case 'CommentBlock':
                isComment = true;
                isCode = false;
                break;
            case 'Whitespace':
                isWhitespace = true;
                isCode = false;
                break;
            case 'AppleInstrumentationDirective':
            case 'GritDirective':
            case 'Hashbang':
                isCode = false;
                break;
        }
        this.value = value;
        this._sourceCode = _sourceCode;
        this._sourceCodeLength = _sourceCode.length;
        this._sourceCodeLines = getLines(_sourceCode);
        this.isToken = true;
        this.isComment = isComment;
        this.isWhitespace = isWhitespace;
        this.isCode = isCode;
        this.isNonCodeToken = !isCode;
    }

    value: string;
    _sourceCode: string;
    _sourceCodeLength: number;
    _sourceCodeLines: Array<string>;
    _isComment: boolean;
    _isWhitespace: boolean;
    _isCode: boolean;

    getFirstToken(): ?Token | Element {
        return this;
    }

    getLastToken(): ?Token | Element {
        return this;
    }

    getSourceCode(): string {
        return this._sourceCode;
    }

    getSourceCodeLength(): number {
        return this._sourceCodeLength;
    }

    getSourceCodeLines(): Array<string> {
        return this._sourceCodeLines;
    }

    getNewlineCount(): number {
        return this._sourceCodeLines.length - 1;
    }

    getValueLineInfo() {
        return getLineInfo(this.value);
    }

    _setChildren(newChildren: Array<any>): void {
        if (newChildren.length > 0) {
            throw new Error('Token nodes cannot contain child nodes');
        }

        this.childElements = newChildren;
    }

    /**
     * Clones current Element structure.
     *
     * @returns {Element}
     */
    cloneElement(): Token {
        return new Token(this.type, this.value, this._sourceCode);
    }
}

function valueToSourceCode(type: string, value: any): string {
    switch (type) {
        case 'CommentLine':
            return '//' + value;

        case 'CommentBlock':
            return '/*' + value + '*/';

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
