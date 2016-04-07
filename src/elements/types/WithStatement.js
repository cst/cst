import Statement from '../Statement';

export default class WithStatement extends Statement {
    constructor(childNodes) {
        super('WithStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'with');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        let object = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this.object = object;
        this.body = body;
    }
}
