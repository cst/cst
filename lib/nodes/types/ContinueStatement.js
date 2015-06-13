import Statement from '../Statement';
import ElementList from '../ElementList';

export default class ContinueStatement extends Statement {
    constructor(childNodes) {
        super('ContinueStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'continue');

        let label = null;
        if (!children.isEnd) {
            children.skipSameLineNonCode();
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
