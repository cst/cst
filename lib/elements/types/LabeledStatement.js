import Statement from '../Statement';

export default class LabeledStatement extends Statement {
    constructor(childNodes) {
        super('LabeledStatement', childNodes);
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
