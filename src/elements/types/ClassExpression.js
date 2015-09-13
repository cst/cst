import Expression from '../Expression';

export default class ClassExpression extends Expression {
    constructor(childNodes) {
        super('ClassExpression', childNodes);
    }

    _acceptChildren(children) {
        children.passToken('Keyword', 'class');
        children.skipNonCode();

        let id = null;
        if (!children.isToken('Keyword', 'extends') && !children.isNode('ClassBody')) {
            id = children.passNode('Identifier');
            children.skipNonCode();
        }

        let superClass = null;
        if (children.isToken('Keyword', 'extends')) {
            children.passToken('Keyword', 'extends');
            children.skipNonCode();
            superClass = children.passExpression();
            children.skipNonCode();
        }

        let body = children.passNode('ClassBody');
        children.assertEnd();

        this._id = id;
        this._superClass = superClass;
        this._body = body;
    }

    get id() {
        return this._id;
    }

    get superClass() {
        return this._superClass;
    }

    get body() {
        return this._body;
    }
}
