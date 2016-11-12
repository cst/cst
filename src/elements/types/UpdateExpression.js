import Expression from '../Expression';

const updateOperators = {
    '++': true,
    '--': true,
};

export default class UpdateExpression extends Expression {

    // TODO: Should respect operator precedence: putting "++a" after "b" without parens should raise an error.

    constructor(childNodes) {
        super('UpdateExpression', childNodes);
    }

    _acceptChildren(children) {
        let operator;
        let argument;
        let prefix;

        if (children.isToken('Punctuator', updateOperators)) {
            operator = children.passToken().value;
            children.skipNonCode();
            argument = children.passAssignable();
            prefix = true;
        } else {
            argument = children.passAssignable();
            children.skipNonCode();
            operator = children.passToken().value;
            prefix = false;
        }

        children.assertEnd();

        this.argument = argument;
        this.operator = operator;
        this.prefix = prefix;
    }
}
