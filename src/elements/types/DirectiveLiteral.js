import Expression from '../Expression';

export default class DirectiveLiteral extends Expression {
    constructor(childNodes) {
        super('DirectiveLiteral', childNodes);
    }

    _acceptChildren(children) {
        children.assertToken();
        let value = children.currentElement.value;
        let rawValue = children.currentElement.getSourceCode();

        children.moveNext();
        children.assertEnd();

        this.value = value;
        this.raw = rawValue;
    }
}
