import Node from '../Node';

function isCode({currentElement}) {
    const {isCode} = currentElement || {};
    return (isCode !== false);
}

export default class ClassBody extends Node {
    constructor(childNodes) {
        super('ClassBody', childNodes);
    }

    _acceptChildren(children) {
        let body = [];

        children.assertToken('Punctuator', '{');
        children.moveNext();
        children.skipNonCode();

        while (!children.isToken('Punctuator', '}')) {
            if (children.isToken('Punctuator', ';')) {
                // For the class Test { x() {}; } case
                children.passToken('Punctuator', ';');
            } else if (!isCode(children)) {
                children.skipNonCode();
            } else {
                children.assertOneOfNode(['ClassProperty', 'ClassMethod']);
                if (children.isNode('ClassProperty')) {
                    body.push(children.passNode('ClassProperty'));
                } else if (children.isNode('ClassMethod')) {
                    body.push(children.passNode('ClassMethod'));
                }
            }
        }

        children.passToken('Punctuator', '}');
        children.assertEnd();

        this.body = body;
    }
}
