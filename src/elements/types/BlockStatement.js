import Statement from '../Statement';

export default class BlockStatement extends Statement {
    constructor(childNodes) {
        super('BlockStatement', childNodes);
    }

    _acceptChildren(children) {
        let body = [];
        let directives = [];

        children.assertToken('Punctuator', '{');
        children.moveNext();
        children.skipNonCode();

        while (children.isNode('Directive')) {
            directives.push(children.passNode());
            children.skipNonCode();
        }

        while (!children.isToken('Punctuator', '}')) {
            body.push(children.passStatement());
            children.skipNonCode();
        }

        children.passToken('Punctuator', '}');
        children.assertEnd();

        this.body = body;
        this.directives = directives;
    }
}
