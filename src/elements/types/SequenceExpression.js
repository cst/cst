import Expression from '../Expression';

export default class SequenceExpression extends Expression {

    // TODO: Should respect operator precedence: putting "a + b" before " * b" without parens should raise an error.

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

        this.expressions = expressions;
    }
}
