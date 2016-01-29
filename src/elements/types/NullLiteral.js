import Expression from '../Expression';

export default class NullLiteral extends Expression {
    constructor(childNodes) {
        super('NullLiteral', childNodes);
    }

    _acceptChildren(children) {
        children.assertToken('Null');
        children.moveNext();
        children.assertEnd();
    }
}
