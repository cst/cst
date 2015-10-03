import Node from '../Node';

export default class JSXSpreadAttribute extends Node {
    constructor(childNodes) {
        super('JSXSpreadAttribute', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Punctuator', '{');
        children.skipNonCode();
        children.passToken('Punctuator', '...');
        children.skipNonCode();
        let argument = children.passExpression();
        children.skipNonCode();
        children.passToken('Punctuator', '}');
        children.assertEnd();

        this._argument = argument;
    }

    get argument() {
        return this._argument;
    }
}
