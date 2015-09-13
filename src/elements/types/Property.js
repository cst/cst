import Node from '../Node';

const getterAndSetter = {
    get: true,
    set: true
};

export default class Property extends Node {
    constructor(childNodes) {
        super('Property', childNodes);
    }

    _acceptChildren(children) {
        let key;
        let value;
        let shorthand = false;
        let method = false;
        let kind;

        if (children.isToken('Identifier', getterAndSetter)) {
            kind = children.currentElement.value;
            children.passToken();
            children.skipNonCode();

            key = readKey(children);
            children.skipNonCode();

            value = children.passNode('FunctionExpression');
        } else {
            kind = 'init';
            key = readKey(children);

            if (children.isEnd && key.type === 'Identifier') {
                shorthand = true;
                value = key;
            } else {
                children.skipNonCode();
                if (children.isNode('FunctionExpression')) {
                    method = true;
                    value = children.passNode('FunctionExpression');
                } else {
                    children.passToken('Punctuator', ':');
                    children.skipNonCode();
                    value = children.passExpression();
                }
            }
        }

        children.assertEnd();

        this._kind = kind;
        this._key = key;
        this._value = value;
        this._shorthand = shorthand;
        this._method = method;
    }

    get key() {
        return this._key;
    }

    get value() {
        return this._value;
    }

    get kind() {
        return this._kind;
    }

    get shorthand() {
        return this._shorthand;
    }

    get method() {
        return this._method;
    }
}

function readKey(children) {
    if (children.isNode('Literal') || children.isNode('Identifier')) {
        return children.passNode();
    } else {
        children.passToken('Punctuator', '[');
        children.skipNonCode();
        let result = children.passExpression();
        children.skipNonCode();
        children.passToken('Punctuator', ']');
        return result;
    }
}
