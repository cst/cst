import Expression from '../Expression';

export default class ConditionalExpression extends Expression {

    // TODO: Should respect operator precedence: putting "a + b" before " * b" without parens should raise an error.

    constructor(childNodes) {
        super('ConditionalExpression', childNodes);
    }

    _acceptChildren(children) {
        let test = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', '?');
        children.skipNonCode();

        let consequent = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ':');
        children.skipNonCode();

        let alternate = children.passExpression();
        children.assertEnd();

        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }
}
