import Expression from '../Expression';

export default class JSXIdentifier extends Expression {
    constructor(childNodes) {
        super('JSXIdentifier', childNodes);
    }

    _acceptChildren(children) {
        let name = children.passToken('JSXIdentifier').value;
        children.assertEnd();

        this._name = name;
    }

    get isPattern() {
        return true;
    }

    get isAssignable() {
        return true;
    }

    get name() {
        return this._name;
    }
}
