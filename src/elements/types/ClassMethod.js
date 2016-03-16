import Node from '../Node';

const getterAndSetter = {
    get: true,
    set: true
};

export default class ClassMethod extends Node {
    constructor(childNodes) {
        super('ClassMethod', childNodes);
    }

    _acceptChildren(children) {
        let key;
        let computed;
        let value;
        let kind;
        let staticMember = false;
        let generator = false;

        if (children.isToken('Identifier', 'static')) {
            staticMember = true;
            children.passToken();
            children.skipNonCode();
        }

        if (children.isToken('Identifier', getterAndSetter)) {
            kind = children.currentElement.value;
            children.passToken();
            children.skipNonCode();
        } else {
            kind = 'method';
            if (children.isToken('Punctuator', '*')) {
                generator = true;
                children.passToken();
                children.skipNonCode();
            }
        }

        if (children.isNode('Identifier')) {
            computed = false;
            key = children.passNode();
            if (kind === 'method' && key.type === 'Identifier' && key.name === 'constructor') {
                kind = 'constructor';
            }
            children.skipNonCode();
        } else {
            computed = true;
            children.passToken('Punctuator', '[');
            children.skipNonCode();
            key = children.passExpression();
            children.skipNonCode();
            children.passToken('Punctuator', ']');
            children.skipNonCode();
        }

        value = children.passNode('FunctionExpression');

        children.assertEnd();

        this._kind = kind;
        this._key = key;
        this._value = value;
        this._computed = computed;
        this._static = staticMember;
        this._generator = generator;
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

    get static() {
        return this._static;
    }

    get computed() {
        return this._computed;
    }
}
