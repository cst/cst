import Expression from '../Expression';

export default class JSXIdentifier extends Expression {
    constructor(childNodes) {
        super('JSXIdentifier', childNodes);
        this.isPattern = true;
        this.isAssignable = true;
    }

    _acceptChildren(children) {
        let name = children.passToken('JSXIdentifier').value;
        children.assertEnd();

        this.name = name;
    }
}
