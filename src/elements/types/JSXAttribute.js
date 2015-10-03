import Node from '../Node';

export default class JSXAttribute extends Node {
    constructor(childNodes) {
        super('JSXAttribute', childNodes);
    }

    _acceptChildren(children) {
        let value = null;
        let name = children.passOneOfNode(['JSXIdentifier', 'JSXNamespacedName']);

        if (!children.isEnd) {
            children.skipNonCode();
            children.passToken('Punctuator', '=');
            children.skipNonCode();
            value = children.passOneOfNode(['Literal', 'JSXExpressionContainer', 'JSXElement']);
        }
        children.assertEnd();

        this._name = name;
        this._value = value;
    }

    get name() {
        return this._name;
    }

    get value() {
        return this._value;
    }
}
