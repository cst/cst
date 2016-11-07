import Node from '../Node';
import getFunctionParams from './utils/getFunctionParams';

const getterAndSetter = {
    get: true,
    set: true,
};

export default class ClassMethod extends Node {
    constructor(childNodes) {
        super('ClassMethod', childNodes);
        this.isFunction = true;
    }

    _acceptChildren(children) {
        let key;
        let computed;
        let kind;
        let staticMember = false;
        let generator = false;
        let async = false;
        let params;

        if (children.isToken('Identifier', 'static')) {
            staticMember = true;
            children.passToken();
            children.skipNonCode();
        }

        if (children.isToken('Identifier', 'async')) {
            async = true;
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
            children.passNode();
            children.skipNonCode();
        }

        params = getFunctionParams(children);
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this.params = params;
        this.async = async;
        this.body = body;
        this.generator = generator;
        this.kind = kind;
        this.key = key;
        this.computed = computed;
        this.static = staticMember;
    }
}
