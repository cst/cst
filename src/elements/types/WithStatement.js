import Statement from '../Statement';

export default class WithStatement extends Statement {
    constructor(childNodes) {
        super('WithStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'with');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        let object = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this._object = object;
        this._body = body;
    }

    get object() {
        return this._object;
    }

    get body() {
        return this._body;
    }
}
