import Node from '../Node';

export default class ClassBody extends Node {
    constructor(childNodes) {
        super('ClassBody', childNodes);
    }

    _acceptChildren(children) {
        var body = [];

        children.assertToken('Punctuator', '{');
        children.moveNext();
        children.skipNonCode();

        while (!children.isToken('Punctuator', '}')) {
            if (children.isNode('ClassProperty')) {
                body.push(children.passNode('ClassProperty'));
            }

            if (children.isNode('ClassMethod')) {
                body.push(children.passNode('ClassMethod'));
            }

            // For the class Test { x() {}; } case
            if (children.isToken('Punctuator', ';')) {
                children.passToken('Punctuator', ';');
            }

            children.skipNonCode();
        }

        children.passToken('Punctuator', '}');
        children.assertEnd();

        this.body = body;
    }
}
