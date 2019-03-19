import Expression from '../Expression';

export default class YieldExpression extends Expression {

    // TODO: Requires a generator function.

    constructor(childNodes) {
        super('YieldExpression', childNodes);
    }

    _acceptChildren(children) {
        // yield is not always a keyword. See:
        // https://github.com/babel/babel/issues/6719
        // https://github.com/babel/babel/pull/9400
        children.passToken('Identifier', 'yield');

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
