import Node from '../Node';

export default class SpreadProperty extends Node {
    constructor(childNodes) {
        super('SpreadProperty', childNodes);
    }

    _acceptChildren(children) {
        let argument;

        children.passToken('Punctuator', '...');
        children.skipNonCode();
        argument = children.passExpression();
        children.assertEnd();

        this.argument = argument;
    }
}
