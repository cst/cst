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
        children.assertAssignable();
        this._left = children.currentNode;
        children.moveNext();
        children.skipNonCode();
        children.assertTokenValueUsingHash('Punctuator', assignmentOperators);
        this._operator = children.currentNode.value;
        children.moveNext();
        children.skipNonCode();
        this._right = children.getExpression();
        children.assertEnd();
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
