import Statement from '../Statement';
import ElementList from '../ElementList';

export default class LabeledStatement extends Statement {
    constructor(childNodes) {
        super('BlockStatement', childNodes);
    }

    _acceptChildren(children) {
        let label = children.passNode('Identifier');
        children.skipNonCode();

        children.passToken('Punctuator', ':');
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this._label = label;
        this._body = body;
    }

    get label() {
        return this._label;
    }

    get body() {
        return this._body;
    }
}
