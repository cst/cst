import Node from '../Node';

export default class VariableDeclarator extends Node {
    constructor(childNodes) {
        super('VariableDeclarator', childNodes);
    }

    _acceptChildren(children) {
        children.assertPattern();
        let id = children.currentElement;
        children.moveNext();

        let init = null;
        if (!children.isEnd) {
            children.skipNonCode();
            children.passToken('Punctuator', '=');

            children.skipNonCode();
            init = children.passExpression();
        }

        children.assertEnd();

        this._id = id;
        this._init = init;
    }

    get id() {
        return this._id;
    }

    get init() {
        return this._init;
    }
}
