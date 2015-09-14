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

        this._argument = argument;
        this._delegate = delegate;
    }

    get argument() {
        return this._argument;
    }

    get delegate() {
        return this._delegate;
    }
}
