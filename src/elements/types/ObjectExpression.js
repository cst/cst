import Expression from '../Expression';

export default class ObjectExpression extends Expression {
    constructor(childNodes) {
        super('ObjectExpression', childNodes);
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
                if (children.isNode('SpreadElement')) {
                    properties.push(children.passNode('SpreadElement'));
                } else if (children.isNode('ObjectProperty')) {
                    properties.push(children.passNode('ObjectProperty'));
                } else {
                    properties.push(children.passNode('ObjectMethod'));
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
