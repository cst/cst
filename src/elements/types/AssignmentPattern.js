import Node from '../Node';

export default class AssignmentPattern extends Node {
    constructor(childNodes) {
        super('AssignmentPattern', childNodes);
    }

    _acceptChildren(children) {

        let left = children.passPattern();
        children.skipNonCode();
        children.passToken('Punctuator', '=');
        children.skipNonCode();
        let right = children.passExpression();
        children.assertEnd();

        this._left = left;
        this._right = right;
    }

    get left() {
        return this._left;
    }

    get right() {
        return this._right;
    }

    isPattern() {
        return true;
    }
}
