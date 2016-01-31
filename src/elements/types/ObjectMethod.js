import Node from '../Node';

const getterAndSetter = {
    get: true,
    set: true
};

export default class ObjectMethod extends Node {
    constructor(childNodes) {
        super('ObjectMethod', childNodes);
    }

    _acceptChildren(children) {
        let key;
        let value;
        let generator = false;
        let method = false;
        let computed = false;
        let kind;

        if (children.isToken('Punctuator', '*')) {
            children.passToken();
            children.skipNonCode();
            generator = true;
        }

        if (children.isToken('Identifier', getterAndSetter)) {
            kind = children.currentElement.value;
            children.passToken();
            children.skipNonCode();

            computed = children.isToken('Punctuator', '[');
            key = readKey(children);
            children.skipNonCode();

            value = children.passNode('FunctionExpression');
        } else {
            kind = 'method';
            computed = children.isToken('Punctuator', '[');
            key = readKey(children);

            children.skipNonCode();
            if (children.isNode('FunctionExpression')) {
                method = true;
                value = children.passNode('FunctionExpression');
            } else {
                children.passToken('Punctuator', ':');
                children.skipNonCode();
                if (children.currentElement.isPattern) {
                    value = children.passPattern();
                } else {
                    value = children.passExpression();
                }
            }
        }

        children.assertEnd();

        this._generator = generator;
        this._kind = kind;
        this._key = key;
        this._value = value;
        this._computed = computed;
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

    get method() {
        return this._method;
    }

    get computed() {
        return this._computed;
    }
}

function readKey(children) {
    if (children.isNode('StringLiteral') || children.isNode('Identifier')) {
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
