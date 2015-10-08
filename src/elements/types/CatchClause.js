import Node from '../Node';

export default class CatchClause extends Node {
    constructor(childNodes) {
        super('CatchClause', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'catch');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        // TODO: Using `esprima-fb` we have expressions... why?
        let param = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        let body = children.passStatement('BlockStatement');
        children.assertEnd();

        this._param = param;
        this._body = body;
    }

    get body() {
        return this._body;
    }

    get param() {
        return this._param;
    }
}
