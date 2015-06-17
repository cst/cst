import Element from './Element';
import ElementList from './ElementList';
import {countLineBreaks} from '../utils/lines';

export default class Token extends Element {
    constructor(type, value) {
        super(type, []);
        let isComment = false;
        let isWhitespace = false;
        let code = value;
        switch (type) {
            case 'Line':
                code = '//' + code;
                isComment = true;
                break;
            case 'Block':
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

    get lineBreakCount() {
        if (this._newLines === undefined) {
            this._newLines = countLineBreaks(this._sourceCode);
        }
        return this._newLines;
    }

    _setChildren(newChildren) {
        if (newChildren.length > 0) {
            throw new Error('Token nodes cannot contain child nodes');
        }
    }
}
