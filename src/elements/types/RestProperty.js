import Node from '../Node';

export default class RestProperty extends Node {
    constructor(childNodes) {
        super('RestProperty', childNodes);
    }

    _acceptChildren(children) {
        let argument = null;

        children.passToken('Punctuator', '...');
        children.skipNonCode();
        argument = children.passExpression();
        children.assertEnd();

        this._argument = argument;
    }

    get argument() {
        return this._argument;
    }
}
