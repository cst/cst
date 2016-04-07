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

        let param = children.passPattern();
        children.skipNonCode();

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        let body = children.passStatement('BlockStatement');
        children.assertEnd();

        this.param = param;
        this.body = body;
    }
}
