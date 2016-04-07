import Expression from '../Expression';

export default class TaggedTemplateExpression extends Expression {
    constructor(childNodes) {
        super('TaggedTemplateExpression', childNodes);
    }

    _acceptChildren(children) {
        let tag = children.passExpression();
        children.skipNonCode();
        let quasi = children.passNode('TemplateLiteral');

        this.tag = tag;
        this.quasi = quasi;
    }
}
