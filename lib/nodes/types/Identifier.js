import Expression from '../Expression';

export default class Identifier extends Expression {
    constructor(childNodes) {
        super('Identifier', childNodes);
    }

    _acceptChildren(children) {
        children.assertToken('Identifier');
        children.moveNext();
        children.assertEnd();
    }

    get isPattern() {
        return true;
    }

    get isAssignable() {
        return true;
    }
}
