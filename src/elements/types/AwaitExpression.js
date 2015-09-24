import Expression from '../Expression';

export default class AwaitExpression extends Expression {

    // TODO: Requires an async function.

    constructor(childNodes) {
        super('AwaitExpression', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Identifier', 'await');

        let argument = null;
        let all = false;

        if (!children.isEnd) {
            children.skipNonCode();

            if (children.isToken('Punctuator', '*')) {
                children.passToken();
                children.skipNonCode();
                all = true;
            }

            argument = children.passExpression();
        }

        children.assertEnd();

        this._argument = argument;
        this._all = all;
    }

    get argument() {
        return this._argument;
    }

    get all() {
        return this._all;
    }
}
