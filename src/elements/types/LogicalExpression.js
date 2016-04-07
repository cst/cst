import Expression from '../Expression';

const logicalOperators = {
    '||': true,
    '&&': true
};

export default class LogicalExpression extends Expression {

    // TODO: Should respect operator precedence: putting "a + b" before " * b" without parens should raise an error.

    constructor(childNodes) {
        super('LogicalExpression', childNodes);
    }

    _acceptChildren(children) {
        let left = children.passExpression();
        children.skipNonCode();

        let operator = children.passToken('Punctuator', logicalOperators).value;
        children.skipNonCode();

        let right = children.passExpression();
        children.assertEnd();

        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}
