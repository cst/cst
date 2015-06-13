import Statement from '../Statement';
import ElementList from '../ElementList';

export default class WhileStatement extends Statement {
    constructor(childNodes) {
        super('WhileStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'while');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        let test = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        let body = children.passStatement();

        children.assertEnd();

        this._test = test;
        this._body = body;
    }

    get test() {
        return this._test;
    }

    get body() {
        return this._body;
    }
}
