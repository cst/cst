import Expression from '../Expression';

export default class JSXNamespacedName extends Expression {
    constructor(childNodes) {
        super('JSXNamespacedName', childNodes);
    }

    _acceptChildren(children) {
        let namespace = children.passNode('JSXIdentifier');
        children.skipNonCode();
        children.passToken('Punctuator', ':');
        children.skipNonCode();
        let name = children.passNode('JSXIdentifier');
        children.assertEnd();

        this.namespace = namespace;
        this.name = name;
    }
}
