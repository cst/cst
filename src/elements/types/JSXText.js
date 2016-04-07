import Expression from '../Expression';

export default class JSXText extends Expression {
    constructor(childNodes) {
        super('JSXText', childNodes);
    }

    _acceptChildren(children) {
        children.assertToken();
        let value = children.currentElement.value;

        children.moveNext();
        children.assertEnd();

        this.value = value;
    }
}
