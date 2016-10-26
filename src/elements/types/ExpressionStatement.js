import Statement from '../Statement';

export default class ExpressionStatement extends Statement {
    constructor(childNodes) {
        super('ExpressionStatement', childNodes);
    }

    _acceptChildren(children) {
        let expression = children.passExpression();
        children.skipNonCode();
        children.skipSemicolon();
        children.assertEnd();
        this.expression = expression;
    }
}
