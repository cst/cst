import Node from '../Node';
import NodeList from '../NodeList';

export default class ArrayPattern extends Node {
    constructor(childNodes) {
        super('ArrayPattern', childNodes);
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
                children.assertPattern();
                elements.push(children.currentNode);
                children.moveNext();
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

    isPattern() {
        return true;
    }

    isAssignable() {
        return true;
    }
}
