import Expression from '../Expression';

export default class ThisExpression extends Expression {
    constructor(childNodes) {
        super('ThisExpression', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'this');
        children.assertEnd();
    }
}
