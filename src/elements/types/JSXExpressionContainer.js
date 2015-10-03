import Expression from '../Expression';

export default class JSXExpressionContainer extends Expression {
    constructor(childNodes) {
        super('JSXExpressionContainer', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Punctuator', '{');
        children.skipNonCode();
        // Expression | JSXEmptyExpression
        let expression = children.passExpression();
        children.skipNonCode();
        children.passToken('Punctuator', '}');
        children.assertEnd();

        this._expression = expression;
    }

    get expression() {
        return this._expression;
    }
}
