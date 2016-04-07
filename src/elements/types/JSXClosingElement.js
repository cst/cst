import Node from '../Node';

// TODO: create JSXBoundaryElement?
export default class JSXClosingElement extends Node {
    constructor(childNodes) {
        super('JSXClosingElement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Punctuator', '<');
        children.skipNonCode();
        children.passToken('Punctuator', '/');
        children.skipNonCode();
        let name = children.passOneOfNode(['JSXIdentifier', 'JSXMemberExpression', 'JSXNamespacedName']);
        children.skipNonCode();
        children.passToken('Punctuator', '>');
        children.assertEnd();

        this.name = name;
    }
}
