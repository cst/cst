import Node from '../Node';

export default class ArrayPattern extends Node {
    constructor(childNodes) {
        super('ArrayPattern', childNodes);
        this.isPattern = true;
        this.isAssignable = true;
    }

    _acceptChildren(children) {
        let elements = [];
        children.passToken('Punctuator', '[');
        children.skipNonCode();
        while (!children.isToken('Punctuator', ']')) {
            if (children.isToken('Punctuator', ',')) {
                elements.push(null);
                children.moveNext();
                children.skipNonCode();
            } else {
                if (!children.isNode('MemberExpression')) {
                    children.assertPattern();
                }
                elements.push(children.currentElement);
                children.moveNext();
                children.skipNonCode();
                if (children.isToken('Punctuator', ',')) {
                    children.moveNext();
                    children.skipNonCode();
                }
            }
        }
        children.passToken('Punctuator', ']');
        children.assertEnd();
        this.elements = elements;
    }
}
