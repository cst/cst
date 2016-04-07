import Statement from '../Statement';

export default class ClassDeclaration extends Statement {
    constructor(childNodes) {
        super('ClassDeclaration', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'class');
        children.skipNonCode();

        let superClass = null;
        let id = null;

        if (children.isNode('Identifier')) {
            id = children.passNode('Identifier');
            children.skipNonCode();
        }

        if (children.isToken('Keyword', 'extends')) {
            children.passToken('Keyword', 'extends');
            children.skipNonCode();
            superClass = children.passExpression();
            children.skipNonCode();
        }

        let body = children.passNode('ClassBody');
        children.assertEnd();

        this.id = id;
        this.superClass = superClass;
        this.body = body;
    }
}
