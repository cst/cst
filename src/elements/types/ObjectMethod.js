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
        let generator = false;
        let computed = false;
        let kind = 'method';
        let async = false;
        let params = [];
        let body;
        let method = true;

        if (children.isToken('Punctuator', '*')) {
            children.passToken();
            children.skipNonCode();
            generator = true;
        }

        if (children.isToken('Identifier', 'async')) {
            async = true;
            children.passToken();
            children.skipNonCode();
        }

        if (children.isToken('Identifier', getterAndSetter)) {
            kind = children.currentElement.value;
            method = false;

            children.passToken('Identifier');
            children.skipNonCode();
        }

        computed = children.isToken('Punctuator', '[');
        key = readKey(children);

        children.skipNonCode();

        params = getFunctionParams(children);
        children.skipNonCode();

        body = children.passNode('BlockStatement');

        children.assertEnd();

        this.generator = generator;
        this.kind = kind;
        this.key = key;
        this.computed = computed;
        this.method = method;
        this.params = params;
        this.body = body;
        this.async = async;
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
