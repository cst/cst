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

            key = children.passNode('Identifier');
            children.skipNonCode();

            value = children.passNode('FunctionExpression');
        } else {
            kind = 'init';
            if (children.currentElement.type !== 'Literal') {
                children.assertNode('Identifier');
            }

            key = children.passNode();

            if (children.isEnd) {
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
