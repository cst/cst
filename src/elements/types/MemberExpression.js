import Expression from '../Expression';

export default class MemberExpression extends Expression {
    constructor(childNodes) {
        super('MemberExpression', childNodes);
        this.isAssignable = true;
    }

    _acceptChildren(children) {
        let object = children.passExpressionOrSuper();
        children.skipNonCode();

        let property;
        let computed = false;
        if (children.isToken('Punctuator', '.')) {
            children.passToken();
            children.skipNonCode();

            property = children.passNode('Identifier');
            computed = false;
        } else {
            children.passToken('Punctuator', '[');
            children.skipNonCode();
            property = children.passExpression();
            children.skipNonCode();
            children.passToken('Punctuator', ']');
            computed = true;
        }

        children.assertEnd();

        this.object = object;
        this.property = property;
        this.computed = computed;
    }
}
