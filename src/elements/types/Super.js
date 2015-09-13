import Node from '../Node';

export default class Super extends Node {
    constructor(childNodes) {
        super('Super', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'super');
        children.assertEnd();
    }
}
