import Node from '../Node';

export default class TemplateElement extends Node {
    constructor(childNodes) {
        super('TemplateElement', childNodes);
    }

    _acceptChildren(children) {
        let templateToken = children.passToken('Template');

        let tail = false;
        let value = {
            cooked: templateToken.value,
            raw: templateToken.sourceCode
        };

        children.assertEnd();

        this._tail = tail;
        this._value = value;
    }

    get tail() {
        return this._tail;
    }

    set tail(bool) {
        this._tail = bool;
    }

    get value() {
        return this._value;
    }
}
