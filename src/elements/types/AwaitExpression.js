import Expression from '../Expression';

export default class AwaitExpression extends Expression {

    // TODO: Requires an async function.

    constructor(childNodes) {
        super('AwaitExpression', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Identifier', 'await');

        let argument = null;

        if (!children.isEnd) {
            children.skipNonCode();
            argument = children.passExpression();
        }

        children.assertEnd();

        this._argument = argument;
    }

    get argument() {
        return this._argument;
    }
}
