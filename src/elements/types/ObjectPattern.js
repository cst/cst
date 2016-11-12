import Node from '../Node';

export default class ObjectPattern extends Node {
    constructor(childNodes) {
        super('ObjectPattern', childNodes);
        this.isPattern = true;
        this.isAssignable = true;
    }

    _acceptChildren(children) {
        let properties = [];
        children.passToken('Punctuator', '{');
        children.skipNonCode();
        while (!children.isToken('Punctuator', '}')) {
            if (children.isToken('Punctuator', ',')) {
                children.moveNext();
                children.skipNonCode();
                children.assertToken('Punctuator', '}');
            } else {
                if (children.isNode('RestProperty')) {
                    properties.push(children.passNode('RestProperty'));
                } else {
                    properties.push(children.passNode('ObjectProperty'));
                }
                children.skipNonCode();
                if (children.isToken('Punctuator', ',')) {
                    children.moveNext();
                    children.skipNonCode();
                }
            }
        }
        children.passToken('Punctuator', '}');
        children.assertEnd();
        this.properties = properties;
    }
}
