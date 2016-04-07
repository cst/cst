import Expression from '../Expression';

export default class TemplateLiteral extends Expression {
    constructor(childNodes) {
        super('TemplateLiteral', childNodes);
    }

    _acceptChildren(children) {
        let quasis = [];
        let expressions = [];

        children.passToken('Punctuator', '`');
        while (!children.isToken('Punctuator', '`')) {
            if (children.isNode('TemplateElement')) {
                quasis.push(children.passNode('TemplateElement'));
            } else {
                children.passToken('Punctuator', '${');
                children.skipNonCode();
                expressions.push(children.passExpression());
                children.skipNonCode();
                children.passToken('Punctuator', '}');
            }
        }
        children.passToken('Punctuator', '`');

        if (quasis.length > 0) {
            quasis[quasis.length - 1].tail = true;
        }

        this.quasis = quasis;
        this.expressions = expressions;
    }
}
