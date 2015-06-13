import Expression from '../Expression';
import ElementList from '../ElementList';

export default class ConditionalExpression extends Expression {

    // TODO: Should respect operator precedence: putting "a + b" before " * b" without parens should raise an error.

    constructor(childNodes) {
        super('ConditionalExpression', childNodes);
    }

    _acceptChildren(children) {
        let test = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', '?');
        children.skipNonCode();

        let consequent = children.passExpression();
        children.skipNonCode();

        children.passToken('Punctuator', ':');
        children.skipNonCode();

        let alternate = children.passExpression();
        children.skipNonCode();

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
