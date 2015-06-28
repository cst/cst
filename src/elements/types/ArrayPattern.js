import Node from '../Node';

export default class ArrayPattern extends Node {
    constructor(childNodes) {
        super('ArrayPattern', childNodes);
    }

    _acceptChildren(children) {
        var elements = [];
        children.passToken('Punctuator', '[');
        children.skipNonCode();
        while (!children.isToken('Punctuator', ']')) {
            if (children.isToken('Punctuator', ',')) {
                elements.push(null);
                children.moveNext();
                children.skipNonCode();
            } else {
                children.assertPattern();
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
        this._elements = elements;
    }

    get elements() {
        return this._elements.concat();
    }

    isPattern() {
        return true;
    }

    isAssignable() {
        return true;
    }
}
