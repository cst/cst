import Expression from '../Expression';

export default class JSXMemberExpression extends Expression {
    constructor(childNodes) {
        super('JSXMemberExpression', childNodes);
    }

    _acceptChildren(children) {
        let object = children.passOneOfNode(['JSXMemberExpression', 'JSXIdentifier']);
        children.skipNonCode();
        children.passToken('Punctuator', '.');
        children.skipNonCode();
        let property = children.passNode('JSXIdentifier');
        children.assertEnd();

        this.object = object;
        this.property = property;
    }
}
