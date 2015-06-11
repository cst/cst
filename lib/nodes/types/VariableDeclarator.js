import Node from '../Node';

export default class VariableDeclarator extends Node {
    constructor(childNodes) {
        super('VariableDeclarator', childNodes);
    }

    _acceptChildren(children) {

    }
}
