import Node from '../Node';

export default class AssignmentPattern extends Node {
    constructor(childNodes) {
        super('AssignmentPattern', childNodes);
        this.isPattern = true;
    }

    _acceptChildren(children) {
        let left = children.passPattern();
        children.skipNonCode();
        children.passToken('Punctuator', '=');
        children.skipNonCode();
        let right = children.passExpression();
        children.assertEnd();

        this.left = left;
        this.right = right;
    }
}
