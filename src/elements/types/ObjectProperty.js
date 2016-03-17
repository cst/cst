import Node from '../Node';

export default class ObjectProperty extends Node {
    constructor(childNodes) {
        super('ObjectProperty', childNodes);
    }

    _acceptChildren(children) {
        let key;
        let value;
        let shorthand = false;
        let computed = false;

        computed = children.isToken('Punctuator', '[');
        key = readKey(children);

        if (children.isEnd && key.type === 'Identifier') {
            shorthand = true;
            value = key;
        } else {
            children.skipNonCode();
            if (children.isNode('FunctionExpression')) {
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

        this._key = key;
        this._value = value;
        this._shorthand = shorthand;
        this._computed = computed;
    }

    get key() {
        return this._key;
    }

    get value() {
        return this._value;
    }

    get shorthand() {
        return this._shorthand;
    }

    get computed() {
        return this._computed;
    }
}

function readKey(children) {
    if (
        children.isNode('StringLiteral') ||
        children.isNode('NumericLiteral') ||
        children.isNode('Identifier')
    ) {
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
