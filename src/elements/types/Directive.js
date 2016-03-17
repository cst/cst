import Statement from '../Statement';

export default class Directive extends Statement {
    constructor(childNodes) {
        super('Directive', childNodes);
    }

    _acceptChildren(children) {
        this._value = children.passExpression();
        children.skipNonCode();
        children.skipSemicolon();
        children.assertEnd();
    }

    get value() {
        return this._value;
    }
}
