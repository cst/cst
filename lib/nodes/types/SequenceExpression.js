import Expression from '../Expression';
import ElementList from '../ElementList';

export default class SequenceExpression extends Expression {
    constructor(childNodes) {
        super('SequenceExpression', childNodes);
    }

    _acceptChildren(children) {
        let expressions = [];

        expressions.push(children.passExpression());
        children.skipNonCode();

        do {
            children.passToken('Punctuator', ',');
            children.skipNonCode();
            expressions.push(children.passExpression());
            children.skipNonCode();
        } while (!children.isEnd);

        children.assertEnd();

        this._expressions = new ElementList(expressions);
    }

    get expressions() {
        return this._expressions;
    }
}
