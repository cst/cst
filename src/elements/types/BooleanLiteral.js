import Expression from '../Expression';

export default class BooleanLiteral extends Expression {
    constructor(childNodes) {
        super('BooleanLiteral', childNodes);
    }

    _acceptChildren(children) {
        children.assertToken('Boolean');
        let value = children.currentElement.value;

        children.moveNext();
        children.assertEnd();

        this._value = value;
    }

    get value() {
        return this._value;
    }
}
