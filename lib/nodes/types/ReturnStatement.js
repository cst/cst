import Statement from '../Statement';
import ElementList from '../ElementList';

export default class ReturnStatement extends Statement {
    constructor(childNodes) {
        super('ReturnStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'return');
        children.skipSameLineNonCode();

        let argument = null;
        if (!children.isEnd) {
            if (children.isToken('Punctuator', ';')) {
                children.passToken();
            } else {
                argument = children.passExpression();
                children.skipNonCode();
                children.skipSemicolon();
            }
        }

        children.assertEnd();

        this._argument = argument;
    }

    get argument() {
        return this._argument;
    }
}
