import Node from '../Node';

export default class SpreadElement extends Node {
    constructor(childNodes) {
        super('SpreadElement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Punctuator', '...');
        children.skipNonCode();
        let argument = children.passExpression();
        children.assertEnd();

        this.argument = argument;
    }
}
