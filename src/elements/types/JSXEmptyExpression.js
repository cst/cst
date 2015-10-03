import Expression from '../Expression';

export default class JSXEmptyExpression extends Expression {
    constructor(childNodes) {
        super('JSXEmptyExpression', childNodes);
    }

    _acceptChildren(children) {
        children.assertEnd();
    }
}
