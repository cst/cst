import Statement from '../Statement';

export default class WhileStatement extends Statement {
    constructor(childNodes) {
        super('WhileStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'while');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        let test = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this.test = test;
        this.body = body;
    }
}
