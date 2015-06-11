import Expression from '../Expression';

export default class Identifier extends Expression {
    constructor(childNodes) {
        super('Identifier', childNodes);
    }

    _acceptChildren(children) {
        children.assertToken('Identifier');
        this._name = children.currentElement.value;
        children.moveNext();
        children.assertEnd();
    }

    get isPattern() {
        return true;
    }

    get isAssignable() {
        return true;
    }

    get name() {
        return this._name;
    }
}
