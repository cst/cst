import Statement from '../Statement';

export default class ExpressionStatement extends Statement {
    constructor(childNodes) {
        super('ExpressionStatement', childNodes);
    }

    _acceptChildren(children) {
        this._expression = children.passExpression();
        children.skipNonCode();
        children.skipSemicolon();
        children.assertEnd();
    }

    get expression() {
        return this._expression;
    }
}
