import Statement from '../Statement';

export default class DoWhileStatement extends Statement {
    constructor(childNodes) {
        super('DoWhileStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'do');
        children.skipNonCode();

        let body = children.passStatement();
        children.skipNonCode();

        children.passToken('Keyword', 'while');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        let test = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ')');
        children.skipNonCode();
        children.skipSemicolon();

        children.assertEnd();

        this.test = test;
        this.body = body;
    }
}
