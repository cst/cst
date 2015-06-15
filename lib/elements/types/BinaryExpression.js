import Expression from '../Expression';

const binaryOperators = {
    '==': true,
    '!=': true,
    '===': true,
    '!==': true,
    '<': true,
    '<=': true,
    '>': true,
    '>=': true,
    '<<': true,
    '>>': true,
    '>>>': true,
    '+': true,
    '-': true,
    '*': true,
    '/': true,
    '%': true,
    '|': true,
    '^': true,
    '&': true,
    'in': true,
    'instanceof': true
};

export default class BinaryExpression extends Expression {

    // TODO: Should respect operator precedence: putting "a + b" before " * b" without parens should raise an error.

    constructor(childNodes) {
        super('BinaryExpression', childNodes);
    }

    _acceptChildren(children) {
        let left = children.passExpression();
        children.skipNonCode();
        if (children.currentElement.type === 'Punctuator' || children.currentElement.type === 'Keyword') {
            children.assertToken(children.currentElement.type, binaryOperators);
        } else {
            children.assertToken('Punctuator');
        }
        let operator = children.passToken().value;
        children.skipNonCode();
        let right = children.passExpression();
        children.assertEnd();

        this._left = left;
        this._operator = operator;
        this._right = right;
    }

    get left() {
        return this._left;
    }

    get right() {
        return this._right;
    }

    get operator() {
        return this._operator;
    }
}
