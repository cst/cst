import Node from '../Node';

export default class VariableDeclarator extends Node {

    // TODO: Initial value is required for const.

    constructor(childNodes) {
        super('VariableDeclarator', childNodes);
    }

    _acceptChildren(children) {
        let id = children.passPattern();

        let init = null;
        if (!children.isEnd) {
            children.skipNonCode();
            children.passToken('Punctuator', '=');

            children.skipNonCode();
            init = children.passExpression();
        }

        children.assertEnd();

        this.id = id;
        this.init = init;
    }
}
