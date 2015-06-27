import Expression from '../Expression';

export default class ObjectExpression extends Expression {
    constructor(childNodes) {
        super('ObjectExpression', childNodes);
    }

    _acceptChildren(children) {
        var properties = [];

        children.passToken('Punctuator', '{');
        children.skipNonCode();

        while (!children.isToken('Punctuator', '}')) {
            if (children.isToken('Punctuator', ',')) {
                children.moveNext();
                children.skipNonCode();
                children.assertToken('Punctuator', '}');
            } else {
                properties.push(children.passNode('Property'));
                children.skipNonCode();
                if (children.isToken('Punctuator', ',')) {
                    children.moveNext();
                    children.skipNonCode();
                }
            }
        }

        children.passToken('Punctuator', '}');
        children.assertEnd();

        this._properties = properties;
    }

    get properties() {
        return this._properties.concat();
    }
}
