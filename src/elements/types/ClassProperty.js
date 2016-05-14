import Node from '../Node';

export default class ClassProperty extends Node {
    constructor(childNodes) {
        super('ClassProperty', childNodes);
    }

    _acceptChildren(children) {
        this.static = false;
        this.value = null;

        if (children.isToken('Identifier', 'static')) {
            this.static = true;
            children.passToken();
            children.skipNonCode();
        }

        this.key = children.passAssignable();
        children.skipNonCode();

        if (children.isToken('Punctuator', '=')) {
            children.passToken('Punctuator', '=');
            children.skipNonCode();

            this.value = children.passNode();
        }

        children.assertEnd();

        // What is computed Class property?
        // See https://github.com/jeffmo/es-class-fields-and-static-properties/issues/33
        // It seems babylon doesn't support it at this stage
        this.computed = false;
    }
}
