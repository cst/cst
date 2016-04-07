import Expression from '../Expression';
import JSXEmptyExpression from './JSXEmptyExpression';

export default class JSXExpressionContainer extends Expression {
    constructor(childNodes) {
        super('JSXExpressionContainer', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Punctuator', '{');
        children.skipNonCode();

        let expression;

        // JSXEmptyExpression
        if (children.isToken('Punctuator', '}')) {
            expression = new JSXEmptyExpression();
        } else {
            // Expression
            expression = children.passExpression();
            children.skipNonCode();
        }

        children.passToken('Punctuator', '}');
        children.assertEnd();

        this.expression = expression;
    }
}
