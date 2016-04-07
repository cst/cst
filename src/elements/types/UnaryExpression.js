import Expression from '../Expression';

const unaryOperators = {
    '-': true,
    '+': true,
    '!': true,
    '~': true,
    'typeof': true,
    'void': true,
    'delete': true
};

export default class UnaryExpression extends Expression {

    // TODO: Should respect operator precedence: putting "-a" after "b" without parens should raise an error.

    constructor(childNodes) {
        super('UnaryExpression', childNodes);
        this.prefix = true;
    }

    _acceptChildren(children) {
        if (children.currentElement.type === 'Punctuator' || children.currentElement.type === 'Keyword') {
            children.assertToken(children.currentElement.type, unaryOperators);
        } else {
            children.assertToken('Punctuator');
        }

        let operator = children.passToken().value;
        children.skipNonCode();

        let argument = children.passExpression();

        children.assertEnd();

        this.argument = argument;
        this.operator = operator;
    }
}
