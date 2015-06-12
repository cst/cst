import Statement from '../Statement';
import ElementList from '../ElementList';

export default class IfStatement extends Statement {
    constructor(childNodes) {
        super('IfStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'if');
        children.skipNonCode();

        children.passToken('Punctuator', '(');
        children.skipNonCode();

        let test = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ')');
        children.skipNonCode();

        let consequent = children.passStatement();

        children.skipNonCode();

        let alternate = null;
        if (children.isToken('Keyword', 'else')) {
            children.moveNext();
            children.skipNonCode();
            alternate = children.passStatement();
        }

        children.assertEnd();

        this._test = test;
        this._consequent = consequent;
        this._alternate = alternate;
    }

    get test() {
        return this._test;
    }

    get consequent() {
        return this._consequent;
    }

    get alternate() {
        return this._alternate;
    }
}
