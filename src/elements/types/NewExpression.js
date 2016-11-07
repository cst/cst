import Expression from '../Expression';
import acceptArgumentList from './utils/acceptArgumentList';

export default class NewExpression extends Expression {
    constructor(childNodes) {
        super('NewExpression', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'new');
        children.skipNonCode();

        this.callee = children.passExpression();
        this.arguments = children.isEnd ? [] : acceptArgumentList(children);
    }
}
