import Expression from '../Expression';
import acceptArgumentList from './utils/acceptArgumentList';

export default class CallExpression extends Expression {
    constructor(childNodes) {
        super('CallExpression', childNodes);
    }

    _acceptChildren(children) {
        this.callee = children.passExpressionOrSuper();
        this.arguments = acceptArgumentList(children);
    }
}
