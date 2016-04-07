import Node from '../Node';

export default class RestElement extends Node {

    // TODO: Requires a function?

    constructor(childNodes) {
        super('RestElement', childNodes);
        this.isPattern = true;
    }

    _acceptChildren(children) {
        children.passToken('Punctuator', '...');

        children.skipNonCode();

        if (!children.isNode('MemberExpression')) {
            children.assertPattern();
        }

        let argument = children.currentElement;
        children.moveNext();

        children.assertEnd();

        this.argument = argument;
    }
}
