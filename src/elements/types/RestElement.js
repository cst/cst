import Node from '../Node';

export default class RestElement extends Node {

    // TODO: Requires a function?

    constructor(childNodes) {
        super('RestElement', childNodes);
    }

    _acceptChildren(children) {
        let argument = null;

        children.passToken('Punctuator', '...');

        children.skipNonCode();

        children.assertPattern();
        argument = children.currentElement;
        children.moveNext();

        children.assertEnd();

        this._argument = argument;
    }

    get argument() {
        return this._argument;
    }

    isPattern() {
        return true;
    }
}
