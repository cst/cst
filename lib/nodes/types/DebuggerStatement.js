import Statement from '../Statement';

export default class DebuggerStatement extends Statement {
    constructor(childNodes) {
        super('DebuggerStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'debugger');
        children.skipNonCode();
        children.skipSemicolon();
        children.assertEnd();
    }
}
