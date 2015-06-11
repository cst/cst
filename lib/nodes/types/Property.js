import Node from '../Node';

export default class Property extends Node {
    constructor(childNodes) {
        super('Property', childNodes);
    }

    _acceptChildren(children) {
        if (children.currentElement.type !== 'Literal') {
            children.assertExpression('Identifier');
        }
        let key = children.currentElement;
        children.moveNext();
        children.skipNonCode();
        let value;
        if (children.isEnd) {
            value = key;
        } else {
            children.passToken('Punctuator', ':');
            children.skipNonCode();
            value = children.getExpression();
        }
        children.assertEnd();

        this._kind = 'init';
        this._key = key;
        this._value = value;
    }

    get key() {
        return this._key;
    }

    get value() {
        return this._value;
    }

    get kind() {
        return this._kind;
    }
}
