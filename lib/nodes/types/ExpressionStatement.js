import Statement from '../Statement';

export default class ExpressionStatement extends Statement {
    constructor(childNodes) {
        super('ExpressionStatement', childNodes);
    }

    _acceptChildren(children) {
        children.assertExpression();
        this._expression = children.currentNode;
        children.moveNext();
        children.skipNonCode();
        children.skipSemicolon();
        children.assertEnd();
    }

    get expression() {
        return this._expression;
    }
}
