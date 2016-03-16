import Node from '../Node';
import getFunctionParams from './utils/getFunctionParams';

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
        let params;

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

        if (children.isToken('Punctuator', '*')) {
            generator = true;
            children.moveNext();
            children.skipNonCode();
        }

        if (children.isNode('Identifier')) {
            id = children.passNode();
            children.skipNonCode();
        }

        params = getFunctionParams(children);
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this._params = params;
        this._body = body;
        this._generator = generator;
        this._kind = kind;
        this._key = key;
        this._computed = computed;
        this._static = staticMember;
    }

    get key() {
        return this._key;
    }

    get params() {
        return this._params.concat();
    }

    get body() {
        return this._body;
    }

    get kind() {
        return this._kind;
    }

    get static() {
        return this._static;
    }

    get generator() {
        return this._generator;
    }

    get computed() {
        return this._computed;
    }
}
