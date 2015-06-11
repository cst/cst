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
    constructor(childNodes) {
        super('BinaryExpression', childNodes);
    }

    _acceptChildren(children) {
        let left = children.getExpression();
        children.skipNonCode();
        if (children.currentElement.type === 'Punctuator' || children.currentElement.type === 'Keyword') {
            children.assertToken(children.currentElement.type, binaryOperators);
        } else {
            children.assertToken('Punctuator');
        }
        let operator = children.currentElement.value;
        children.moveNext();
        children.skipNonCode();
        let right = children.getExpression();
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
