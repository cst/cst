import Node from '../Node';

export default class RestProperty extends Node {
    constructor(childNodes) {
        super('RestProperty', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Punctuator', '...');
        children.skipNonCode();
        let argument = children.passExpression();
        children.assertEnd();

        this.argument = argument;
    }
}
