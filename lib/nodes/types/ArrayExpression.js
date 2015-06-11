import Expression from '../Expression';
import NodeList from '../NodeList';

export default class ArrayExpression extends Expression {
    constructor(childNodes) {
        super('ArrayExpression', childNodes);
    }

    _acceptChildren(children) {
        var elements = [];
        children.assertToken('Punctuator', '[');
        children.moveNext();
        children.skipNonCode();
        while (!children.isToken('Punctuator', ']')) {
            if (children.isToken('Punctuator', ',')) {
                elements.push(null);
                children.moveNext();
                children.skipNonCode();
            } else {
                elements.push(children.getExpression());
                children.skipNonCode();
                if (children.isToken('Punctuator', ',')) {
                    children.moveNext();
                    children.skipNonCode();
                }
            }
        }
        children.assertToken('Punctuator', ']');
        children.moveNext();
        children.assertEnd();
        this._elements = new NodeList(elements);
    }

    get elements() {
        return this._elements;
    }
}
