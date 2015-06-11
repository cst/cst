import Node from './node';
import NodeList from './NodeList';

export default class Token extends Node {
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
        this._code = code;
        this._codeLength = code.length;
        this._isComment = isComment;
        this._isWhitespace = isWhitespace;
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

    get firstToken() {
        return this;
    }

    get lastToken() {
        return this;
    }

    get code() {
        return this._code;
    }

    get codeLength() {
        return this._codeLength;
    }

    _setChildren(newChildren) {
        if (newChildren.length > 0) {
            throw new Error('Token nodes cannot contain child nodes');
        }

        this._children = newChildren;
        this._childNodes = new NodeList(newChildren);
    }

    _initChildren(initialChildren) {
        this._setChildren(initialChildren);
    }
}
