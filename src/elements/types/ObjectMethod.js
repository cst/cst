import Node from '../Node';
import getFunctionParams from './utils/getFunctionParams';

const getterAndSetter = {
    get: true,
    set: true
};

export default class ObjectMethod extends Node {
    constructor(childNodes) {
        super('ObjectMethod', childNodes);
        this.isFunction = true;
    }

    _acceptChildren(children) {
        let key;
        let value;
        let generator = false;
        let method = false;
        let computed = false;
        let kind;
        let params = [];
        let body;

        if (children.isToken('Punctuator', '*')) {
            children.passToken();
            children.skipNonCode();
            generator = true;
        }

        if (children.isToken('Identifier', getterAndSetter)) {
            kind = children.currentElement.value;

            children.passToken('Identifier');
            children.skipNonCode();

            computed = children.isToken('Punctuator', '[');
            key = readKey(children);

            children.skipNonCode();

            params = getFunctionParams(children);
            children.skipNonCode();

            body = children.passNode('BlockStatement');
        } else {
            kind = 'method';
            computed = children.isToken('Punctuator', '[');
            key = readKey(children);

            children.skipNonCode();

            if (children.isToken('Punctuator')) {
                method = true;

                params = getFunctionParams(children);
                children.skipNonCode();

                body = children.passNode('BlockStatement');

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
        this.kind = kind;
        this.key = key;
        this.value = value;
        this.computed = computed;
        this.method = method;
        this.params = params;
        this.body = body;
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
