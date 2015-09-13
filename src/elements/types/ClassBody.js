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
            body.push(children.passNode('MethodDefinition'));
            children.skipNonCode();
        }

        children.passToken('Punctuator', '}');
        children.assertEnd();

        this._body = body;
    }

    get body() {
        return this._body.concat();
    }
}
