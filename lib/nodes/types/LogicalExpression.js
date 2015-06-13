import Expression from '../Expression';

const logicalOperators = {
    '||': true,
    '&&': true
};

export default class LogicalExpression extends Expression {
    constructor(childNodes) {
        super('LogicalExpression', childNodes);
    }

    _acceptChildren(children) {
        let left = children.passExpression();
        children.skipNonCode();

        let operator = children.passToken('Punctuator', logicalOperators).value;
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
