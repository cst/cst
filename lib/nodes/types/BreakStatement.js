import Statement from '../Statement';
import ElementList from '../ElementList';

export default class BreakStatement extends Statement {
    constructor(childNodes) {
        super('BreakStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'break');
        children.skipSameLineNonCode();

        let label = null;
        if (!children.isEnd) {
            if (children.isToken('Punctuator', ';')) {
                children.passToken();
            } else {
                label = children.passNode('Identifier');
                children.skipNonCode();
                children.skipSemicolon();
            }
        }

        children.assertEnd();

        this._label = label;
    }

    get label() {
        return this._label;
    }
}
