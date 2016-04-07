import Expression from '../Expression';

export default class YieldExpression extends Expression {

    // TODO: Requires a generator function.

    constructor(childNodes) {
        super('YieldExpression', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'yield');

        let argument = null;
        let delegate = false;

        if (!children.isEnd) {
            children.skipNonCode();

            if (children.isToken('Punctuator', '*')) {
                children.passToken();
                children.skipNonCode();
                delegate = true;
            }

            argument = children.passExpression();
        }

        children.assertEnd();

        this.argument = argument;
        this.delegate = delegate;
    }
}
