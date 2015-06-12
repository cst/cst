import Expression from '../Expression';

export default class Identifier extends Expression {
    constructor(childNodes) {
        super('Identifier', childNodes);
    }

    _acceptChildren(children) {
        let name = children.passToken('Identifier').value;
        children.assertEnd();
        this._name = name;
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
