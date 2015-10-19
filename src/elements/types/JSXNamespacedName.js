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

        this._namespace = namespace;
        this._name = name;
    }

    get namespace() {
        return this._namespace;
    }

    get name() {
        return this._name;
    }
}
