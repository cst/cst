import Statement from '../Statement';

export default class TryStatement extends Statement {
    constructor(childNodes) {
        super('TryStatement', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'try');
        children.skipNonCode();

        let block = children.passStatement('BlockStatement');
        children.skipNonCode();

        let handler = null;
        if (children.isNode('CatchClause')) {
            handler = children.passNode();
        }

        let finalizer = null;
        if (!children.isEnd) {
            children.skipNonCode();
            children.passToken('Keyword', 'finally');
            children.skipNonCode();
            finalizer = children.passStatement('BlockStatement');
        }

        children.assertEnd();

        this.block = block;
        this.finalizer = finalizer;
        this.handler = handler;
    }
}
