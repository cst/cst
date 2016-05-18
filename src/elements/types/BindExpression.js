import Expression from '../Expression';

export default class BindExpression extends Expression {
    constructor(childNodes) {
        super('BindExpression', childNodes);
    }

    _acceptChildren(children) {
        let object = null;
        let callee = null;

        // Guard for `call(::console.log)` cases
        if (!children.isToken('Punctuator', '::')) {
            object = children.passExpressionOrWhitespace();
            children.skipNonCode();
        }

        children.passToken('Punctuator', '::');
        children.skipNonCode();

        callee = children.passExpression();

        children.assertEnd();

        this.callee = callee;
        this.object = object;
    }
}
