import Expression from '../Expression';

export default class ObjectMethod extends Expression {
    constructor(childNodes) {
        super('ObjectMethod', childNodes);
    }

    _acceptChildren(children) {

    }
}
