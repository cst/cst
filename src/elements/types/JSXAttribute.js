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
            value = children.passOneOfNode(['StringLiteral', 'JSXExpressionContainer', 'JSXElement']);
        }
        children.assertEnd();

        this.name = name;
        this.value = value;
    }
}
