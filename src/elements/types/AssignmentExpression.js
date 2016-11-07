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
    '&=': true,
    '**=': true,
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

        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}
