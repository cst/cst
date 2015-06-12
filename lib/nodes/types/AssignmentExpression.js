import Expression from '../Expression';

const assignmentOperators = {
    '=': true,
    '+=': true,
    '-=': true,
    '*=': true,
    '/=': true,
    '%=': true,
    '<<=': true,
    '>>=': true,
    '>>>=': true,
    '|=': true,
    '^=': true,
    '&=': true
};

export default class AssignmentExpression extends Expression {
    constructor(childNodes) {
        super('AssignmentExpression', childNodes);
    }

    _acceptChildren(children) {
        let left = children.passAssignable();
        children.skipNonCode();
        children.assertToken('Punctuator', assignmentOperators);
        let operator = children.currentElement.value;
        children.moveNext();
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
